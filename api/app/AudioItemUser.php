<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AudioItemUser extends Model
{
	protected $table = 'audio_item_user';

	protected $fillable = [
		'like'
	];
}
