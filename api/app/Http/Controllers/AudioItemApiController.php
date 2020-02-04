<?php

namespace App\Http\Controllers;

use App\AudioItem;
use Illuminate\Http\Request;

class AudioItemApiController extends Controller
{
	public function index(Request $request)
	{
		$audioItems = AudioItem::all();


		// process
		$audioItemsReturn = [];

		foreach($audioItems as $k => $audioItem) {
			$audioItemsReturn[$k] = [
				'id' => $audioItem->id,
				'toggle' => false,
				'songTitle' => $audioItem->songTitle,
				'artistName' => $audioItem->artist->artistName,
				// fixed temporary, until file upload is added
				'url' => 'http://localhost/audio/smoke.mp3'
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
			'artistId' => 'required'
		]);

		$data = $request->all();

		$audioItem = AudioItem::create([
			'songTitle' => $data['songTitle'],
			'artistId' => $data['artistId']
		]);

		return response()->json([
			'audioItem' => [
				'id' => $audioItem->id,
				'songTitle' => $audioItem->songTitle,
				'toggle' => false,
				'artistName' => $audioItem->artist->artistName
			]
		], 200);
	}
}
