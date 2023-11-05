import React from 'react';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import { mockGoBack, mockReplace } from '@/jestSetup';
import LogMenu from '@/navigation/logMenu';
import store from '@/store';

describe('logMenu', () => {
    let tree;
    beforeEach(() => {
        tree = renderer.create(
            <Provider store={store}>
                <LogMenu />
            </Provider>
        );
    });

    it('log menu snapshot', () => {
        expect(tree).toMatchSnapshot();
    });

    it('logMenu should be close on press cross icon', async () => {
        const imagePickerButton = tree.root.findByProps({
            testID: 'closeButton'
        });
        await act(() => imagePickerButton.props.onPress());
        expect(mockGoBack).toHaveBeenCalledTimes(1);
    });

    it('clicking on Fasting timer should redirect to trackFast page', async () => {
        const imagePickerButton = tree.root.findByProps({
            title: 'Fasting Timer'
        });
        await act(() => imagePickerButton.props.onTabPress());
        expect(mockReplace).toHaveBeenCalledWith('TrackFast');
    });
});
