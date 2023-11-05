import React from 'react';
import { Animated, View } from 'react-native';
import { act, create } from 'react-test-renderer';

import ProgressBar from '@/shared/progressBar';

beforeEach(() => {
    jest.useFakeTimers();
});

afterEach(() => {
    jest.useRealTimers();
});

test('snapshot/should render without errors', async () => {
    let tree;
    await act(() => (tree = create(<ProgressBar />)));
    expect(tree.toJSON()).toMatchSnapshot();
});

test('should display the initial progress correctly', async () => {
    let tree;
    await act(() => (tree = create(<ProgressBar />)));
    const width = tree.root.findByType(Animated.View).props.style[3].width;
    expect(width._parent._value).toBe(0);
    expect(width._parent._animation._toValue).toBe(0);
});

test('should update the progress animation', async () => {
    let tree;
    await act(() => (tree = create(<ProgressBar progress={10} />)));
    let width = tree.root.findByType(Animated.View).props.style[3].width;
    expect(width._parent._value).toBe(0);
    expect(width._parent._animation._toValue).toBe(10);
    await act(() => jest.advanceTimersByTime(1000));
    expect(width._parent._value).toBe(10);
    expect(width._parent._animation).toBe(null);
    await act(() => tree.update(<ProgressBar progress={20} />));
    width = tree.root.findByType(Animated.View).props.style[3].width;
    expect(width._parent._value).toBe(10);
    expect(width._parent._animation._toValue).toBe(20);
    await act(() => jest.advanceTimersByTime(1000));
    expect(width._parent._value).toBe(20);
    expect(width._parent._animation).toBe(null);
});

test('should apply the style prop correctly', async () => {
    let tree;
    await act(
        () => (tree = create(<ProgressBar style={{ borderColor: 'blue' }} />))
    );
    const view = tree.root.findByType(View);
    expect(view.props.style[1]).toMatchObject({ borderColor: 'blue' });
});

test('should apply the barStyle prop correctly', async () => {
    let tree;
    await act(
        () =>
            (tree = create(<ProgressBar barStyle={{ borderColor: 'blue' }} />))
    );
    const view = tree.root.findByType(Animated.View);
    expect(view.props.style[2]).toMatchObject({ borderColor: 'blue' });
});
