import React from 'react';
import { mount } from 'enzyme';
import LikeItem from './LikeItem';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

const mockStore = configureMockStore();

describe('LikeItem', () => {
  it('Should render when neccessary (current user is not the uploader, thus can like)', () => {
    const store = mockStore({});
    const component = mount(
      <Provider store={store}>
        <LikeItem userId={1} uploaderId={2} isLikedByUser={true} audioItemId={1} userApiToken="testtoken" numLikes={6} />
      </Provider>
    );
  
    expect(component.find('.like-button-text').length).toBe(1);
  });

  it('Should not render when not neccessary (current user is the uploader, thus cannot like)', () => {
    const store = mockStore({});
    const component = mount(
      <Provider store={store}>
        <LikeItem userId={1} uploaderId={1} isLikedByUser={true} audioItemId={1} userApiToken="testtoken" numLikes={6} />
      </Provider>
    );
  
    expect(component.find('.like-button-text').length).toBe(0);
  });
});