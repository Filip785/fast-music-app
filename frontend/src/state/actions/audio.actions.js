import axios from 'axios';
import history from '../../helpers/history';
import performFrontendLogout from '../../helpers/performFrontendLogout';
import {
  ADD_AUDIO_ITEM,
  GET_AUDIO_ITEM
} from '../constants';
import { TOGGLE_LOADING_SPINNER } from '../load/load.constants';
import { ADD_AUDIO_ITEM_FAILURE } from '../audio/audio.constants';

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