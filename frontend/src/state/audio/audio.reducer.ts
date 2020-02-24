import { 
  TOGGLE_ITEM, 
  GET_ALL_AUDIO_ITEMS, 
  LIKE_ITEM, 
  GET_AUDIO_ITEMS_FOR_ARTISTS, 
  TOGGLE_ITEM_ARTIST_SONGS, 
  LIKE_ITEM_ARTISTS, 
  GET_PROFILE_DATA, 
  DELETE_AUDIO, 
  DELETE_AUDIO_ARTISTS, 
  GET_SPECIFIC_USERS,
  ADD_AUDIO_ITEM_FAILURE,
  ADD_AUDIO_ITEM_CLEANUP,
  GET_AUDIO_ITEM,
  ADD_AUDIO_ITEM
} from './audio.constants';
import { AudioState, AudioActionTypes, AudioFileActionTypes, ArtistAudioItem } from './audio.types';
import { TOGGLE_FILE_CHANGE, FILE_EXTENSION_FORBIDDEN, FILE_EXTENSION_FORBIDDEN_END } from './audio.file.constants';

const initialState: AudioState = {
  audioItems: [],
  audioItemsArtists: [],
  fileUpload: {
    musicFile: {},
    musicFileErrors: {}
  },
  profile: {},
  specificUsers: [],
  musicItem: { songTitle: '', artistId: 0, uploaderId: 0, visibility: 0, audioUrl: '', artist: { id: 0, artistName: '' }, allowed_users: [] }
};

export default function audioReducerTs(state = initialState, action: AudioActionTypes | AudioFileActionTypes) : AudioState {
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
    case LIKE_ITEM:
      return {
        ...state,
        audioItems: state.audioItems.map(item => item.id === action.audioId ? { ...item, likes: action.likeCount, isLikedByUser: !item.isLikedByUser } : item)
      };
    case LIKE_ITEM_ARTISTS:
    {
      let { artistId, audioId } = action;

      const audioItemsArtists: ArtistAudioItem[] = state.audioItemsArtists.map(item => {
        if (item.id !== artistId) {
          return item;
        }

        const audioItems = item.audioItems.map(audioItem => {
          if (audioItem.id !== audioId) {
            return audioItem;
          }

          return {
            ...audioItem,
            likes: action.likeCount,
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
        audioItemsArtists
      };
    }
    case TOGGLE_ITEM_ARTIST_SONGS:
      return {
        ...state,
        audioItemsArtists: state.audioItemsArtists.map(item => item.id === action.value ? { ...item, toggle: !item.toggle } : item)
      };
    case GET_AUDIO_ITEMS_FOR_ARTISTS:
      return {
        ...state,
        audioItemsArtists: action.payload
      };
    case GET_PROFILE_DATA:
      return {
        ...state,
        profile: action.profileData,
        audioItems: action.accessibleItems
      };
    case DELETE_AUDIO:
      const indexToRemove: number = state.audioItems.findIndex(item => item.id === action.audioId);

      return {
        ...state,
        audioItems: [...state.audioItems.slice(0, indexToRemove), ...state.audioItems.slice(indexToRemove + 1)]
      };
    case DELETE_AUDIO_ARTISTS:
    {
      const { artistId, audioId } = action;

      let audioItemsArtists = state.audioItemsArtists.map(item => {
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
      audioItemsArtists = audioItemsArtists.filter((item, index) => item.audioItems.length !== 0);

      return { ...state, audioItemsArtists };
    }
    case GET_SPECIFIC_USERS:
      return {
        ...state,
        specificUsers: action.payload
      };
    case ADD_AUDIO_ITEM_FAILURE:
      return {
        ...state,
        fileUpload: {
          ...state.fileUpload,
          musicFileErrors: action.payload
        }
      };
    case ADD_AUDIO_ITEM_CLEANUP:
      return {
        ...state,
        fileUpload: {
          musicFile: {},
          musicFileErrors: {}
        }
      };
    case GET_AUDIO_ITEM:
      return {
        ...state,
        musicItem: action.payload
      };
    case ADD_AUDIO_ITEM:
      return {
        ...state,
        audioItems: state.audioItems.concat(action.audioItem)
      };
    default:
      return state;
  }
}