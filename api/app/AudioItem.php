<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AudioItem extends Model
{
	protected $fillable = [
		'songTitle', 'artistId', 'audioUrl', 'uploaderId'
	];

	public function artist() {
		return $this->hasOne('App\Artist', 'id', 'artistId');
	}

	public function uploader() {
		return $this->hasOne('App\User', 'id', 'uploaderId');
	}
}
