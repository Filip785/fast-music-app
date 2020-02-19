import { TOGGLE_ITEM, GET_ALL_AUDIO_ITEMS } from './audio.constants';
import { TOGGLE_FILE_CHANGE, FILE_EXTENSION_FORBIDDEN_END } from './audio.file.constants';
import { AudioActionTypes, AudioState, AudioFileActionTypes } from './audio.types';
import axios from 'axios';
import performFrontendLogout from '../../helpers/performFrontendLogout';
import { ThunkAction } from 'redux-thunk';
import { Dispatch } from 'redux';
import history from '../../helpers/history';
import { TOGGLE_LOADING_SPINNER } from '../load/load.constants';

type ThunkResult<R = Promise<void>> = ThunkAction<R, AudioState, unknown, AudioActionTypes>;

export function toggleItem(id: number): AudioActionTypes {
  return {
    type: TOGGLE_ITEM,
    id
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
      const response = await axios.get('http://localhost/api/audio', {
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