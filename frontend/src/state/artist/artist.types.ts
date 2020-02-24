import { GET_ALL_ARTISTS, TOGGLE_ADD_ARTIST_DIALOG, CREATE_ARTIST, ADD_ARTIST_FAILURE } from "./artist.constants";

export interface ArtistErrors {
  message?: string;
}

export interface ArtistBlurType {
  target: { value: string }
};

export interface Artist {
  id?: number;
  artistName?: string;
}

export interface GetAllArtistsAction {
  type: typeof GET_ALL_ARTISTS;
  payload: Artist[];
}

export interface ToggleAddArtistDialogAction {
  type: typeof TOGGLE_ADD_ARTIST_DIALOG;
  withNotice: boolean;
}

export interface CreateArtistAction {
  type: typeof CREATE_ARTIST;
  payload: Artist;
}

export interface AddArtistFailureAction {
  type: typeof ADD_ARTIST_FAILURE;
  payload: string;
}

export type ArtistActionTypes = GetAllArtistsAction |
                                ToggleAddArtistDialogAction |
                                CreateArtistAction |
                                AddArtistFailureAction;

export interface ArtistState {
  artists: Artist[];
  addArtistDialogOpen: boolean;
  withNotice: boolean;
  addArtistFailure: ArtistErrors;
}