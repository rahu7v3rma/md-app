import React from 'react';
import { StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import track from '@/assets/svg/track.svg';
import LogTab from '@/shared/logTab';
import { Colors } from '@/theme/colors';
import { LayoutContants } from '@/theme/layoutContants';

const logTabStyle = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: LayoutContants.cardHeight,
        width: '44%',
        borderWidth: 1.5,
        backgroundColor: Colors.extras.white,
        borderRadius: 20,
        shadowColor: Colors.theme.app_sheet_background_color,
        elevation: 3
    }
});

it('logTab snapshot', async () => {
    const tree = renderer.create(<LogTab icon={track} title="Fasting Timer" />);
    expect(tree).toMatchSnapshot();
});

it('logTab renders without crashing', async () => {
    const tree = renderer.create(<LogTab icon={track} title="Fasting Timer" />);
    expect(tree.root).toBeTruthy();
});

it('displays title and icon correctly', async () => {
    const tree = renderer.create(<LogTab icon={track} title="Fasting Timer" />);
    const logTabTitle = tree.root.findByProps({
        testID: 'logTabTitle'
    }).props;
    expect(logTabTitle.children).toBe('Fasting Timer');

    const logTabIcon = tree.root.findByProps({
        testID: 'logTabIcon'
    }).props;
    expect(logTabIcon.xml).toBe(track);
});

it('applies styles correctly', async () => {
    const active = false;
    const logTabContainerStyle = {
        width: '90%'
    };
    const logTabTextStyle = {
        width: '100%'
    };
    const tree = renderer.create(
        <LogTab
            icon={track}
            title="Fasting Timer"
            active={active}
            style={logTabContainerStyle}
            textStyle={logTabTextStyle}
        />
    );

    const logTabContainer = tree.root.findByProps({
        testID: 'logTab'
    }).props;
    expect(logTabContainer.style).toStrictEqual([
        logTabStyle.wrapper,
        {
            borderColor: active ? Colors.theme.primary : Colors.extras.white
        },
        logTabContainerStyle
    ]);

    const logTabTitleContainer = tree.root.findByProps({
        testID: 'logTabTitleContainer'
    }).props;
    expect(logTabTitleContainer.style).toStrictEqual(logTabTextStyle);
});

it('calls onTabPress when tab is pressed', async () => {
    const onTabPress = jest.fn();
    const tree = renderer.create(
        <LogTab icon={track} title="Fasting Timer" onTabPress={onTabPress} />
    );
    const logTabContainer = tree.root.findByProps({
        testID: 'logTab'
    }).props;
    await act(() => logTabContainer.onPress());
    expect(onTabPress).toHaveBeenCalledTimes(1);
});
