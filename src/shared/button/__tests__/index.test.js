import React from 'react';
import { StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import Button from '@/shared/button';
import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';

const buttonStyle = StyleSheet.create({
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15.5,
        paddingVertical: COMMON.isIos ? 24 : 17.5,
        borderRadius: 20,
        margin: 0
    },
    primary: {
        backgroundColor: Colors.theme.primary,
        borderColor: Colors.theme.primary
    }
});

it('button snapshot', async () => {
    const tree = renderer.create(
        <Button
            primary
            block
            bordered={false}
            style={{}}
            disabled={false}
            onPress={() => {}}
        />
    );
    expect(tree).toMatchSnapshot();
});

it('should trigger the onPress event when clicked', async () => {
    const onPress = jest.fn();
    const tree = renderer.create(
        <Button
            primary
            block
            bordered={false}
            style={{}}
            disabled={false}
            onPress={onPress}
            testID="button"
        />
    );
    const touchArea = tree.root.findByProps({ activeOpacity: 0.75 }).props;
    await act(() => touchArea.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
});

it('should be disabled when the disabled prop is true', async () => {
    const tree = renderer.create(
        <Button
            bordered={false}
            style={{}}
            disabled={true}
            onPress={() => {}}
            testID="button"
        />
    );
    const button = tree.root.findByProps({ testID: 'button' }).props;
    expect(button.disabled).toBe(true);
    const touchArea = tree.root.findByProps({ activeOpacity: 1 }).props;
    expect(touchArea.disabled).toBe(true);
});

it('should have the correct styles for the primary variant', async () => {
    const tree = renderer.create(
        <Button
            primary
            bordered={false}
            style={{}}
            disabled={false}
            onPress={() => {}}
            testID="button"
        />
    );
    const touchArea = tree.root.findByProps({ activeOpacity: 0.75 }).props;
    expect(touchArea.style).toStrictEqual([
        buttonStyle.wrapper,
        false,
        buttonStyle.primary,
        false,
        undefined,
        undefined,
        {}
    ]);
});
