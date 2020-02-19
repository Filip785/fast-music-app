import { TOGGLE_ITEM, GET_ALL_AUDIO_ITEMS } from './audio.constants';
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

interface ToggleItemAction {
  type: typeof TOGGLE_ITEM,
  id: number
}

export interface GetAllAudioItemsAction {
  type: typeof GET_ALL_AUDIO_ITEMS,
  payload: AudioItem[]
}

export interface ToggleFileChangeAction {
  type: typeof TOGGLE_FILE_CHANGE,
  payload: AudioFile
}

export interface ToggleFileChangeFileExtensionForbidden {
  type: typeof FILE_EXTENSION_FORBIDDEN
}

export interface ToggleFileChangeFileExtensionForbiddenEnd {
  type: typeof FILE_EXTENSION_FORBIDDEN_END
}

export type AudioActionTypes =
  ToggleItemAction |
  GetAllAudioItemsAction;

export type AudioFileActionTypes = ToggleFileChangeAction | ToggleFileChangeFileExtensionForbidden | ToggleFileChangeFileExtensionForbiddenEnd;

export type AudioState = {
  audioItems: AudioItem[];
  fileUpload: FileUpload;
}