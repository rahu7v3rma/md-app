import React from 'react';
import 'react-native';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import { clearSearchText, searchFilterAction } from '@/reducers/user';
import store from '@/store';

import ChatSearchHeader from '../chatSearchHeader';

describe('<ChatSearchHeader />', () => {
    const testValue = 'some text';

    it('should render the header with a back button and search input', async () => {
        const tree = renderer.create(<ChatSearchHeader />);
        const backButton = tree.root.findByProps({
            testID: 'backButtonTestId'
        }).props;
        const searchInput = tree.root.findByProps({
            testID: 'searchInputTestId'
        }).props;

        expect(backButton).toBeTruthy();
        expect(searchInput).toBeTruthy();
    });

    it('should clear the search input and dispatch clearSearchText when the clear button is pressed', async () => {
        const tree = renderer.create(
            <Provider store={store}>
                <ChatSearchHeader />
            </Provider>
        );

        await act(() => {
            const searchInput = tree.root.findByProps({
                testID: 'searchInputTestId'
            }).props;
            searchInput.onChangeText(testValue);
        });

        let searchInput = tree.root.findByProps({
            testID: 'searchInputTestId'
        }).props;

        expect(searchInput.value).toBe(testValue);

        searchInput = tree.root.findByProps({
            testID: 'searchInputTestId'
        });
        searchInput.instance.clear = () => {
            searchInput.props.onChangeText('');
        };
        const clearButton = tree.root.findByProps({
            testID: 'clearButtonTestId'
        }).props;

        await act(() => {
            clearButton.onPress();
        });

        searchInput = tree.root.findByProps({
            testID: 'searchInputTestId'
        }).props;

        expect(clearSearchText).toBeCalledTimes(1);
        expect(searchInput.value).toBe('');
    });

    it('should display the clear button when text is entered and hide it when text is cleared', async () => {
        const tree = renderer.create(
            <Provider store={store}>
                <ChatSearchHeader />
            </Provider>
        );

        let clearButton = tree.root.findByProps({
            testID: 'clearButtonTestId'
        }).props;

        expect(clearButton.style[1].opacity).toBe(0);

        await act(() => {
            const searchInput = tree.root.findByProps({
                testID: 'searchInputTestId'
            }).props;
            searchInput.onChangeText(testValue);
        });

        let searchInput = tree.root.findByProps({
            testID: 'searchInputTestId'
        }).props;

        clearButton = tree.root.findByProps({
            testID: 'clearButtonTestId'
        }).props;

        expect(searchInput.value).toBe(testValue);
        expect(clearButton.style[1].opacity).toBe(1);

        searchInput = tree.root.findByProps({
            testID: 'searchInputTestId'
        });
        searchInput.instance.clear = () => {
            searchInput.props.onChangeText('');
        };

        await act(() => {
            clearButton.onPress();
        });

        clearButton = tree.root.findByProps({
            testID: 'clearButtonTestId'
        }).props;
        searchInput = tree.root.findByProps({
            testID: 'searchInputTestId'
        }).props;

        expect(clearButton.style[1].opacity).toBe(0);
        expect(clearSearchText).toBeCalledTimes(1);
        expect(searchInput.value).toBe('');
    });

    it('should dispatch searchFilterAction when text is entered in the search input', async () => {
        const tree = renderer.create(
            <Provider store={store}>
                <ChatSearchHeader />
            </Provider>
        );

        await act(() => {
            const searchInput = tree.root.findByProps({
                testID: 'searchInputTestId'
            }).props;
            searchInput.onChangeText(testValue);
        });
        const searchInput = tree.root.findByProps({
            testID: 'searchInputTestId'
        }).props;

        expect(searchInput.value).toBe(testValue);
        expect(searchFilterAction).toBeCalledTimes(1);
    });

    it('should call the onBack function when the back button is pressed', async () => {
        const mockOnBack = jest.fn();
        const tree = renderer.create(<ChatSearchHeader onBack={mockOnBack} />);
        const backButton = tree.root.findByProps({
            testID: 'backButtonTestId'
        }).props;

        await act(() => {
            backButton.onPress();
        });

        expect(mockOnBack).toBeCalledTimes(1);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});
