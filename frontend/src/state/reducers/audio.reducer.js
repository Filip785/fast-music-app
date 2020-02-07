import { 
  TOGGLE_ITEM, 
  TOGGLE_FILE_CHANGE, 
  FILE_EXTENSION_FORBIDDEN, 
  FILE_EXTENSION_FORBIDDEN_END, 
  ADD_AUDIO_ITEM, 
  GET_ALL_AUDIO_ITEMS, 
  ADD_AUDIO_ITEM_FAILURE, 
  ADD_AUDIO_ITEM_CLEANUP,
  DASHBOARD_CLEANUP,
  GET_SPECIFIC_USERS,
  GET_AUDIO_ITEM
} from '../constants';

const initialState = {
  musicItems: [],
  musicFile: {},
  musicItemError: {},
  fileExtensionNotAllowed: false,
  specificUsers: [],
  musicItem: {}
};

export default function audio(state = initialState, action) {
  if (action.type === TOGGLE_ITEM) {
    return { ...state, musicItems: state.musicItems.map(item => item.id === action.payload ? { ...item, toggle: !item.toggle } : item) };
  }

  if (action.type === GET_ALL_AUDIO_ITEMS) {
    return { ...state, musicItems: action.payload };
  }

  if (action.type === ADD_AUDIO_ITEM) {
    return { ...state, musicItems: state.musicItems.concat(action.payload) };
  }

  if (action.type === GET_AUDIO_ITEM) {
    return { ...state, musicItem: action.payload, musicFile: { name: action.payload.audioUrl } };
  }

  if (action.type === ADD_AUDIO_ITEM_FAILURE) {
    return { ...state, musicItemError: action.payload };
  }

  if (action.type === ADD_AUDIO_ITEM_CLEANUP) {
    return { ...state, musicFile: {}, musicItemError: {} };
  }

  if (action.type === TOGGLE_FILE_CHANGE) {
    return { ...state, musicFile: { name: action.payload, size: action.size, fileUpload: action.file }, musicItemError: { ...state.musicItemError, fileUpload: false } };
  }

  if (action.type === FILE_EXTENSION_FORBIDDEN) {
    return { ...state, fileExtensionNotAllowed: true };
  }

  if (action.type === FILE_EXTENSION_FORBIDDEN_END) {
    return { ...state, fileExtensionNotAllowed: false }
  }

  if (action.type === GET_SPECIFIC_USERS) {
    return { ...state, specificUsers: action.payload };
  }

  if (action.type === DASHBOARD_CLEANUP) {
    return { ...state, musicItems: [] };
  }

  return state;
}