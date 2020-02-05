import { GET_ALL_ARTISTS, DO_LOGOUT, TOGGLE_ADD_ARTIST_DIALOG, CREATE_ARTIST, ADD_ARTIST_FAILURE } from "../constants";
import axios from 'axios';
import history from '../../helpers/history';

export function getArtists(userApiToken) {
  return dispatch => {
    return axios.get('http://localhost/api/artist', {
      headers: {
        Authorization: `Bearer ${userApiToken}`
      }
    }).then(response => {
      dispatch({ type: GET_ALL_ARTISTS, payload: response.data.artists });
    }).catch(_ => {
      // user is not logged in
      localStorage.removeItem('authUser');
      dispatch({ type: DO_LOGOUT });
      history.push('/login');
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
    }).catch(error => {
      dispatch({ type: ADD_ARTIST_FAILURE, payload: error.response.data.errors.artistName });
    });
  };
}

export function toggleAddArtistDialog() {
  return {
    type: TOGGLE_ADD_ARTIST_DIALOG
  };
}