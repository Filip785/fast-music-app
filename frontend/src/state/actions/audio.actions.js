import axios from 'axios';
import history from '../../helpers/history';
import performFrontendLogout from '../../helpers/performFrontendLogout';
import {
  ADD_AUDIO_ITEM,
  ADD_AUDIO_ITEM_FAILURE,
  ADD_AUDIO_ITEM_CLEANUP,
  GET_SPECIFIC_USERS,
  GET_AUDIO_ITEM
} from '../constants';
import { TOGGLE_LOADING_SPINNER } from '../load/load.constants';

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