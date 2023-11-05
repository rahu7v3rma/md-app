import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { mockPop } from '@/jestSetup';
import UnitSettings from '@/pages/unitSettings';

let tree;
beforeEach(async () => {
    tree = await act(() => renderer.create(<UnitSettings />));
});

describe('test unit Settings', () => {
    it('snapshot test', async () => {
        expect(tree).toMatchSnapshot();
    });

    it('renders without crashing', async () => {
        expect(tree.root).toBeTruthy();
    });

    it('navigates back when the back button is pressed', async () => {
        await act(() =>
            tree.root.findByProps({ testID: 'leftButton' }).props.onPress()
        );
        expect(mockPop).toBeCalled();
    });

    it('toggles the selected unit when imperial is pressed', async () => {
        await act(() =>
            tree.root.findByProps({ testID: 'imperial' }).props.onPress()
        );
        expect(
            tree.root.findByProps({ testID: 'imperial' }).props.style[1]
                .backgroundColor
        ).toEqual('#FFFFFF');
        expect(
            tree.root.findByProps({ testID: 'metric' }).props.style[1]
                .backgroundColor
        ).not.toEqual('#FFFFFF');
    });

    it('toggles the selected unit when metric is pressed', async () => {
        await act(() =>
            tree.root.findByProps({ testID: 'imperial' }).props.onPress()
        );
        await act(() =>
            tree.root.findByProps({ testID: 'metric' }).props.onPress()
        );
        expect(
            tree.root.findByProps({ testID: 'metric' }).props.style[1]
                .backgroundColor
        ).toEqual('#FFFFFF');
        expect(
            tree.root.findByProps({ testID: 'imperial' }).props.style[1]
                .backgroundColor
        ).not.toEqual('#FFFFFF');
    });

    it('handles the "Save" button press', async () => {
        await act(() =>
            tree.root.findByProps({ testID: 'save' }).props.onPress()
        );
    });
});
