import React from 'react';
import { StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { Input } from '@/shared';
import { Colors } from '@/theme/colors';

const inputStyle = StyleSheet.create({
    textInput: {
        flex: 1,
        fontFamily: 'Poppins',
        fontWeight: '500',
        color: Colors.text.mainDarker,
        fontSize: 16
    }
});

it('input snapshot', async () => {
    const tree = renderer.create(<Input />);
    expect(tree).toMatchSnapshot();
});

it('input renders without errors', async () => {
    const tree = renderer.create(<Input />);
    expect(tree.root).toBeTruthy();
});

it('displays placeholder text', async () => {
    const tree = renderer.create(
        <Input textInputTestID="textInput" placeholder={'input placeholder'} />
    );
    let textInput = tree.root.findByProps({
        testID: 'textInput'
    }).props;
    expect(textInput.placeholder).toBe('input placeholder');
});

it('applies custom styling', async () => {
    const tree = renderer.create(
        <Input
            textInputTestID="textInput"
            textInputStyle={{ color: 'white' }}
        />
    );
    let textInput = tree.root.findByProps({
        testID: 'textInput'
    }).props;
    expect(textInput.style).toStrictEqual([
        inputStyle.textInput,
        {},
        { color: 'white' }
    ]);
});

it('handles text input correctly', async () => {
    const tree = renderer.create(<Input textInputTestID="textInput" />);
    let textInput = tree.root.findByProps({
        testID: 'textInput'
    }).props;
    expect(textInput.value).toBe('');
    await act(() => textInput.onChangeText('textValue'));
    let textInputUpdated = tree.root.findByProps({
        testID: 'textInput'
    }).props;
    expect(textInputUpdated.value).toBe('textValue');
});

it('triggers onChange callback', async () => {
    const onChange = jest.fn();
    const tree = renderer.create(
        <Input onChange={onChange} textInputTestID="textInput" />
    );
    let textInput = tree.root.findByProps({
        testID: 'textInput'
    }).props;
    await act(() => textInput.onChange());
    expect(onChange).toHaveBeenCalled();
});

it('displays an error message when showError is true', async () => {
    const tree = renderer.create(
        <Input
            errorMsgTestID={'errorMsg'}
            showError={true}
            errorMessage={'please enter text'}
        />
    );
    let errorText = tree.root.findByProps({
        testID: 'errorMsg'
    });
    expect(errorText).toBeTruthy();
    expect(errorText.props.children).toBe('please enter text');
});

it('displays secure text entry for password input', async () => {
    const tree = renderer.create(
        <Input secureTextEntry={true} textInputTestID="textInput" />
    );
    let textInput = tree.root.findByProps({
        testID: 'textInput'
    }).props;
    expect(textInput.secureTextEntry).toBe(true);
});

it('calls iconPress callback when the icon is pressed', async () => {
    const iconPress = jest.fn();
    const tree = renderer.create(
        <Input
            iconPressTestID={'iconPress'}
            Icon={() => <></>}
            iconPress={iconPress}
        />
    );
    let pressableIcon = tree.root.findByProps({
        testID: 'iconPress'
    }).props;
    await act(() => pressableIcon.onPress());
    expect(iconPress).toHaveBeenCalled();
});
