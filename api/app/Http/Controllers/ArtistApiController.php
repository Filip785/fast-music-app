<?php

namespace App\Http\Controllers;

use App\Artist;
use Illuminate\Http\Request;

class ArtistApiController extends Controller
{
    public function create(Request $request) {
	    $request->validate([
		    'artistName' => 'required|unique:artists',
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
