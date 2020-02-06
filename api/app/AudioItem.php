<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AudioItem extends Model
{
	protected $fillable = [
		'songTitle', 'artistId', 'audioUrl', 'uploaderId', 'visibility'
	];

	public function artist() {
		return $this->hasOne('App\Artist', 'id', 'artistId');
	}

	public function uploader() {
		return $this->hasOne('App\User', 'id', 'uploaderId');
	}

	public function allowedUsers() {
		return $this->belongsToMany('App\User')->withTimestamps();
	}
}
