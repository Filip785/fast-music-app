<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAudioItemsTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('audio_items', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->string('songTitle');
			$table->unsignedBigInteger('artistId');
			$table->unsignedBigInteger('uploaderId');
			$table->integer('visibility');
			$table->string('audioUrl');
			$table->timestamps();

			$table->foreign('artistId')->references('id')->on('artists')->onDelete('cascade');
			$table->foreign('uploaderId')->references('id')->on('users')->onDelete('cascade');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('audio_items');
	}
}
