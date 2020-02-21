import { TOGGLE_ITEM, GET_ALL_AUDIO_ITEMS, LIKE_ITEM, TOGGLE_ITEM_ARTIST_SONGS, GET_AUDIO_ITEMS_FOR_ARTISTS, LIKE_ITEM_ARTISTS, GET_PROFILE_DATA, DELETE_AUDIO, DELETE_AUDIO_ARTISTS } from './audio.constants';
import { TOGGLE_FILE_CHANGE, FILE_EXTENSION_FORBIDDEN, FILE_EXTENSION_FORBIDDEN_END } from './audio.file.constants';

interface AudioItemUploader {
  id: number;
  name: string;
}

export interface AudioItem {
  id: number;
  songTitle: string;
  artistName: string;
  url: string;
  toggle: boolean;
  isLikedByUser: boolean;
  likes: number;
  uploader: AudioItemUploader;
}

export interface AudioFile {
  name?: string;
  size?: string;
  file?: HTMLInputElement;
  fileType?: string;
  fileResult?: string | ArrayBuffer | null;
}

export interface AudioFileErrors {
  songTitle?: string;
  artistId?: string;
  fileUpload?: string;
  allowedUsers?: string;
  fileExtensionNotAllowed?: boolean;
}

export interface FileUpload {
  musicFile: AudioFile;
  musicFileErrors: AudioFileErrors;
}

export interface ArtistAudioItem {
  id: number;
  toggle: boolean;
  artistName: string;
  audioItems: AudioItem[];
}

export interface Profile {
  id?: number;
  name?: string;
  accountCreationDate?: string;
  numberOfUploads?: number;
}

export interface ToggleItemAction {
  type: typeof TOGGLE_ITEM;
  id: number;
}

export interface GetAllAudioItemsAction {
  type: typeof GET_ALL_AUDIO_ITEMS;
  payload: AudioItem[];
}

export interface LikeItemAction {
  type: typeof LIKE_ITEM;
  audioId: number;
  likeCount: number;
}

export interface LikeArtistItemAction {
  type: typeof LIKE_ITEM_ARTISTS;
  audioId: number;
  likeCount: number;
  artistId: number;
}

export interface ToggleItemArtistSongsAction {
  type: typeof TOGGLE_ITEM_ARTIST_SONGS;
  value: number;
}

export interface GetItemArtistSongsAction {
  type: typeof GET_AUDIO_ITEMS_FOR_ARTISTS;
  payload: ArtistAudioItem[];
}

export interface GetProfileDataAction {
  type: typeof GET_PROFILE_DATA;
  profileData: Profile;
  accessibleItems: AudioItem[];
}

export interface DeleteAudioAction {
  type: typeof DELETE_AUDIO;
  audioId: number;
}

export interface DeleteAudioArtistsAction {
  type: typeof DELETE_AUDIO_ARTISTS;
  audioId: number;
  artistId: number;
}

export interface ToggleFileChangeAction {
  type: typeof TOGGLE_FILE_CHANGE;
  payload: AudioFile;
}

export interface ToggleFileChangeFileExtensionForbidden {
  type: typeof FILE_EXTENSION_FORBIDDEN;
}

export interface ToggleFileChangeFileExtensionForbiddenEnd {
  type: typeof FILE_EXTENSION_FORBIDDEN_END;
}

export type AudioActionTypes =
  ToggleItemAction |
  GetAllAudioItemsAction |
  LikeItemAction |
  LikeArtistItemAction |
  ToggleItemArtistSongsAction | 
  GetItemArtistSongsAction | 
  GetProfileDataAction |
  DeleteAudioAction |
  DeleteAudioArtistsAction;

export type AudioFileActionTypes = ToggleFileChangeAction | ToggleFileChangeFileExtensionForbidden | ToggleFileChangeFileExtensionForbiddenEnd;

export type AudioState = {
  audioItems: AudioItem[];
  audioItemsArtists: ArtistAudioItem[];
  fileUpload: FileUpload;
  profile: Profile;
}