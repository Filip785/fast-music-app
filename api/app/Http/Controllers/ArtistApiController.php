<?php

namespace App\Http\Controllers;

use App\Artist;
use Illuminate\Http\Request;

class ArtistApiController extends Controller
{
	public function index()
	{
		return response()->json([
			'artists' => Artist::all()
		], 200);
	}

	public function create(Request $request)
	{
		$request->validate([
			'artistName' => 'bail|required|unique:artists',
		]);

		// add validation
		$data = $request->all();

		$artist = Artist::create([
			'artistName' => $data['artistName']
		]);

		return response()->json([
			'artist' => $artist
		], 200);
	}
}
