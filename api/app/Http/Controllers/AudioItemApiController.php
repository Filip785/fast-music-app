<?php

namespace App\Http\Controllers;

use App\AudioItem;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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

	public function create(Request $request)
	{
		$data = $request->all();

		$validator = Validator::make($data, [
			'songTitle' => 'required',
			'artistId' => 'required',
			'fileUpload' => 'required'
		], [
			'songTitle.required' => 'Please enter song title.',
			'artistId.required' => 'Please choose an artist.',
			'fileUpload.required' => 'Please choose a audio file.',
			'allowedUsers.required' => 'Please pick at least one user to share with.'
		]);

		$validator->sometimes('allowedUsers', 'required', function ($input) {
			return intval($input->visibility) === 2;
		});

		if($validator->fails()) {
			return response()->json($validator->errors(), 422);
		}

		$fileUpload = file_get_contents($data['fileUpload']);
		Storage::disk('public')->put('audio/'.$data['fileName'], $fileUpload);

		$audioItem = AudioItem::create([
			'songTitle' => $data['songTitle'],
			'artistId' => $data['artistId'],
			'audioUrl' => asset('storage/audio/'.$data['fileName']),
			'uploaderId' => $data['uploaderId']
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
}
