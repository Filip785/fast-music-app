import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { Dispatch } from 'redux';
import history from '../../helpers/history';
import { TOGGLE_LOADING_SPINNER } from '../load/load.constants';
import performFrontendLogout from '../../helpers/performFrontendLogout';
import { TOGGLE_ITEM, GET_ALL_AUDIO_ITEMS, LIKE_ITEM, LIKE_ITEM_ARTISTS, TOGGLE_ITEM_ARTIST_SONGS, GET_AUDIO_ITEMS_FOR_ARTISTS, GET_PROFILE_DATA, DELETE_AUDIO, DELETE_AUDIO_ARTISTS, GET_SPECIFIC_USERS, ADD_AUDIO_ITEM_CLEANUP, GET_AUDIO_ITEM, ADD_AUDIO_ITEM_FAILURE, ADD_AUDIO_ITEM } from './audio.constants';
import { TOGGLE_FILE_CHANGE, FILE_EXTENSION_FORBIDDEN_END } from './audio.file.constants';
import { AudioActionTypes, AudioState, AudioFileActionTypes, FileUploadPage } from './audio.types';
import { User } from '../auth/auth.types';

type ThunkResult<R = Promise<void>> = ThunkAction<R, AudioState, unknown, AudioActionTypes>;

export function toggleItem(id: number): AudioActionTypes {
  return {
    type: TOGGLE_ITEM,
    id: id
  };
}

export function toggleFileChange(name: string, size: number, fileType: string, file: HTMLInputElement): AudioFileActionTypes {
  let displaySize: number = size / 1024;
  let label: string = 'KB';

  if (displaySize > 1024) {
    displaySize = displaySize / 1024;
    label = 'MB';
  }

  return {
    type: TOGGLE_FILE_CHANGE,
    payload: { name, fileType, size: `${displaySize.toFixed(2)} ${label}`, file }
  };
}

export function closeFileNotAllowedPrompt(): AudioFileActionTypes {
  return {
    type: FILE_EXTENSION_FORBIDDEN_END
  };
}

export function getAllAudioItems(userId: number, userApiToken: string): ThunkResult {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}api/audio`, {
        headers: {
          Authorization: `Bearer ${userApiToken}`
        },
        params: {
          userId
        }
      });

      dispatch({ type: GET_ALL_AUDIO_ITEMS, payload: response.data });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    } catch (err) {
      performFrontendLogout(dispatch, history, true);
    }
  };
}

export function doLike(audioItemId: number, userId: number, userApiToken: string, isArtists: boolean, artistId: number | undefined): ThunkResult {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}api/audio/like`, {
        audioItemId,
        userId
      }, {
        headers: {
          Authorization: `Bearer ${userApiToken}`
        }
      });

      if (!isArtists) {
        dispatch({ type: LIKE_ITEM, likeCount: response.data.count, audioId: audioItemId });
      }  else {
        dispatch({ type: LIKE_ITEM_ARTISTS, likeCount: response.data.count, audioId: audioItemId, artistId });
      }

      dispatch({ type: TOGGLE_LOADING_SPINNER });
    } catch (err) {
      performFrontendLogout(dispatch, history, true);
    }
  };
}

export function toggleItemArtistSongs(value: number): AudioActionTypes {
  return {
    type: TOGGLE_ITEM_ARTIST_SONGS,
    value
  };
}

export function getAudioItemsForArtists(userId: number, userApiToken: string): ThunkResult {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}api/audio/artist-audio-items/${userId}`, {
        headers: {
          Authorization: `Bearer ${userApiToken}`
        }
      });
  
      dispatch({ type: GET_AUDIO_ITEMS_FOR_ARTISTS, payload: response.data.artistAudioItems });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    } catch (err) {
      performFrontendLogout(dispatch, history, true);
    }
  };
}

export function getProfileData(profileId: number, authUserId: number, authUserApiToken: string): ThunkResult  {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}api/user/profile/${profileId}`, {
        headers: {
          Authorization: `Bearer ${authUserApiToken}`
        },
        params: {
          authUserId
        }
      });

      dispatch({ type: GET_PROFILE_DATA, profileData: response.data.profileData, accessibleItems: response.data.accessibleItems });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    } catch (err) {
      performFrontendLogout(dispatch, history, true);
    }
  };
}

export function deleteAudio(audioId: number, userId: number, userApiToken: string, isArtists?: boolean, artistId?: number): ThunkResult {
  return async (dispatch: Dispatch) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}api/audio/delete/${audioId}`, {
        headers: {
          Authorization: `Bearer ${userApiToken}`
        },
        data: {
          userId
        }
      });

      if(!isArtists) {
        dispatch({ type: DELETE_AUDIO, audioId });
      } else {
        dispatch({ type: DELETE_AUDIO_ARTISTS, audioId, artistId });
      }

      dispatch({ type: TOGGLE_LOADING_SPINNER });

    } catch (err) {
      if (err.response.status === 401) {
        performFrontendLogout(dispatch, history, true);

        return;
      }

      if(err.response.status === 403) {
        history.push('/dashboard', { withSpinner: true });
      }
    }
  };
}

export function getSpecificUsers(exceptUserId: number, userApiToken: string): ThunkResult {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}api/user/specific/${exceptUserId}`, {
        headers: {
          Authorization: `Bearer ${userApiToken}`
        }
      });
      
      dispatch({ type: GET_SPECIFIC_USERS, payload: response.data.specificUsers });
    } catch (err) {
      performFrontendLogout(dispatch, history, false);
    }
  };
}

export function cleanupAddFilePage(): AudioActionTypes {
  return {
    type: ADD_AUDIO_ITEM_CLEANUP
  };
}

export function getAudioItem(authUserId: number, audioItemId: number, userApiToken: string): ThunkResult {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}api/audio/details/${audioItemId}`, {
        headers: {
          Authorization: `Bearer ${userApiToken}`
        },
        params: {
          authUserId
        }
      });

      dispatch({ type: GET_AUDIO_ITEM, payload: response.data.audioItem });
    } catch (err) {
      if(err.response.status === 401) {
        performFrontendLogout(dispatch, history, true);
      }

      if(err.response.status === 403) {
        history.push('/dashboard', { withSpinner: true });
        return Promise.reject(err);
      }
    }
  };
}

export function addOrEditAudioItem(requestData: { action: string, method: string }, songTitle: string, artistId: number, fileUploadData: FileUploadPage, uploaderId: number, visibility: number, allowedUsers: User[], userApiToken: string): ThunkResult {
  return async (dispatch: Dispatch) => {
    try {
      let methodType = axios.post;

      if(requestData.method === 'put') {
        methodType = axios.put;
      }

      const { fileName, fileUpload } = fileUploadData;

      const allowedIds = allowedUsers.map(user => user.id);

      const response = await methodType(`${process.env.REACT_APP_API_URL}api/audio${requestData.action}`, {
        songTitle,
        artistId,
        fileName,
        fileUpload,
        uploaderId,
        visibility,
        allowedUsers: allowedIds
      }, {
        headers: {
          Authorization: `Bearer ${userApiToken}`
        }
      });
      dispatch({ type: ADD_AUDIO_ITEM, payload: response.data.audioItem });
      history.push('/dashboard', { spinnerRunning: true });
    } catch (err) {
      if (err.response.status === 401) {
        performFrontendLogout(dispatch, history, true);

        return;
      }

      dispatch({ type: ADD_AUDIO_ITEM_FAILURE, payload: err.response.data.errors });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    }
  };
}