<?php

namespace App\Http\Controllers;

use App\AudioItem;
use App\AudioItemUser;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserApiController extends Controller
{
  public function create(Request $request)
  {
    $request->validate([
      'name' => 'required',
      'username' => 'required|unique:users',
      'email' => 'required|unique:users|email',
      'password' => 'required|min:6'
    ]);

    // add validation
    $data = $request->all();

    $user = new User([
      'name' => $data['name'],
      'username' => $data['username'],
      'email' => $data['email'],
      'password' => Hash::make($data['password']),
    ]);
    $user->api_token = Str::random(60);
    $user->save();

    $publicAudioItems = AudioItem::where('visibility', '=', 0)->get();

    foreach ($publicAudioItems as $publicAudioItem) {
      $publicAudioItem->allowedUsers()->attach($user);
    }

    return response()->json([
      'user' => $user
    ], 200);
  }

  public function login(Request $request)
  {
    $request->validate([
      'email' => 'required|email',
      'password' => 'required'
    ]);

    $data = $request->all();

    if (!Auth::attempt(['email' => $data['email'], 'password' => $data['password']])) {
      return response()->json(['error' => true], 401);
    }
    return response()->json(Auth::user(), 200);
  }

  public function details()
  {
    return response()->json([
      'user' => Auth::user()
    ], 200);
  }

  public function specific($exceptUserId)
  {
    $specificUsers = User::all()->except($exceptUserId);

    $specificUsersReturn = [];

    foreach ($specificUsers as $k => $specificUser) {
      $specificUsersReturn[$k] = [
        'id' => $specificUser->id,
        'username' => $specificUser->username
      ];
    }

    return response()->json([
      'specificUsers' => $specificUsersReturn
    ], 200);
  }

  public function getAllAccessibleAudioItemsToUserFromUser(Request $request, $userId) {
    $data = $request->all();

    $authUserId = $data['authUserId'];
    $authUser = User::find($authUserId);
    $profileUser = User::find($userId);
    $profileUser->numberOfUploads = AudioItem::where(['uploaderId' => $userId])->count();
    $profileUser->accountCreationDate = $profileUser->created_at->isoFormat('Do MMMM YYYY');

    $accessibleItems = $authUser->accessibleItems()->where('uploaderId', '=', $userId)->get();

    foreach($accessibleItems as $k => $audioItem) {
      $accessibleItems[$k]->artistName = $audioItem->artist->artistName;
      $accessibleItems[$k]->likes = AudioItemUser::where(['audio_item_id' => $audioItem->id, 'like' => 1])->count();
      $accessibleItems[$k]->isLikedByUser = count(AudioItemUser::where(['audio_item_id' => $audioItem->id, 'user_id' => $authUserId, 'like' => 1])->get()) !== 0;
      $accessibleItems[$k]->toggle = false;
    }

    return response()->json([
      'profileData' => $profileUser,
      'accessibleItems' => $accessibleItems
    ], 200);
  }
}
