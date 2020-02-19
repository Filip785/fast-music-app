import {
  TOGGLE_ITEM,
  ADD_AUDIO_ITEM,
  ADD_AUDIO_ITEM_FAILURE,
  ADD_AUDIO_ITEM_CLEANUP,
  GET_SPECIFIC_USERS,
  GET_AUDIO_ITEM,
  LIKE_ITEM,
  GET_AUDIO_ITEMS_FOR_ARTISTS,
  TOGGLE_ITEM_ARTIST_SONGS,
  LIKE_ITEM_ARTISTS,
  DELETE_AUDIO,
  DELETE_AUDIO_ARTISTS,
  GET_PROFILE_DATA
} from '../constants';

const initialState = {
  musicItems: [],
  specificUsers: [],
  musicItem: {},
  artistAudioItems: [],
  profile: {}
};

export default function audio(state = initialState, action) {
  if (action.type === TOGGLE_ITEM) {
    return { ...state, musicItems: state.musicItems.map(item => item.id === action.payload ? { ...item, toggle: !item.toggle } : item) };
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

  if (action.type === GET_SPECIFIC_USERS) {
    return { ...state, specificUsers: action.payload };
  }

  if (action.type === LIKE_ITEM) {
    return {
      ...state,
      musicItems: state.musicItems.map(item => item.id === action.audioId ? { ...item, likes: action.payload, isLikedByUser: !item.isLikedByUser } : item)
    };
  }

  if (action.type === LIKE_ITEM_ARTISTS) {
    const { artistId, audioId } = action;

    const artistAudioItems = state.artistAudioItems.map(item => {
      if (item.id !== artistId) {
        return item;
      }

      const audioItems = item.audioItems.map(audioItem => {
        if (audioItem.id !== audioId) {
          return audioItem;
        }

        return {
          ...audioItem,
          likes: action.likes,
          isLikedByUser: !audioItem.isLikedByUser
        };
      });

      return {
        ...item,
        audioItems
      };
    });

    return {
      ...state,
      artistAudioItems
    };
  }

  if (action.type === GET_AUDIO_ITEMS_FOR_ARTISTS) {
    return { ...state, artistAudioItems: action.payload };
  }

  if (action.type === TOGGLE_ITEM_ARTIST_SONGS) {
    return { ...state, artistAudioItems: state.artistAudioItems.map(item => item.id === action.payload ? { ...item, toggle: !item.toggle } : item) };
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

  if (action.type === GET_PROFILE_DATA) {
    return { ...state, profile: action.payload.profileData, musicItems: action.payload.accessibleItems };
  }

  return state;
}