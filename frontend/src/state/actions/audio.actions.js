import axios from 'axios';
import history from '../../helpers/history';
import performFrontendLogout from '../../helpers/performFrontendLogout';
import {
  TOGGLE_ITEM,
  TOGGLE_FILE_CHANGE,
  FILE_EXTENSION_FORBIDDEN_END,
  ADD_AUDIO_ITEM,
  GET_ALL_AUDIO_ITEMS,
  ADD_AUDIO_ITEM_FAILURE,
  ADD_AUDIO_ITEM_CLEANUP,
  TOGGLE_LOADING_SPINNER,
  GET_SPECIFIC_USERS,
  GET_AUDIO_ITEM,
  LIKE_ITEM,
  GET_AUDIO_ITEMS_FOR_ARTISTS,
  TOGGLE_ITEM_ARTIST_SONGS,
  LIKE_ITEM_ARTISTS,
  DELETE_AUDIO,
  DELETE_AUDIO_ARTISTS,
  GET_PROFILE_DATA
} from '../constants';

export function toggleItem(id) {
  return {
    type: TOGGLE_ITEM,
    payload: id
  };
}

export function getAllAudioItems(userId, userApiToken) {
  return dispatch => {
    return axios.get('http://localhost/api/audio', {
      headers: {
        Authorization: `Bearer ${userApiToken}`
      },
      params: {
        userId
      }
    }).then(response => {
      dispatch({ type: GET_ALL_AUDIO_ITEMS, payload: response.data.audioItems });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    }).catch(_ => {
      performFrontendLogout(dispatch, history, true);
    });
  };
}

export function addOrEditAudioItem(requestData, songTitle, artistId, { fileName, fileUpload }, uploaderId, visibility, allowedUsers, userApiToken) {
  return dispatch => {
    return axios[requestData.method](`http://localhost/api/audio${requestData.action}`, {
      songTitle,
      artistId,
      fileName,
      fileUpload,
      uploaderId,
      visibility,
      allowedUsers
    }, {
      headers: {
        Authorization: `Bearer ${userApiToken}`
      }
    }).then(response => {
      dispatch({ type: ADD_AUDIO_ITEM, payload: response.data.audioItem });
      history.push('/dashboard', { spinnerRunning: true });
    }).catch(error => {
      if (error.response.status === 401) {
        performFrontendLogout(dispatch, history, true);

        return;
      }

      dispatch({ type: ADD_AUDIO_ITEM_FAILURE, payload: error.response.data.errors });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    });
  };
}

export function toggleFileChange(fileName, size, fileType, file) {
  let displaySize = size / 1024;
  let label = 'KB';

  if (displaySize > 1024) {
    displaySize = displaySize / 1024;
    label = 'MB';
  }

  return {
    type: TOGGLE_FILE_CHANGE,
    payload: fileName,
    size: `${displaySize.toFixed(2)} ${label}`,
    fileType,
    file
  };
}

export function closeFileNotAllowedPrompt() {
  return {
    type: FILE_EXTENSION_FORBIDDEN_END
  };
}

export function cleanupAddFilePage() {
  return {
    type: ADD_AUDIO_ITEM_CLEANUP
  };
}

export function getSpecificUsers(exceptUserId, userApiToken) {
  return dispatch => {
    return axios.get(`http://localhost/api/user/specific/${exceptUserId}`, {
      headers: {
        Authorization: `Bearer ${userApiToken}`
      }
    }).then(response => {
      dispatch({ type: GET_SPECIFIC_USERS, payload: response.data.specificUsers });
    }).catch(_ => {
      performFrontendLogout(dispatch, history);
    });
  };
}

export function getAudioItem(authUserId, audioItemId, userApiToken) {
  return dispatch => {
    return axios.get(`http://localhost/api/audio/details/${audioItemId}`, {
      headers: {
        Authorization: `Bearer ${userApiToken}`
      },
      params: {
        authUserId
      }
    }).then(response => {
      dispatch({ type: GET_AUDIO_ITEM, payload: response.data.audioItem });
    }).catch(error => {
      if(error.response.status === 401) {
        performFrontendLogout(dispatch, history, true);
      }

      if(error.response.status === 403) {
        history.push('/dashboard', { withSpinner: true });
        return Promise.reject(error);
      }
    });
  };
}

export function doLike(audioItemId, userId, userApiToken, isArtists, artistId) {
  return dispatch => {
    return axios.post(`http://localhost/api/audio/like`, {
      audioItemId,
      userId
    }, {
      headers: {
        Authorization: `Bearer ${userApiToken}`
      }
    }).then(response => {
      if(isArtists) {
        dispatch({ type: LIKE_ITEM_ARTISTS, likes: response.data.count, audioId: audioItemId, artistId: artistId });
      } else {
        dispatch({ type: LIKE_ITEM, payload: response.data.count, audioId: audioItemId });
      }
      
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    }).catch(error => {
      if (error.response.status === 401) {
        performFrontendLogout(dispatch, history, true);

        return;
      }
    });
  };
}

export function getAudioItemsForArtists(userId, userApiToken) {
  return dispatch => {
    return axios.get(`http://localhost/api/audio/artist-audio-items/${userId}`, {
      headers: {
        Authorization: `Bearer ${userApiToken}`
      }
    }).then(response => {
      dispatch({ type: GET_AUDIO_ITEMS_FOR_ARTISTS, payload: response.data.artistAudioItems });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    }).catch(error => {
      //here
      if (error.response.status === 401) {
        performFrontendLogout(dispatch, history, true);
      }
    });
  };
}

export function deleteAudio(audioId, userId, userApiToken, isArtists, artistId) {
  return dispatch => {
    return axios.delete(`http://localhost/api/audio/delete/${audioId}`, {
      headers: {
        Authorization: `Bearer ${userApiToken}`
      },
      data: { userId }
    }).then(_ => {
      if(isArtists) {
        dispatch({ type: DELETE_AUDIO_ARTISTS, audioId, artistId });
      } else {
        dispatch({ type: DELETE_AUDIO, payload: audioId });
      }
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    }).catch(error => {
      //here
      if (error.response.status === 401) {
        performFrontendLogout(dispatch, history, true);

        return;
      }

      if(error.response.status === 403) {
        history.push('/dashboard', { withSpinner: true });
      }
    });
  };
}

export function toggleItemArtistSongs (value) {
  return {
    type: TOGGLE_ITEM_ARTIST_SONGS,
    payload: value
  };
}

export function getProfileData(profileId, authUserId, authUserApiToken) {
  return dispatch => {
    return axios.get(`http://localhost/api/user/profile/${profileId}`, {
      headers: {
        Authorization: `Bearer ${authUserApiToken}`
      },
      params: {
        authUserId
      }
    }).then(response => {
      dispatch({ type: GET_PROFILE_DATA, payload: response.data });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    }).catch(error => {
      //here
      if (error.response.status === 401) {
        performFrontendLogout(dispatch, history, true);
      }
    });
  };
}