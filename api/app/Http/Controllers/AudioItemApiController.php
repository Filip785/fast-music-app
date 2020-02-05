<?php

namespace App\Http\Controllers;

use App\AudioItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AudioItemApiController extends Controller
{
	public function index(Request $request)
	{
		$audioItems = AudioItem::all();

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
		$request->validate([
			'songTitle' => 'required',
			'artistId' => 'required',
			'fileUpload' => 'required'
		], [
			'songTitle.required' => 'Please enter song title.',
			'artistId.required' => 'Please choose an artist.',
			'fileUpload.required' => 'Please choose a audio file.'
		]);

		$data = $request->all();

		$fileUpload = file_get_contents($data['fileUpload']);
		Storage::disk('public')->put('audio/'.$data['fileName'], $fileUpload);

		$audioItem = AudioItem::create([
			'songTitle' => $data['songTitle'],
			'artistId' => $data['artistId'],
			'audioUrl' => asset('storage/audio/'.$data['fileName']),
			'uploaderId' => $data['uploaderId']
		]);

		$uploader = $audioItem->uploader;

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
