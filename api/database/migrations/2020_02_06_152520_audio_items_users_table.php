<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AudioItemsUsersTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('audio_item_user', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->unsignedBigInteger('audio_item_id')->unsigned()->nullable();
			$table->foreign('audio_item_id')->references('id')
				->on('audio_items')->onDelete('cascade');

			$table->unsignedBigInteger('user_id')->unsigned()->nullable();
			$table->foreign('user_id')->references('id')
				->on('users')->onDelete('cascade');

			$table->integer('like')->default(0);

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		//
	}
}
