import { ThunkAction } from "redux-thunk";
import { ArtistState, ArtistActionTypes, ArtistBlurType } from "./artist.types";
import { TOGGLE_ADD_ARTIST_DIALOG, GET_ALL_ARTISTS, CREATE_ARTIST, ADD_ARTIST_FAILURE } from "./artist.constants";
import { Dispatch } from "redux";
import performFrontendLogout from "../../helpers/performFrontendLogout";
import history from "../../helpers/history";
import axios from 'axios';
import { TOGGLE_LOADING_SPINNER } from "../load/load.constants";

type ThunkResult<R = Promise<void>> = ThunkAction<R, ArtistState, unknown, ArtistActionTypes>;

export function getArtists(userApiToken: string): ThunkResult {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get('http://localhost/api/artist', {
        headers: {
          Authorization: `Bearer ${userApiToken}`
        }
      });
      
      dispatch({ type: GET_ALL_ARTISTS, payload: response.data.artists });
    } catch (err) {
      performFrontendLogout(dispatch, history, false);
    }
  };
}

export function createArtist(artistName: string, userApiToken: string, onBlurAddItemForm: (target: ArtistBlurType) => void): ThunkResult {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.post('http://localhost/api/artist/create', {
        artistName
      }, {
        headers: {
          Authorization: `Bearer ${userApiToken}`
        }
      });

      dispatch({ type: CREATE_ARTIST, payload: response.data.artist });
      dispatch({ type: TOGGLE_ADD_ARTIST_DIALOG });
      onBlurAddItemForm({ target: { value: artistName } });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    } catch (err) {
      if(err.response.status === 401) {
        performFrontendLogout(dispatch, history, true);

        return;
      }

      dispatch({ type: ADD_ARTIST_FAILURE, payload: err.response.data.errors.artistName });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    }
  };
}

export function toggleAddArtistDialog(withNotice: boolean): ArtistActionTypes {
  return {
    type: TOGGLE_ADD_ARTIST_DIALOG,
    withNotice
  };
}