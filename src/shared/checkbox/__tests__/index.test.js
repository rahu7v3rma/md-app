import React from 'react';
import { TouchableOpacity } from 'react-native';
import { act, create } from 'react-test-renderer';

import CheckIcon from '@/assets/svgs/Check';
import Checkbox from '@/shared/checkbox';
import { Colors } from '@/theme/colors';

test('snapshot checked true', () => {
    expect(create(<Checkbox checked={true} />).toJSON()).toMatchSnapshot();
});

test('snapshot checked false', () => {
    expect(create(<Checkbox checked={false} />).toJSON()).toMatchSnapshot();
});

test('renders unchecked checkbox correctly', () => {
    const tree = create(<Checkbox checked={false} />);
    const view = tree.root.findByType(TouchableOpacity);
    expect(view.props.style[1]).toBe(false);
    const checkIcon = tree.root.findAllByType(CheckIcon);
    expect(checkIcon).toHaveLength(0);
});

test('renders checked checkbox correctly', () => {
    const tree = create(<Checkbox checked={true} />);
    const view = tree.root.findByType(TouchableOpacity);
    expect(view.props.style[1]).toMatchObject({
        backgroundColor: Colors.text.green,
        borderWidth: 0
    });
    const checkIcon = tree.root.findAllByType(CheckIcon);
    expect(checkIcon).toHaveLength(1);
});

test('calls onChange handler when clicked', async () => {
    const mockOnChange = jest.fn();
    const tree = create(<Checkbox checked={false} onChange={mockOnChange} />);
    const view = tree.root.findByType(TouchableOpacity);
    await act(() => view.props.onPress());
    expect(mockOnChange).toBeCalledWith(true);
});
