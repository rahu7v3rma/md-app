import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import 'react-native';
import { Provider } from 'react-redux';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';

import { mockNavigate } from '@/jestSetup';
import Onboarding from '@/pages/onboarding';
import store from '@/store';
import { Colors } from '@/theme/colors';

import { Slide } from '../components';

let tree: ReactTestRenderer;
describe('Onboarding', () => {
    beforeAll(async () => {
        await act(() => {
            tree = renderer.create(
                <NavigationContainer>
                    <Provider store={store}>
                        <Onboarding />
                    </Provider>
                </NavigationContainer>
            );
        });
    });
    it('snapshot onboarding', async () => {
        expect(tree).toMatchSnapshot();
    });
    it('renders without crashing.', async () => {
        expect(tree.root).toBeTruthy();
    });
    it('updates active slide when carousel is scrolled.', async () => {
        const pagination = tree.root.findByProps({
            testID: 'pagination'
        }).props;
        expect(pagination.activePage).toBe(0);
        const carosel = tree.root.findByProps({
            testID: 'carosel'
        }).props;
        await act(() => carosel.onProgressChange(1, 1));
        const paginationUpdate = tree.root.findByProps({
            testID: 'pagination'
        }).props;
        expect(paginationUpdate.activePage).toBe(1);
    });
    it('displays correct number of dots in pagination.', async () => {
        const pagination = tree.root.findByProps({
            testID: 'pagination'
        }).props;
        expect(pagination.totalPages).toBe(3);
    });
    it('updates pagination when the active slide changes.', async () => {
        const pagination = tree.root.findByProps({
            testID: 'pagination'
        }).props;
        expect(pagination.activePage).toBe(1);
        const carosel = tree.root.findByProps({
            testID: 'carosel'
        }).props;
        await act(() => carosel.onProgressChange(1, 2));
        const paginationUpdate = tree.root.findByProps({
            testID: 'pagination'
        }).props;
        expect(paginationUpdate.activePage).toBe(2);
        const slideTree = renderer.create(<Slide index={2} />);
        const titleTextSlide2 = slideTree.root.findByProps({
            testID: 'titleTextSlide2'
        }).props;
        expect(titleTextSlide2).toBeTruthy();
    });
    it('scrolls to the next slide when "Next" button is pressed.', async () => {
        const useRefSpy = jest.spyOn(React, 'useRef');
        const carosel = tree.root.findByProps({
            testID: 'carosel'
        }).props;
        await act(() => carosel.onProgressChange(1, 0));
        const paginationUpdate = tree.root.findByProps({
            testID: 'pagination'
        }).props;
        expect(paginationUpdate.activePage).toBe(0);

        const nextButton = tree.root.findByProps({
            testID: 'nextButton'
        }).props;
        await act(() => nextButton.onPress());
        expect(useRefSpy).toHaveBeenCalled();
    });
    it('navigates to "Main" when "Let\'s Start" button is pressed on the last slide.', async () => {
        const carosel = tree.root.findByProps({
            testID: 'carosel'
        }).props;
        await act(() => carosel.onProgressChange(1, 2));
        const paginationUpdate = tree.root.findByProps({
            testID: 'pagination'
        }).props;
        expect(paginationUpdate.activePage).toBe(2);

        const startButton = tree.root.findByProps({
            testID: 'startButton'
        }).props;
        await act(() => startButton.onPress());
        expect(mockNavigate).toHaveBeenCalledWith('Main');
    });
    it('applies styles correctly.', async () => {
        const startButton = tree.root.findByProps({
            testID: 'startButton'
        }).props;
        expect(startButton.style).toStrictEqual({
            width: 300,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.theme.primary,
            paddingHorizontal: 30,
            paddingVertical: 15,
            borderRadius: 10
        });
    });
});
