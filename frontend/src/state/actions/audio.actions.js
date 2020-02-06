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
  TOGGLE_LOADING_SPINNER
} from '../constants';



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
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    }).catch(_ => {
      performFrontendLogout(dispatch, history, true);
    });
  };
}

export function addAudioItem(songTitle, artistId, { fileName, fileUpload }, uploaderId, userApiToken) {
  return dispatch => {
    return axios.post('http://localhost/api/audio/create', {
      songTitle,
      artistId,
      fileName,
      fileUpload,
      uploaderId
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