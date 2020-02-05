import { TOGGLE_ITEM, TOGGLE_FILE_CHANGE, FILE_EXTENSION_FORBIDDEN, FILE_EXTENSION_FORBIDDEN_END, ADD_AUDIO_ITEM, GET_ALL_AUDIO_ITEMS, CLOSE_FILE_DATA_DISPLAY } from "../constants";

const initialState = {
  musicItems: [],
  musicFile: {},
  fileExtensionNotAllowed: false,
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

  if (action.type === TOGGLE_FILE_CHANGE) {
    return { ...state, musicFile: { name: action.payload, size: action.size, fileUpload: action.file } };
  }

  if (action.type === FILE_EXTENSION_FORBIDDEN) {
    return { ...state, fileExtensionNotAllowed: true };
  }

  if (action.type === FILE_EXTENSION_FORBIDDEN_END) {
    return { ...state, fileExtensionNotAllowed: false }
  }

  if(action.type === CLOSE_FILE_DATA_DISPLAY) {
    return { ...state, musicFile: {} };
  }

  return state;
}