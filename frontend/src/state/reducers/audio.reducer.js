import {
  ADD_AUDIO_ITEM,
  ADD_AUDIO_ITEM_FAILURE,
  ADD_AUDIO_ITEM_CLEANUP,
  GET_SPECIFIC_USERS,
  GET_AUDIO_ITEM,
  DELETE_AUDIO,
  DELETE_AUDIO_ARTISTS
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

  if (action.type === DELETE_AUDIO) {
    const indexToRemove = state.musicItems.findIndex(item => item.id === action.payload);

    return {
      ...state,
      musicItems: [...state.musicItems.slice(0, indexToRemove), ...state.musicItems.slice(indexToRemove + 1)]
    };
  }

  if (action.type === DELETE_AUDIO_ARTISTS) {
    const { artistId, audioId } = action;

    let artistAudioItems = state.artistAudioItems.map(item => {
      if (item.id !== artistId) {
        return item;
      }

      const indexToRemove = item.audioItems.findIndex(item => item.id === audioId);

      const audioItems = [...item.audioItems.slice(0, indexToRemove), ...item.audioItems.slice(indexToRemove + 1)];

      return {
        ...item,
        audioItems
      };
    });
    
    // where length === 0
    artistAudioItems = artistAudioItems.filter((item, index) => item.audioItems.length !== 0);


    return { ...state, artistAudioItems };
  }

  return state;
}