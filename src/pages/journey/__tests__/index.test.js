import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import 'react-native';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import { mockNavigate } from '@/jestSetup';
import Journey from '@/pages/journey';
import store from '@/store';
import { MockData } from '@/utils/mockData';

MockData.journey[1].is_completed = true;

let tree;
describe('Journey', () => {
    beforeAll(async () => {
        await act(async () => {
            tree = renderer.create(
                <NavigationContainer>
                    <Provider store={store}>
                        <Journey />
                    </Provider>
                </NavigationContainer>
            );
        });
    });
    it('snapshot journey', async () => {
        expect(tree).toMatchSnapshot();
    });
    it('user can click on inprogress block then it should redirect to the block page.', async () => {
        const activeBlock = tree.root.findByProps({
            testID: 'block1'
        }).props;
        await act(() => activeBlock.onPress());
        expect(mockNavigate).toHaveBeenCalledWith('Block', expect.anything());
    });
    it('user can click on complete block then it should redirect to the block page.', async () => {
        const activeBlock = tree.root.findByProps({
            testID: 'block0'
        }).props;
        await act(() => activeBlock.onPress());
        expect(mockNavigate).toHaveBeenCalledWith('Block', expect.anything());
    });
    it('user can click on locked block then it should popup with locked block info.', async () => {
        const lockBlockModal = tree.root.findByProps({
            testID: 'lockBlockModal'
        }).props;
        expect(lockBlockModal.visible).toBe(false);
        const activeBlock = tree.root.findByProps({
            testID: 'lockedBlock'
        }).props;
        await act(() => activeBlock.onPress());
        const modalInstanceAfterUpdate = tree.root.findByProps({
            testID: 'lockBlockModal'
        }).props;
        expect(modalInstanceAfterUpdate.visible).toBe(true);
    });
});
