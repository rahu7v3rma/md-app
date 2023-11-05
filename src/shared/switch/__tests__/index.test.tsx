import React from 'react';
import { StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { Switch } from '@/shared';
import { Colors } from '@/theme/colors';

const switchStyle = StyleSheet.create({
    customStyle: {
        borderRadius: 50
    },
    wrapper: {
        borderRadius: 30,
        width: 37,
        height: 22,
        backgroundColor: Colors.button.app_button_lighter_background,
        borderColor: Colors.button.app_button_border,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    toggleCircle: {
        height: 20,
        width: 20,
        borderRadius: 20 / 2,
        backgroundColor: Colors.switch.button,
        marginLeft: 1
    },
    activeSwitchStyle: {
        backgroundColor: Colors.switch.toggled,
        alignItems: 'flex-end'
    },
    activeSwitchCircle: {
        marginRight: 1
    }
});

it('swicth snapshot', async () => {
    const tree = renderer.create(<Switch toggled={false} />);
    expect(tree).toMatchSnapshot();
});

it('input renders without crashing', async () => {
    const tree = renderer.create(<Switch toggled={true} />);
    expect(tree.root).toBeTruthy();
});

it('applies custom styles to the switch', async () => {
    const tree = renderer.create(
        <Switch
            toggled={false}
            style={switchStyle.customStyle}
            swichTestID={'swichTestID'}
        />
    );
    const switchComponent = tree.root.findByProps({
        testID: 'swichTestID'
    }).props;
    expect(switchComponent.style).toStrictEqual([
        switchStyle.wrapper,
        false,
        switchStyle.customStyle
    ]);
});

it('calls onPress callback when clicked', async () => {
    const onPress = jest.fn();
    const tree = renderer.create(
        <Switch
            toggled={false}
            style={switchStyle.customStyle}
            swichTestID={'swichTestID'}
            onPress={onPress}
        />
    );
    const swichTestID = tree.root.findByProps({
        testID: 'swichTestID'
    }).props;
    await act(() => swichTestID.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
});

it('applies active styles when toggled', async () => {
    const tree = renderer.create(
        <Switch
            toggled={true}
            style={switchStyle.customStyle}
            swichTestID={'swichTestID'}
        />
    );
    const switchComponent = tree.root.findByProps({
        testID: 'swichTestID'
    }).props;
    expect(switchComponent.style).toStrictEqual([
        switchStyle.wrapper,
        switchStyle.activeSwitchStyle,
        switchStyle.customStyle
    ]);
});

it('applies active styles to the circle when toggled', async () => {
    const tree = renderer.create(
        <Switch
            toggled={true}
            style={switchStyle.customStyle}
            switchCircleTestID={'switchCircleTestID'}
        />
    );
    const switchCircleTestID = tree.root.findByProps({
        testID: 'switchCircleTestID'
    }).props;
    expect(switchCircleTestID.style).toStrictEqual([
        switchStyle.toggleCircle,
        switchStyle.activeSwitchCircle
    ]);
});
