<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AudioItem extends Model
{
	protected $fillable = [
		'songTitle', 'artistId'
	];

	public function artist() {
		return $this->hasOne('App\Artist', 'id', 'artistId');
	}
}
