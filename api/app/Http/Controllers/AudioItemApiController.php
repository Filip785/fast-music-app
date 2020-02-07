<?php

namespace App\Http\Controllers;

use App\AudioItem;
use App\AudioItemUser;
use App\Http\Requests\AddEditAudioItem;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AudioItemApiController extends Controller
{
	public function index(Request $request)
	{
		$data = $request->all();

		$currentUser = User::find($data['userId']);

		$audioItems = $currentUser->accessibleItems;

		// process
		$audioItemsReturn = [];

		foreach($audioItems as $k => $audioItem) {
			$uploader = $audioItem->uploader;

			$audioItemsReturn[$k] = [
				'id' => $audioItem->id,
				'toggle' => false,
				'songTitle' => $audioItem->songTitle,
				'artistName' => $audioItem->artist->artistName,
				'url' => $audioItem->audioUrl,
				'uploader' => [
					'id' => $uploader->id,
					'name' => $uploader->name
				]
			];
		}

		return response()->json([
			'audioItems' => $audioItemsReturn
		], 200);
	}

	public function details(Request $request, $audioItemId) {
		$authUserId = intval($request->all()['authUserId']);

		$audioItem = AudioItem::with(['artist', 'allowedUsers' => function($query) use ($authUserId) {
			$query->where('user_id', '!=', $authUserId);
		}])->get()->find($audioItemId);

		if($audioItem->uploaderId !== $authUserId) {
			return response()->json([
				'unauthorized' => "You can't edit this file."
			], 403);
		}

		return response()->json([
			'audioItem' => $audioItem
		], 200);
	}

	public function edit(AddEditAudioItem $request, $audioItemId)
	{
		$data = $request->all();
		$audioItem = AudioItem::find($audioItemId);

		$prevVisibility = $audioItem->visibility;

		$audioItem->songTitle = $data['songTitle'];
		$audioItem->artistId = $data['artistId'];
		$audioItem->audioUrl = $data['fileName'];
		$audioItem->uploaderId = $data['uploaderId'];
		$audioItem->visibility = $data['visibility'];

		$audioItem->save();

		$newVisibility = intval($audioItem->visibility);

		$uploader = $audioItem->uploader;

		if($prevVisibility === 0) {
			// it was public

			// if new is private, remove everyone except uploader
			// if new is specific, keep uploader + add others

			if($newVisibility === 1) {
				//$usersToDetach = $audioItem->allowedUsers->whereNotIn('id', $audioItem->uploaderId)->all();
				$usersToDetach = User::whereNotIn('id', [$audioItem->uploaderId])->get(['id']);

				$audioItem->allowedUsers()->detach($usersToDetach);
			}

			if($newVisibility === 2) {
				$usersToDetach = User::whereNotIn('id', [$audioItem->uploaderId])->get(['id']);

				$audioItem->allowedUsers()->detach($usersToDetach);

				$audioItem->allowedUsers()->attach($data['allowedUsers']);
			}
		}

		if($prevVisibility === 1) {
			// it was private

			// if new is public, add to everyone else
			// if new is specific, keep uploader + add others

			if($newVisibility === 0) {
				$usersToAttach = User::whereNotIn('id', [$audioItem->uploaderId])->get(['id']);// $audioItem->allowedUsers->whereNotIn('id', $audioItem->uploaderId)->all();

				$audioItem->allowedUsers()->attach($usersToAttach);
			}

			if($newVisibility === 2) {
				$audioItem->allowedUsers()->attach($data['allowedUsers']);
			}
		}

		if($prevVisibility === 2) {
			// it was specific

			// if new is public, remove everyone except uploader, then add to everyone else except uploader
			// if new is private, remove everyone except uploader

			if($newVisibility === 0) {
				$usersAlreadyIncluded = $audioItem->allowedUsers()->select(['user_id'])->get()->all();
				$usersAlreadyIncluded = array_map(function($item) {
					return $item->user_id;
				}, $usersAlreadyIncluded);

				$usersToAttach = User::whereNotIn('id', $usersAlreadyIncluded)->get('id');


				$audioItem->allowedUsers()->attach($usersToAttach);
			}

			if($newVisibility === 1) {
				$usersToDetach = User::whereNotIn('id', [$audioItem->uploaderId])->get(['id']);

				$audioItem->allowedUsers()->detach($usersToDetach);
			}

			if($newVisibility === 2) {
				$usersToDetach = User::whereNotIn('id', [$audioItem->uploaderId])->get(['id']);

				$audioItem->allowedUsers()->detach($usersToDetach);

				$audioItem->allowedUsers()->attach($data['allowedUsers']);
			}
		}

		return response()->json([
			'audioItem' => [
				'id' => $audioItem->id,
				'songTitle' => $audioItem->songTitle,
				'toggle' => false,
				'artistName' => $audioItem->artist->artistName,
				'uploader' => [
					'id' => $uploader->id,
					'name' => $uploader->name
				]
			]
		], 200);
	}

	public function add(AddEditAudioItem $request)
	{
		$data = $request->all();

		$fileUpload = file_get_contents($data['fileUpload']);
		Storage::disk('public')->put('audio/'.$data['fileName'], $fileUpload);

		$audioItem = AudioItem::create([
			'songTitle' => $data['songTitle'],
			'artistId' => $data['artistId'],
			'audioUrl' => asset('storage/audio/'.$data['fileName']),
			'uploaderId' => $data['uploaderId'],
			'visibility' => $data['visibility']
		]);

		$uploader = $audioItem->uploader;

		switch($data['visibility']) {
			// public
			case 0:
				$allUsers = User::all();
				$audioItem->allowedUsers()->attach($allUsers);
				break;
			// private
			case 1:
				$audioItem->allowedUsers()->save($uploader);
				break;
			// specific users
			case 2:
				$wantedUsers = User::find($data['allowedUsers']);
				$wantedUsers->prepend($uploader);

				$audioItem->allowedUsers()->attach($wantedUsers);
				break;
			default:
				die('mistake');
				break;
		}

		return response()->json([
			'audioItem' => [
				'id' => $audioItem->id,
				'songTitle' => $audioItem->songTitle,
				'toggle' => false,
				'artistName' => $audioItem->artist->artistName,
				'uploader' => [
					'id' => $uploader->id,
					'name' => $uploader->name
				]
			]
		], 200);
	}

	public function like(Request $request) {
		$data = $request->all();

		$audioItemUser = AudioItemUser::where(['audio_item_id' => $data['audioItemId'], 'user_id' => $data['userId']])->first();
		$audioItemUser->like = 1;
		$audioItemUser->save();

		$count = AudioItemUser::where(['audio_item_id' => $data['audioItemId'], 'like' => 1])->count();

		return response()->json([
			'like' => $count
		], 200);
	}
}
