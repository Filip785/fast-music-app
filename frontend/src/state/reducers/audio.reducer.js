import { TOGGLE_ITEM } from "../constants";

const initialState = {
  musicItems: [
    {id: 0, toggle: false, title: 'JA REPUJEM', artist: 'Smoke Mardeljano', url: 'http://localhost/audio/smoke.mp3'},
    {id: 1, toggle: false, title: 'BEZ MIKSA', artist: 'Psihoaktiv Trip', url: 'http://localhost/audio/trip.mp3'}
  ]
};

export default function audio(state = initialState, action) {
  if(action.type === TOGGLE_ITEM) {
    return { ...state, musicItems: state.musicItems.map(item => item.id === action.payload ? { ...item, toggle: !item.toggle } : item) };
  }

  return state;
}