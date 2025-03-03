import React from 'react';
import 'react-native';
import renderer, { act } from 'react-test-renderer';

import { mockGoBack, mockNavigate, mockToast } from '@/jestSetup';
import WebViewScreen from '@/pages/webView';
import { COMMON } from '@/utils/common';

let tree;

jest.unmock('@/hooks');
jest.spyOn(COMMON, 'delay').mockImplementation(jest.fn());
let response = {};
let mockUnwrap = jest.fn().mockImplementation(() => {
    return Promise.resolve(response);
});

let mockDispatch = jest.fn().mockImplementation(() => {
    return {
        unwrap: mockUnwrap
    };
});
jest.mock('@/hooks', () => ({
    useAppDispatch: () => mockDispatch
}));

jest.mock('@/navigation', () => ({
    RootNavigationProp: {},
    RootStackParamList: {}
}));

describe('user open webview screen', () => {
    beforeAll(async () => {
        tree = await act(() => renderer.create(<WebViewScreen />));
    });

    it('Snapshot Testing with Jest', () => {
        expect(tree).toMatchSnapshot();
    });

    it('loads the correct URL in WebView', () => {
        expect(
            tree.root.findByProps({ testID: 'webView' }).props.source
        ).toStrictEqual({ uri: 'https://www.google.com/' });
    });

    it('displays loading indicator while WebView is loading', async () => {
        let loadingElement = tree.root.findAllByProps({ testID: 'loading' });
        expect(loadingElement.length).toBeGreaterThan(0);
    });

    it('hides loading indicator when WebView finished loading', async () => {
        await act(() =>
            tree.root.findByProps({ testID: 'webView' }).props.onLoad({
                nativeEvent: {
                    url: 'https://www.google.com/'
                }
            })
        );
        let loadingElement = tree.root.findAllByProps({ testID: 'loading' });
        expect(loadingElement.length).toEqual(0);
    });

    it('handles WebView navigation state change correctly', async () => {
        jest.spyOn(COMMON, 'delay').mockImplementation(jest.fn());
        await act(() =>
            tree.root
                .findByProps({ testID: 'webView' })
                .props.onNavigationStateChange({
                    url: 'https://www.google.com/submit/'
                })
        );
        expect(mockNavigate).toBeCalledWith('Main');
        expect(mockToast).not.toBeCalled();
    });

    it('displays error toast message and navigates back on submission error', async () => {
        response = {
            onboarding_form_url: 'http://test_url'
        };
        await act(() =>
            tree.root
                .findByProps({ testID: 'webView' })
                .props.onNavigationStateChange({
                    url: 'https://www.google.com/submit/'
                })
        );
        expect(mockNavigate).toBeCalledWith('Main');
        expect(mockToast).toBeCalledWith({
            type: 'errorResponse',
            text1: 'An unknown error has occurred',
            position: 'bottom'
        });
    });

    it('navigates back when the left button in the header is pressed', async () => {
        await act(() =>
            tree.root
                .findByProps({ isLeftIconShadow: true })
                .props.onLeftBtnPress()
        );
        expect(mockGoBack).toBeCalled();
    });

    it('applies styles correctly', async () => {
        expect(
            tree.root.findByProps({ testID: 'container' }).props.style
        ).toStrictEqual({
            flex: 1,
            backgroundColor: '#F5F5F5'
        });
        expect(
            tree.root.findByProps({ testID: 'safeAreaContainer' }).props.style
        ).toStrictEqual({
            flex: 1,
            position: 'relative'
        });
        expect(
            tree.root.findByProps({ isLeftIconShadow: true }).props.styles
        ).toStrictEqual({
            backgroundColor: '#FFFFFF'
        });
        expect(
            tree.root.findByProps({ testID: 'webviewContainer' }).props.style
        ).toStrictEqual({
            flex: 1
        });
        expect(
            tree.root.findByProps({ testID: 'webView' }).props.style
        ).toStrictEqual({
            flex: 1
        });
        expect(
            tree.root.findByProps({ testID: 'loading' }).props.style
        ).toStrictEqual({
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 10,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center'
        });
    });
});
