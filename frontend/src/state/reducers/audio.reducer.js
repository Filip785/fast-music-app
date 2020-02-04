import { TOGGLE_ITEM, TOGGLE_FILE_CHANGE, FILE_EXTENSION_FORBIDDEN, FILE_EXTENSION_FORBIDDEN_END } from "../constants";

const initialState = {
  musicItems: [
    {id: 0, toggle: false, title: 'JA REPUJEM', artist: 'Smoke Mardeljano', url: 'http://localhost/audio/smoke.mp3'},
    {id: 1, toggle: false, title: 'BEZ MIKSA', artist: 'Psihoaktiv Trip', url: 'http://localhost/audio/trip.mp3'}
  ],
  musicFile: {},
  fileExtensionNotAllowed: false
};

export default function audio(state = initialState, action) {
  if(action.type === TOGGLE_ITEM) {
    return { ...state, musicItems: state.musicItems.map(item => item.id === action.payload ? { ...item, toggle: !item.toggle } : item) };
  }

  if(action.type === TOGGLE_FILE_CHANGE) {
    return { ...state, musicFile: {name: action.payload, size: action.size} };
  }

  if(action.type === FILE_EXTENSION_FORBIDDEN) {
    return { ...state, fileExtensionNotAllowed: true };
  }

  if(action.type === FILE_EXTENSION_FORBIDDEN_END) {
    return { ...state, fileExtensionNotAllowed: false }
  }

  return state;
}