import { TOGGLE_ITEM, GET_ALL_AUDIO_ITEMS } from './audio.constants';
import { AudioState, AudioActionTypes, AudioFileActionTypes } from './audio.types';
import { TOGGLE_FILE_CHANGE, FILE_EXTENSION_FORBIDDEN, FILE_EXTENSION_FORBIDDEN_END } from './audio.file.constants';

const initialState: AudioState = {
  audioItems: [],
  fileUpload: {
    musicFile: {},
    musicFileErrors: {}
  }
};

export default function audioReducerTs(state = initialState, action: AudioActionTypes | AudioFileActionTypes) {
  switch (action.type) {
    case TOGGLE_ITEM:
      return {
        ...state,
        audioItems: state.audioItems.map(item => item.id === action.id ? { ...item, toggle: !item.toggle } : item)
      };
    case GET_ALL_AUDIO_ITEMS:
      return {
        ...state,
        audioItems: action.payload
      };
    case TOGGLE_FILE_CHANGE:
      return {
        ...state,
        fileUpload: {
          musicFile: action.payload,
          musicFileErrors: { ...state.fileUpload.musicFileErrors, fileUpload: false }
        }
      };
    case FILE_EXTENSION_FORBIDDEN:
      return {
        ...state,
        fileUpload: {
          musicFile: { ...state.fileUpload.musicFile },
          musicFileErrors: { ...state.fileUpload.musicFileErrors, fileExtensionNotAllowed: true }
        }
      };
    case FILE_EXTENSION_FORBIDDEN_END:
      return {
        ...state,
        fileUpload: {
          musicFile: { ...state.fileUpload.musicFile },
          musicFileErrors: { ...state.fileUpload.musicFileErrors, fileExtensionNotAllowed: false }
        }
      };
    default:
      return state;
  }
}