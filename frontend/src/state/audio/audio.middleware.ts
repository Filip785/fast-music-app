import { Middleware } from 'redux';
import { ToggleFileChangeAction } from './audio.types';
import { Dispatch } from 'redux';
import { TOGGLE_FILE_CHANGE, FILE_EXTENSION_FORBIDDEN } from './audio.file.constants';

const allowedFileTypes: string[] = ['audio/mpeg', 'audio/wav', 'audio/mp3'];

export function verifyIsAllowedFileType(): Middleware {
  return (api) => (next: Dispatch<ToggleFileChangeAction>) => (action: ToggleFileChangeAction) => {
    if (action.type !== TOGGLE_FILE_CHANGE) {
      return next(action);
    }

    const fileAllowed = allowedFileTypes.includes(action.payload.fileType!);

    if (!fileAllowed) {
      if (action.payload.file) {
        action.payload.file.value = '';
      }

      return api.dispatch({ type: FILE_EXTENSION_FORBIDDEN });
    }

    const selectedFile: File | null | undefined = action.payload.file?.files![0];

    const reader = new FileReader();
    reader.onload = () => {
      action.payload.fileResult = reader.result;
      next(action);
    };

    reader.readAsDataURL(selectedFile!);
  };
}