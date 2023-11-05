import { configureStore, createSlice } from '@reduxjs/toolkit';
import React from 'react';
import { Text } from 'react-native';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import { mockNavigate } from '@/jestSetup';
import ChangePassword from '@/pages/changePassword';

describe('changePassword', () => {
    let tree;
    beforeEach(() => {
        tree = renderer.create(
            <Provider
                store={configureStore({
                    reducer: createSlice({ name: 'mock' }).reducer
                })}
            >
                <ChangePassword />
            </Provider>
        );
    });

    it('snapshot', () => {
        expect(tree).toMatchSnapshot();
    });

    it('empty fields', async () => {
        await act(() =>
            tree.root
                .findByProps({
                    placeholder: 'Enter old password*'
                })
                .props.onChangeText('oldPassword')
        );

        expect(
            tree.root.findByProps({
                testID: 'changePasswordButton'
            }).props.disabled
        ).toBe(true);

        await act(() =>
            tree.root
                .findByProps({
                    placeholder: 'Set up new password*'
                })
                .props.onChangeText('newPassword')
        );

        expect(
            tree.root.findByProps({
                testID: 'changePasswordButton'
            }).props.disabled
        ).toBe(true);

        await act(() =>
            tree.root
                .findByProps({
                    placeholder: 'Repeat password*'
                })
                .props.onChangeText('newPassword')
        );

        expect(
            tree.root.findByProps({
                testID: 'changePasswordButton'
            }).props.disabled
        ).toBe(false);
    });

    it('mismatch passwords', async () => {
        await act(() =>
            tree.root
                .findByProps({
                    placeholder: 'Enter old password*'
                })
                .props.onChangeText('oldPassword')
        );

        await act(() =>
            tree.root
                .findByProps({
                    placeholder: 'Set up new password*'
                })
                .props.onChangeText('newPassword')
        );

        await act(() =>
            tree.root
                .findByProps({
                    placeholder: 'Repeat password*'
                })
                .props.onChangeText('mismatchPassword')
        );

        expect(
            tree.root.findByProps({
                testID: 'changePasswordButton'
            }).props.disabled
        ).toBe(true);
    });

    it('submit success', async () => {
        expect(
            tree.root
                .findAllByType(Text)
                .find((x) => x?.props?.testID === 'changePasswordSuccessText')
        ).toBeUndefined();

        await act(
            async () =>
                await tree.root
                    .findByProps({
                        testID: 'changePasswordButton'
                    })
                    .props.onPress()
        );

        expect(
            tree.root
                .findAllByType(Text)
                .find((x) => x?.props?.testID === 'changePasswordSuccessText')
        ).toBeDefined();

        await act(() =>
            tree.root
                .findByProps({
                    testID: 'moveToHomeButton'
                })
                .props.onPress()
        );
        expect(mockNavigate).toBeCalledWith('Main');
    });
});
