import React from 'react';
import { StyleSheet } from 'react-native';
import renderer, { act } from 'react-test-renderer';

import { BellIcon } from '@/assets/svgs';
import ListItem from '@/shared/listItem';
import { Colors } from '@/theme/colors';

const listItemStyles = StyleSheet.create({
    container: {
        height: 56,
        backgroundColor: Colors.extras.white,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 16
    },
    icon: {
        width: '15%',
        alignItems: 'center'
    },
    title: {
        width: '75%'
    },
    arrow: {
        width: '10%'
    }
});

it('listItem Snapshot Testing with Jest', async () => {
    const tree = renderer.create(<ListItem />);
    expect(tree).toMatchSnapshot();
});

it('listItem renders without crashing', async () => {
    const tree = renderer.create(<ListItem />);
    expect(tree.root).toBeTruthy();
});

it('listItem renders the provided title correctly', async () => {
    const title = 'Test Title';
    const tree = renderer.create(<ListItem title={title} />);
    const listItemTitle = tree.root.findByProps({
        testID: 'listItemTitle'
    }).props;
    expect(listItemTitle.children).toBe(title);
});

it('listItem renders the provided Icon component correctly', async () => {
    const tree = renderer.create(<ListItem Icon={BellIcon} />);
    const listItemIcon = tree.root.findByProps({
        testID: 'listItemIcon'
    }).props;
    expect(listItemIcon.children).toMatchSnapshot();
});

it('listItem calls onPress when the component is pressed', async () => {
    const onListItemPress = jest.fn();
    const tree = renderer.create(<ListItem onPress={onListItemPress} />);

    const listItemButton = tree.root.findByProps({
        testID: 'listItemButton'
    }).props;
    await act(() => listItemButton.onPress());
    expect(onListItemPress).toHaveBeenCalledTimes(1);
});

it('listItem applies the correct styles', async () => {
    const tree = renderer.create(<ListItem />);
    const listItemButton = tree.root.findByProps({
        testID: 'listItemButton'
    }).props;
    expect(listItemButton.style).toStrictEqual(listItemStyles.container);

    const listItemIcon = tree.root.findByProps({
        testID: 'listItemIcon'
    }).props;
    expect(listItemIcon.style).toStrictEqual(listItemStyles.icon);

    const listItemTitleContainer = tree.root.findByProps({
        testID: 'listItemTitleContainer'
    }).props;
    expect(listItemTitleContainer.style).toStrictEqual(listItemStyles.title);

    const listItemArrow = tree.root.findByProps({
        testID: 'listItemArrow'
    }).props;
    expect(listItemArrow.style).toStrictEqual(listItemStyles.arrow);
});
