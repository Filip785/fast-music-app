import { TOGGLE_FILE_CHANGE } from '../constants';

const allowedFileTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];

export function verifyIsAllowedFileType({ dispatch }) {
  return function (next) {
    return function (action) {
      if (action.type !== TOGGLE_FILE_CHANGE) {
        return next(action);
      }

      const fileAllowed = allowedFileTypes.includes(action.fileType);

      if (!fileAllowed) {
        // reset file value
        action.file.value = '';

        return dispatch({ type: 'FILE_EXTENSION_FORBIDDEN' });
      }

      const selectedFile = action.file.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        action.file = reader.result;
        next(action);
      };

      reader.readAsDataURL(selectedFile);
    }
  }
}