import {
  GET_ALL_ARTISTS,
  TOGGLE_ADD_ARTIST_DIALOG,
  CREATE_ARTIST,
  ADD_ARTIST_FAILURE
} from '../constants';

const initialState = {
  artists: [],
  addArtistDialogOpen: false,
  withNotice: false,
  addArtistFailure: {},
  selectedArtist: {},
};

export default function artist(state = initialState, action) {
  if (action.type === GET_ALL_ARTISTS) {
    return { ...state, artists: action.payload };
  }

  if (action.type === CREATE_ARTIST) {
    return { ...state, artists: state.artists.concat({ id: action.payload.id, artistName: action.payload.artistName }), addArtistFailure: {} }
  }

  if (action.type === ADD_ARTIST_FAILURE) {
    return { ...state, addArtistFailure: { message: action.payload } };
  }

  if (action.type === TOGGLE_ADD_ARTIST_DIALOG) {
    return { ...state, addArtistDialogOpen: !state.addArtistDialogOpen, withNotice: action.withNotice, addArtistFailure: {} };
  }

  return state;
}