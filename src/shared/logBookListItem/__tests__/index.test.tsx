import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { mockNavigate } from '@/jestSetup';
import { LogBookListItem } from '@/shared';
import { logItem } from '@/utils/mockData';

it('logBookListItem snapshot', async () => {
    const tree = renderer.create(
        <LogBookListItem
            key={`key-1`}
            icon={'<svg></svg>'}
            title={'title'}
            type={'LogMeal' as any}
        >
            <></>
        </LogBookListItem>
    );
    expect(tree).toMatchSnapshot();
});

it('logBookListItem renders without errors', async () => {
    const tree = renderer.create(
        <LogBookListItem
            key={`key-1`}
            icon={'<svg></svg>'}
            title={'title'}
            type={'LogMeal' as any}
        >
            <></>
        </LogBookListItem>
    );
    expect(tree.root).toBeTruthy();
});

it('calls navigate when pressed if item type is not userLesson', async () => {
    const tree = renderer.create(
        <LogBookListItem
            key={`key-1`}
            icon={'<svg></svg>'}
            title={'title'}
            type={'LogMeal' as any}
            containerTouchID={'containerTouchID'}
        >
            <></>
        </LogBookListItem>
    );
    let containerTouchID = tree.root.findByProps({
        testID: 'containerTouchID'
    }).props;
    await act(() => containerTouchID.onPress());
    expect(mockNavigate).toHaveBeenCalledWith('LogMeal', undefined);
});

it('does not call navigate when pressed if item type is userLesson', async () => {
    const tree = renderer.create(
        <LogBookListItem
            key={`key-1`}
            icon={'<svg></svg>'}
            title={'title'}
            type={'UserLesson' as any}
            item={logItem}
            containerTouchID={'containerTouchID'}
        >
            <></>
        </LogBookListItem>
    );
    let containerTouchID = tree.root.findByProps({
        testID: 'containerTouchID'
    }).props;
    await act(() => containerTouchID.onPress());
    expect(mockNavigate).not.toHaveBeenCalledWith('UserLesson', logItem);
});

it('renders title and time correctly', async () => {
    const tree = renderer.create(
        <LogBookListItem
            key={`key-1`}
            icon={'<svg></svg>'}
            title={'Log Blood'}
            time="00:30"
            type={'UserLesson' as any}
            item={logItem}
            containerTouchID={'containerTouchID'}
            timeTestID={'timeTestID'}
            titleTestID={'titleTestID'}
        >
            <></>
        </LogBookListItem>
    );
    let titleTestID = tree.root.findByProps({
        testID: 'titleTestID'
    }).props;
    expect(titleTestID.children).toBe('Log Blood');
    let timeTestID = tree.root.findByProps({
        testID: 'timeTestID'
    }).props;
    expect(timeTestID.children).toBe('00:30');
});
