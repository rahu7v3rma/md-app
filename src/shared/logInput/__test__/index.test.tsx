import React from 'react';
import { StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import LogInput from '@/shared/logInput';
import { Colors } from '@/theme/colors';

const logInputStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.extras.white,
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 16,
        shadowColor: Colors.theme.app_sheet_background_color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 5,
        marginVertical: 8
    }
});

it('logInput snapshot', async () => {
    const tree = renderer.create(
        <LogInput
            fieldName={'Enter Water Level'}
            value={'0'}
            onPress={() => {}}
        />
    );
    expect(tree).toMatchSnapshot();
});

it('displays fieldName and value correctly', async () => {
    const tree = renderer.create(
        <LogInput
            fieldName={'Enter Water Level'}
            value={'10'}
            onPress={() => {}}
        />
    );
    const fieldNameTxt = tree.root.findByProps({
        testID: 'fieldNameTxt'
    }).props;
    expect(fieldNameTxt.children).toBe('Enter Water Level');
    const valueTxt = tree.root.findByProps({
        testID: 'valueTxt'
    }).props;
    expect(valueTxt.children).toBe('10');
});

it('applies styles correctly', async () => {
    const tree = renderer.create(
        <LogInput
            fieldName={'Enter Water Level'}
            value={'0'}
            style={{
                backgroundColor: 'black'
            }}
            onPress={() => {}}
        />
    );
    const logInputContainer = tree.root.findByProps({
        testID: 'logInputContainer'
    }).props;
    expect(logInputContainer.style).toStrictEqual([
        logInputStyle.container,
        {
            backgroundColor: 'black'
        }
    ]);
});

it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const tree = renderer.create(
        <LogInput
            fieldName={'Enter Water Level'}
            value={'10'}
            onPress={onPress}
        />
    );
    const logInputContainer = tree.root.findByProps({
        testID: 'logInputContainer'
    }).props;
    await act(() => logInputContainer.onPress());
    expect(onPress).toHaveBeenCalledTimes(1);
});
