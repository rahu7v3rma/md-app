import { NavigationContainer } from '@react-navigation/native';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import { act, create } from 'react-test-renderer';

import { mockNavigate } from '@/jestSetup';
import Block from '@/pages/block';
import contentReducer from '@/reducers/content';
import { mockContentReducerState } from '@/utils/mockData';

jest.mock('@/shared/customCacheImage');

jest.unmock('@/hooks');

jest.unmock('@/reducers/content');

const mockReducer = combineReducers({
    content: contentReducer
});

const mockStore = configureStore({
    reducer: mockReducer,
    preloadedState: {
        content: mockContentReducerState
    }
});

let tree;
beforeAll(async () => {
    await act(() => {
        tree = create(
            <NavigationContainer>
                <Provider store={mockStore}>
                    <Block />
                </Provider>
            </NavigationContainer>
        );
    });
});

test('snapshot', async () => {
    expect(tree).toMatchSnapshot();
});

test('locked lesson', async () => {
    await act(() =>
        tree.root
            .findByProps({
                label: 'lesson3'
            })
            .props.onPress()
    );

    expect(mockNavigate).not.toBeCalled();
});

test('incomplete lesson', async () => {
    await act(() =>
        tree.root
            .findByProps({
                label: 'lesson2'
            })
            .props.onPress()
    );

    expect(mockNavigate).toBeCalledWith('LessonContent', {
        lessonId: 2,
        lessonName: 'lesson2',
        navigationKey: undefined,
        type: 'Block'
    });
});

test('complete lesson', async () => {
    await act(() =>
        tree.root
            .findByProps({
                label: 'lesson1'
            })
            .props.onPress()
    );

    expect(mockNavigate).toBeCalledWith('LessonContent', {
        lessonId: 1,
        lessonName: 'lesson1',
        navigationKey: undefined,
        type: 'Block'
    });
});
