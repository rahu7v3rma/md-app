import React from 'react';
import { StatusBar } from 'react-native';
import { create } from 'react-test-renderer';

import CustomStatusBar from '@/shared/customStatusBar';
import { Colors } from '@/theme/colors';

test('snapshot / renders without errors', () => {
    expect(create(<CustomStatusBar />).toJSON()).toMatchSnapshot();
});

test('sets the background color correctly', () => {
    const mockBackgroundColor = 'blue';
    const tree = create(
        <CustomStatusBar backgroundColor={mockBackgroundColor} />
    );
    const statusBar = tree.root.findByType(StatusBar);
    expect(statusBar.props.backgroundColor).toBe(mockBackgroundColor);
});

test('sets the bar style correctly', () => {
    const mockBarStyle = 'light-content';
    const tree = create(<CustomStatusBar barStyle={mockBarStyle} />);
    const statusBar = tree.root.findByType(StatusBar);
    expect(statusBar.props.barStyle).toBe(mockBarStyle);
});

test('uses default values when no props are provided', async () => {
    const tree = create(<CustomStatusBar />);
    const statusBar = tree.root.findByType(StatusBar);
    expect(statusBar.props.backgroundColor).toBe(Colors.statusBar.white);
    expect(statusBar.props.barStyle).toBe('dark-content');
});
