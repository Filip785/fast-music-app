import axios from 'axios';
import history from '../../helpers/history';
import { 
  GET_ALL_ARTISTS,
  TOGGLE_ADD_ARTIST_DIALOG, 
  CREATE_ARTIST, 
  ADD_ARTIST_FAILURE, 
  TOGGLE_LOADING_SPINNER
} from '../constants';
import performFrontendLogout from '../../helpers/performFrontendLogout';

export function getArtists(userApiToken) {
  return dispatch => {
    return axios.get('http://localhost/api/artist', {
      headers: {
        Authorization: `Bearer ${userApiToken}`
      }
    }).then(response => {
      dispatch({ type: GET_ALL_ARTISTS, payload: response.data.artists });
    }).catch(_ => {
      performFrontendLogout(dispatch, history);
    });
  };
}

export function createArtist(artistName, userApiToken, onBlurAddItemForm) {
  return dispatch => {
    return axios.post('http://localhost/api/artist/create', {
      artistName
    }, {
      headers: {
        Authorization: `Bearer ${userApiToken}`
      }
    }).then(response => {
      dispatch({ type: CREATE_ARTIST, payload: response.data.artist });
      dispatch({ type: TOGGLE_ADD_ARTIST_DIALOG });
      onBlurAddItemForm({ target: { value: artistName } });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    }).catch(error => {
      if(error.response.status === 401) {
        performFrontendLogout(dispatch, history, true);

        return;
      }

      dispatch({ type: ADD_ARTIST_FAILURE, payload: error.response.data.errors.artistName });
      dispatch({ type: TOGGLE_LOADING_SPINNER });
    });
  };
}

export function toggleAddArtistDialog(withNotice) {
  return {
    type: TOGGLE_ADD_ARTIST_DIALOG,
    withNotice
  };
}