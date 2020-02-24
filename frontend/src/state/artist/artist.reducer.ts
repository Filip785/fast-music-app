import { ArtistState, ArtistActionTypes } from "./artist.types";
import { GET_ALL_ARTISTS, TOGGLE_ADD_ARTIST_DIALOG, CREATE_ARTIST, ADD_ARTIST_FAILURE } from "./artist.constants";

const initialState: ArtistState = {
  artists: [],
  addArtistDialogOpen: false,
  withNotice: false,
  addArtistFailure: {}
};

export default function artistReducerTs(state = initialState, action: ArtistActionTypes): ArtistState {
  switch (action.type) {
    case GET_ALL_ARTISTS:
      return {
        ...state,
        artists: action.payload
      };
    case TOGGLE_ADD_ARTIST_DIALOG:
      return {
        ...state,
        addArtistDialogOpen: !state.addArtistDialogOpen,
        withNotice: action.withNotice,
        addArtistFailure: {}
      };
    case ADD_ARTIST_FAILURE:
      return {
        ...state,
        addArtistFailure: { message: action.payload }
      };
    case CREATE_ARTIST:
      return {
        ...state,
        artists: state.artists.concat(action.payload),
        addArtistFailure: {}
      };
    default:
      return state;
  }
}