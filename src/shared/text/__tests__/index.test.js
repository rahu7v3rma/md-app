import React from 'react';
import { Text as TextNative } from 'react-native';
import { act, create } from 'react-test-renderer';

import Text from '@/shared/text';
import { Colors } from '@/theme/colors';

test('snapshot', () => {
    expect(create(<Text />).toJSON()).toMatchSnapshot();
});

test('renders without crashing', () => {
    expect(create(<Text />).root.findByType(TextNative).props).toStrictEqual({
        adjustsFontSizeToFit: true,
        onPress: undefined,
        onTextLayout: undefined,
        numberOfLines: undefined,
        lineBreakMode: undefined,
        style: [
            { fontFamily: 'Poppins' },
            undefined,
            {
                fontSize: undefined,
                color: Colors.text.black,
                fontWeight: undefined,
                lineHeight: undefined
            }
        ],
        testID: undefined,
        children: undefined
    });
});

test('renders text content correctly', () => {
    expect(
        create(<Text>children</Text>).root.findByType(TextNative).props.children
    ).toBe('children');
});

test('applies custom styles to text', () => {
    expect(
        create(<Text style={{ color: 'blue' }} />).root.findByType(TextNative)
            .props.style[1]
    ).toMatchObject({
        color: 'blue'
    });
});

test('handles onPress event', async () => {
    const mockOnPress = jest.fn();
    const textComponent = create(
        <Text onPress={mockOnPress} />
    ).root.findByType(TextNative);
    expect(textComponent.props.onPress).toBe(mockOnPress);
    await act(() => textComponent.props.onPress());
    expect(mockOnPress).toBeCalled();
});

test('sets the correct fontSize', () => {
    expect(
        create(<Text size={10} />).root.findByType(TextNative).props.style[2]
            .fontSize
    ).toStrictEqual(10);
});

test('adjusts font size to fit when numberOfLines is not specified', () => {
    expect(
        create(<Text />).root.findByType(TextNative).props.adjustsFontSizeToFit
    ).toBe(true);
});
