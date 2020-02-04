import axios from 'axios';
import history from '../../helpers/history';
import { TOGGLE_ITEM, TOGGLE_FILE_CHANGE, FILE_EXTENSION_FORBIDDEN_END, ADD_AUDIO_ITEM, DO_LOGOUT, GET_ALL_AUDIO_ITEMS } from '../constants';

export function toggleItem(id) {
  return {
    type: TOGGLE_ITEM,
    payload: id
  };
}

export function getAllAudioItems(userApiToken) {
  return dispatch => {
    return axios.get('http://localhost/api/audio', {
      headers: {
        Authorization: `Bearer ${userApiToken}`
      }
    }).then(response => {
      dispatch({ type: GET_ALL_AUDIO_ITEMS, payload: response.data.audioItems });
    }).catch(_ => {
      // user is not logged in
      localStorage.removeItem('authUser');
      dispatch({ type: DO_LOGOUT });
      history.push('/login');
    });
  };
}

export function addAudioItem(songTitle, artistId, userApiToken) {
  return dispatch => {
    return axios.post('http://localhost/api/audio/create', {
      songTitle,
      artistId
    }, {
      headers: {
        Authorization: `Bearer ${userApiToken}`
      }
    }).then(response => {
      dispatch({ type: ADD_AUDIO_ITEM, payload: response.data.audioItem });
      history.push('/dashboard');
    }).catch(error => {
      // HANDLE THESE

      // EMPTY SONG TITLE

      // user is not logged in
      // localStorage.removeItem('authUser');
      // dispatch({ type: DO_LOGOUT });
      // history.push('/login');
    });
  };
}

export function toggleFileChange(fileName, size, fileType, file) {
  let displaySize = size / 1024;
  let label = 'KB';

  if(displaySize > 1024) {
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