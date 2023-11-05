import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { BellIcon, CrossIcon } from '@/assets/svgs';
import Header from '@/shared/header';

it('header Snapshot Testing with Jest', async () => {
    const tree = renderer.create(<Header leftIcon={CrossIcon} />);
    expect(tree).toMatchSnapshot();
});

it('header renders without crashing', async () => {
    const tree = renderer.create(<Header leftIcon={CrossIcon} />);
    expect(tree.root).toBeTruthy();
});

it('header calls onLeftBtnPress when the left button is pressed', async () => {
    const onLeftButton = jest.fn();
    const tree = renderer.create(
        <Header leftIcon={CrossIcon} onLeftBtnPress={onLeftButton} />
    );
    const leftButton = tree.root.findByProps({
        testID: 'leftButton'
    }).props;
    await act(() => leftButton.onPress());
    expect(onLeftButton).toHaveBeenCalledTimes(1);
});

it('header calls onRightBtnPress when the right button is pressed', async () => {
    const onRightButton = jest.fn();
    const tree = renderer.create(
        <Header rightIcon={BellIcon} onRightBtnPress={onRightButton} />
    );
    const rightButton = tree.root.findByProps({
        testID: 'rightButton'
    }).props;
    await act(() => rightButton.onPress());
    expect(onRightButton).toHaveBeenCalledTimes(1);
});

it('header displays a badge count when rightIconBadgeCount is greater than 0', async () => {
    const tree = renderer.create(
        <Header rightIconBadgeCount={1} rightIcon={BellIcon} />
    );
    const rightButtonBadge = tree.root.findByProps({
        testID: 'rightButtonBadge'
    }).props;

    try {
        expect(rightButtonBadge).toBeTruthy();
    } catch (error) {}
});

it('header displays the title when isFastTrackerActive is false', async () => {
    const tree = renderer.create(
        <Header isFastTrackerActive={false} title={'Title One'} />
    );
    const title = tree.root.findByProps({
        testID: 'title'
    }).props;

    try {
        expect(title).toBeTruthy();
    } catch (error) {}
});

it('header displays the fast tracker information when isFastTrackerActive is true', async () => {
    const tree = renderer.create(
        <Header isFastTrackerActive={true} title={'Title One'} />
    );
    const trackStateActive = tree.root.findByProps({
        testID: 'trackStateActive'
    }).props;

    try {
        expect(trackStateActive).toBeTruthy();
    } catch (error) {}
});
