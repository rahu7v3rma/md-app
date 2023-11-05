import React from 'react';
import renderer, { act } from 'react-test-renderer';

import LogInputDropdown from '@/shared/logInputDropdown';

const mockOpen = jest.fn();
const mockClose = jest.fn();
const mockOnSelect = jest.fn();

let tree;
beforeEach(async () => {
    tree = await act(() =>
        renderer.create(
            <LogInputDropdown
                fieldName="DropDown Test"
                selectedValue={1}
                labelKey="name"
                valueKey="id"
                onSelect={mockOnSelect}
                options={[
                    {
                        id: 1,
                        name: 'choice1'
                    },
                    {
                        id: 2,
                        name: 'choice2'
                    }
                ]}
                onOpen={mockOpen}
                onClose={mockClose}
            />
        )
    );
});

describe('test log input dropdown', () => {
    it('snapshot test', async () => {
        expect(tree).toMatchSnapshot();
    });

    it('renders without crashing', async () => {
        expect(tree.root).toBeTruthy();
    });

    it('dropdown items are initially hidden', async () => {
        expect(tree.root.findAllByProps({ testID: 'choice1' }).length).toEqual(
            0
        );
    });

    it('clicking LogInput opens the dropdown', async () => {
        await act(() => {
            tree.root.findByProps({ value: 'choice1' }).props.onPress();
        });
        expect(
            tree.root.findAllByProps({ testID: 'choice2' }).length
        ).toBeGreaterThan(0);
    });

    it('Clicking a dropdown item triggers onSelect callback', async () => {
        await act(() => {
            tree.root.findByProps({ value: 'choice1' }).props.onPress();
        });
        await act(() => {
            tree.root.findByProps({ testID: 'choice2' }).props.onPress();
        });
        expect(mockOnSelect).toBeCalled();
    });

    it('clicking outside the dropdown closes it', async () => {
        await act(() => {
            tree.root.findByProps({ value: 'choice1' }).props.onPress();
        });
        await act(() =>
            tree.root
                .findByProps({ hardwareAccelerated: false })
                .props.onRequestClose()
        );
        await act(() => {
            tree.root.findByProps({ value: 'choice1' }).props.onPress();
        });
        expect(mockClose).toBeCalled();
    });

    it('initializes with correct initial state', async () => {
        await act(() => {
            tree.root.findByProps({ value: 'choice1' }).props.onPress();
        });
        expect(
            tree.root.findByProps({ testID: 'valueTxt' }).props.children
        ).toEqual('choice1');
    });

    it('display the correct icon', async () => {
        await act(() => {
            tree.root.findByProps({ value: 'choice1' }).props.onPress();
        });
        expect(
            tree.root.findAllByProps({ testID: 'icon1' }).length
        ).toBeGreaterThan(0);
    });

    it('displays the selected option correctly', async () => {
        await act(() => {
            tree.root.findByProps({ value: 'choice1' }).props.onPress();
        });
        await act(() => {
            tree.root.findByProps({ testID: 'choice2' }).props.onPress();
        });
        expect(mockOnSelect).toBeCalledWith({ id: 2, name: 'choice2' });
    });

    it('handles empty options array', async () => {
        await act(() => {
            tree.update(
                <LogInputDropdown
                    fieldName="DropDown Test"
                    selectedValue={1}
                    labelKey="name"
                    valueKey="id"
                    onSelect={mockOnSelect}
                    options={[]}
                    onOpen={mockOpen}
                    onClose={mockClose}
                />
            );
        });
        await act(() => {
            tree.root
                .findByProps({ testID: 'logInputContainer' })
                .props.onPress();
        });
        expect(tree.root).toBeTruthy();
    });

    it('handles missing onSelect callback', async () => {
        <LogInputDropdown
            fieldName="DropDown Test"
            selectedValue={1}
            labelKey="name"
            valueKey="id"
            options={[
                {
                    id: 1,
                    name: 'choice1'
                },
                {
                    id: 2,
                    name: 'choice2'
                }
            ]}
            onOpen={mockOpen}
            mockClose={mockClose}
        />;
        await act(() => {
            tree.root
                .findByProps({ testID: 'logInputContainer' })
                .props.onPress();
        });
        await act(() => {
            tree.root.findByProps({ testID: 'choice2' }).props.onPress();
        });
        await act(() => {
            tree.root.findByProps({ testID: 'choice1' }).props.onPress();
        });
        expect(mockClose).toBeCalledTimes(3);
    });
});
