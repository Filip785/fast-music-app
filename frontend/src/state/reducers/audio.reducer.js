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
  GET_AUDIO_ITEM,
  LIKE_ITEM,
  GET_AUDIO_ITEMS_FOR_ARTISTS,
  TOGGLE_ITEM_ARTIST_SONGS,
  LIKE_ITEM_ARTISTS,
  DELETE_AUDIO,
  DELETE_AUDIO_ARTISTS
} from '../constants';

const initialState = {
  musicItems: [],
  musicFile: {},
  musicItemError: {},
  fileExtensionNotAllowed: false,
  specificUsers: [],
  musicItem: {},
  artistAudioItems: []
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
    return { ...state, fileExtensionNotAllowed: false };
  }

  if (action.type === GET_SPECIFIC_USERS) {
    return { ...state, specificUsers: action.payload };
  }

  if (action.type === DASHBOARD_CLEANUP) {
    return { ...state, musicItems: [] };
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

  return state;
}