import React from 'react';
import renderer, { act } from 'react-test-renderer';

import MainTabBar from '@/shared/mainTabBar';
import { Colors } from '@/theme/colors';

const routes = [
    {
        key: 'Main.Home-72IngE4NalfDeYLTCNpin',
        name: 'Main.Home',
        params: undefined
    },
    {
        key: 'Main.Chat-9zNnxhpmX9VhG5jYgMFe7',
        name: 'Main.Chat',
        params: undefined
    },
    {
        key: 'Main.OpenPlus-mBv4cA4Zrihgj6LiqAvzY',
        name: 'Main.OpenPlus',
        params: undefined
    },
    {
        key: 'Main.Journey-1xkr8mg9Jd0fQnd2cNbV_',
        name: 'Main.Journey',
        params: undefined
    },
    {
        key: 'Me-ZfmuA7qwODrTO82cjGQOn',
        name: 'Me',
        params: undefined
    }
];

const mockEmit = jest.fn().mockImplementation(() => {
    return {
        defaultPrevented: false
    };
});
const mockNavigate = jest.fn();
let mockNavigation = {
    getState: jest.fn().mockImplementation(() => {
        return {
            routes: routes,
            index: 1
        };
    }),
    emit: mockEmit,
    navigate: mockNavigate
};

const mockDescriptors = {
    'Main.Chat-9zNnxhpmX9VhG5jYgMFe7': {
        options: {
            headerShown: false,
            title: 'Chat',
            tabBarTestID: 'Chat'
        }
    },
    'Main.Home-72IngE4NalfDeYLTCNpin': {
        options: {
            headerShown: false,
            title: 'Home',
            tabBarTestID: 'Home'
        }
    },
    'Main.Journey-1xkr8mg9Jd0fQnd2cNbV_': {
        options: {
            headerShown: false,
            title: 'Journey',
            tabBarTestID: 'Journey'
        }
    },
    'Main.OpenPlus-mBv4cA4Zrihgj6LiqAvzY': {
        options: {
            headerShown: false,
            tabBarTestID: 'Plus'
        }
    },
    'Me-ZfmuA7qwODrTO82cjGQOn': {
        options: {
            headerShown: false,
            title: 'Me',
            tabBarTestID: 'Me'
        }
    }
};

let tree;
beforeEach(async () => {
    tree = await act(() =>
        renderer.create(
            <MainTabBar
                navigation={mockNavigation}
                descriptors={mockDescriptors}
            />
        )
    );
});

describe('test main tab bar', () => {
    it('snapshot test', async () => {
        expect(tree).toMatchSnapshot();
    });

    it('renders without crashing', async () => {
        expect(tree.root).toBeTruthy();
    });

    it('renders the correct number of tabs', async () => {
        let tabs = tree.root.findByType('View').children;
        expect(tabs.length).toEqual(5);
    });

    it('calls the onPress function when a tab is pressed', async () => {
        await act(() =>
            tree.root.findByProps({ testID: 'Journey' }).props.onPress()
        );
        expect(mockNavigate).toBeCalledWith('Main.Journey');
    });

    it('calls the onLongPress function when a tab is long-pressed', async () => {
        await act(() =>
            tree.root.findByProps({ testID: 'Chat' }).props.onLongPress()
        );
        expect(mockEmit).toBeCalledWith({
            type: 'tabLongPress',
            target: 'Main.Chat-9zNnxhpmX9VhG5jYgMFe7'
        });
    });

    it('applies focused styles to the active tab', async () => {
        mockNavigation.getState = jest.fn().mockImplementation(() => {
            return {
                routes: routes,
                index: 4
            };
        });
        await act(() =>
            tree.update(
                <MainTabBar
                    navigation={mockNavigation}
                    descriptors={mockDescriptors}
                />
            )
        );
        expect(
            tree.root.findByProps({ testID: 'Me' }).findByType('Text').props
                .style[2].color
        ).toEqual(Colors.text.text_gray_black);
    });

    it('applies proper text color to the tab labels', async () => {
        expect(
            tree.root.findByProps({ testID: 'Home' }).findByType('Text').props
                .style[2].color
        ).toEqual(Colors.text.gray);
    });
});
