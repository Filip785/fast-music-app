import { TOGGLE_ITEM } from '../constants';

export function toggleItem(id) {
  return {
    type: TOGGLE_ITEM,
    payload: id
  };
}