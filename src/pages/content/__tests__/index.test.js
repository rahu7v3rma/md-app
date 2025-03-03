import { configureStore, createSlice } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import { act, create } from 'react-test-renderer';

import { mockGoBack, mockNavigate, mockUseRoute } from '@/jestSetup';
import LessonContent from '@/pages/content';
import { mockContentSelector } from '@/utils/mockData';

jest.mock('@/pages/content/components/textContent');

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: () => [false, () => {}],
    useEffect: jest.fn()
}));

jest.mock('@/reducers/content', () => ({
    ContentSelectors: jest.fn().mockImplementation(() => mockContentSelector),
    loadLesson: jest.fn(),
    completeLesson: jest.fn(),
    loadJourney: jest.fn(),
    getNavigationKey: {
        navigation: jest.fn()
    }
}));

test('snapshot', async () => {
    let tree;
    await act(() => {
        tree = create(
            <Provider
                store={configureStore({
                    reducer: createSlice({ name: 'mock' }).reducer
                })}
            >
                <LessonContent />
            </Provider>
        );
    });
    expect(tree).toMatchSnapshot();
});

test('incomplete lesson', async () => {
    mockUseRoute.mockReturnValueOnce({
        params: {
            lessonId: 1,
            lessonName: 'lesson1',
            navigationKey: 'Block1',
            type: 'Block'
        }
    });

    let tree;
    await act(() => {
        tree = create(
            <Provider
                store={configureStore({
                    reducer: createSlice({ name: 'mock' }).reducer
                })}
            >
                <LessonContent />
            </Provider>
        );
    });

    await act(() => tree.root.findByProps({ primary: true }).props.onPress());
    expect(mockNavigate).toBeCalledWith('Main.Home', {
        lessonId: 1
    });
});

test('completed lesson', async () => {
    mockUseRoute.mockReturnValueOnce({
        params: {
            lessonId: 2,
            lessonName: 'lesson2',
            navigationKey: 'Block2',
            type: 'Block'
        }
    });

    let tree;
    await act(() => {
        tree = create(
            <Provider
                store={configureStore({
                    reducer: createSlice({ name: 'mock' }).reducer
                })}
            >
                <LessonContent />
            </Provider>
        );
    });

    await act(() => tree.root.findByProps({ primary: true }).props.onPress());
    expect(mockGoBack).toBeCalled();
});
