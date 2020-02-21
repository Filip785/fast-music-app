import {
  ADD_AUDIO_ITEM,
  ADD_AUDIO_ITEM_FAILURE,
  ADD_AUDIO_ITEM_CLEANUP,
  GET_SPECIFIC_USERS,
  GET_AUDIO_ITEM
} from '../constants';

const initialState = {
  musicItems: [],
  specificUsers: [],
  musicItem: {},
  artistAudioItems: [],
  profile: {}
};

export default function audio(state = initialState, action) {
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

  if (action.type === GET_SPECIFIC_USERS) {
    return { ...state, specificUsers: action.payload };
  }

  return state;
}