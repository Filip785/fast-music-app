import {
  ADD_AUDIO_ITEM,
  GET_AUDIO_ITEM
} from '../constants';

const initialState = {
  musicItems: [],
  musicItem: {},
};

export default function audio(state = initialState, action) {
  if (action.type === ADD_AUDIO_ITEM) {
    return { ...state, musicItems: state.musicItems.concat(action.payload) };
  }

  if (action.type === GET_AUDIO_ITEM) {
    return { ...state, musicItem: action.payload, musicFile: { name: action.payload.audioUrl } };
  }

  return state;
}