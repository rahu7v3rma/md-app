import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text
} from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';

import Wrapper from '@/shared/wrapper';

const mockLoading = false;
const mockChildren = <Text>mockChildren</Text>;
const mockOnRefresh = jest.fn().mockImplementation(() => {});
const mockOnScroll = jest.fn().mockImplementation((_) => {});

let tree: ReactTestRenderer;
beforeAll(() => {
    tree = create(
        <Wrapper
            loading={mockLoading}
            onRefresh={mockOnRefresh}
            onScroll={mockOnScroll}
        >
            {mockChildren}
        </Wrapper>
    );
});

test('Snapshot Testing with Jest', () => {
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders without crashing', () => {
    expect(tree.root).toBeTruthy();
});

test('does not display loading indicator when loading is false', () => {
    expect(tree.root.findAllByType(ActivityIndicator)).toHaveLength(0);
});

test('calls onRefresh callback when RefreshControl is triggered', async () => {
    await act(() => {
        tree.root.findByType(RefreshControl).props.onRefresh();
    });
    expect(mockOnRefresh).toBeCalled();
});

test('calls onScroll callback when ScrollView is scrolled', async () => {
    await act(() => {
        tree.root.findByType(ScrollView).props.onScrollEndDrag();
    });
    expect(mockOnScroll).toBeCalled();
});
