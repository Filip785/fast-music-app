import axios from 'axios';
import history from '../../helpers/history';
import { TOGGLE_ITEM } from '../constants';

export function toggleItem(id) {
  return {
    type: TOGGLE_ITEM,
    payload: id
  };
}