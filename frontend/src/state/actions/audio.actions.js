import { TOGGLE_ITEM, TOGGLE_FILE_CHANGE, FILE_EXTENSION_FORBIDDEN_END } from '../constants';

export function toggleItem(id) {
  return {
    type: TOGGLE_ITEM,
    payload: id
  };
}

export function toggleFileChange(fileName, size, fileType, file) {
  let displaySize = size / 1024;
  let label = 'KB';

  if(displaySize > 1024) {
    displaySize = displaySize / 1024;
    label = 'MB';
  }

  return {
    type: TOGGLE_FILE_CHANGE,
    payload: fileName,
    size: `${displaySize.toFixed(2)} ${label}`,
    fileType, 
    file
  };
}

export function closeFileNotAllowedPrompt() {
  return {
    type: FILE_EXTENSION_FORBIDDEN_END
  };
}