import React from 'react';
import renderer, { act } from 'react-test-renderer';

import Form from '../Form';
import FormInput from '../FormInput';

jest.mock('@/assets/svgs', () => {
    const EyeIcon = () => <svg>EyeIcon</svg>;
    const EyeOpenIcon = () => <svg>EyeOpenIcon</svg>;
    return { EyeIcon, EyeOpenIcon };
});

describe('FormInput Component', () => {
    it('renders correctly with a placeholder', () => {
        const component = renderer.create(
            <FormInput placeholder="Test Placeholder" />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('toggles input visibility on icon press', () => {
        const component = renderer.create(
            <FormInput placeholder="Test Placeholder" />
        );
        let tree = component.toJSON();

        const input = tree.children.find((node) => node.type === 'Input');

        if (input) {
            const icon = input.children.find((node) => node.type === 'svg');

            if (icon) {
                const iconPress = icon.props.iconPress;
                iconPress();

                tree = component.toJSON();
                expect(tree).toMatchSnapshot();

                iconPress();
                tree = component.toJSON();
                expect(tree).toMatchSnapshot();
            }
        }
    });

    it('calls the onChangeText function when input changes', () => {
        const onChangeText = jest.fn();
        const component = renderer.create(
            <FormInput
                placeholder="Test Placeholder"
                onChangeText={onChangeText}
            />
        );
        let tree = component.toJSON();

        const input = tree.children.find((node) => node.type === 'Input');

        if (input) {
            const onChangeTextFunction = input.props.onChangeText;

            if (typeof onChangeTextFunction === 'function') {
                onChangeTextFunction('Test Text');
                expect(onChangeText).toHaveBeenCalledWith('Test Text');
            }
        }
    });

    it('calls the onBlur function when input loses focus', () => {
        const onBlur = jest.fn();
        const component = renderer.create(
            <FormInput placeholder="Test Placeholder" onBlur={onBlur} />
        );
        let tree = component.toJSON();

        // Find the input element
        const input = tree.children.find((node) => node.type === 'Input');

        if (input) {
            const onBlurFunction = input.props.onBlur;

            if (typeof onBlurFunction === 'function') {
                onBlurFunction();
                expect(onBlur).toHaveBeenCalled();
            }
        }
    });

    it('displays an error message when showError is true', () => {
        const component = renderer.create(
            <FormInput
                placeholder="Test Placeholder"
                showError={true}
                errorMessage="Test Error"
            />
        );
        const tree = component.toJSON();

        expect(tree).toMatchSnapshot();
    });
});

describe('Form Component', () => {
    it('renders correctly with all input fields', async () => {
        const tree = renderer.create(<Form onUpdatePasswordState={() => {}} />);
        expect(tree.root).toBeTruthy();
    });

    it('updates password state when input fields change', async () => {
        const onUpdatePasswordState = jest.fn();
        const tree = renderer.create(
            <Form onUpdatePasswordState={onUpdatePasswordState} />
        );
        const textInput = tree.root.findByProps({
            placeholder: 'Enter old password*'
        }).props;
        await act(() => textInput.onChangeText('pass'));
        expect(onUpdatePasswordState).toHaveBeenCalledWith({
            confirmPass: '',
            newPass: '',
            oldPass: 'pass'
        });
        const newPass = tree.root.findByProps({
            placeholder: 'Set up new password*'
        }).props;
        await act(() => newPass.onChangeText('new pass'));
        expect(onUpdatePasswordState).toHaveBeenCalledWith({
            confirmPass: '',
            newPass: 'new pass',
            oldPass: 'pass'
        });
        const newCnfPass = tree.root.findByProps({
            placeholder: 'Repeat password*'
        }).props;
        await act(() => newCnfPass.onChangeText('new cnf pass'));
        expect(onUpdatePasswordState).toHaveBeenCalledWith({
            confirmPass: 'new cnf pass',
            newPass: 'new pass',
            oldPass: 'pass'
        });
    });

    it('displays error message when new password and confirm password do not match', async () => {
        const onUpdatePasswordState = jest.fn();
        const tree = renderer.create(
            <Form onUpdatePasswordState={onUpdatePasswordState} />
        );
        const textInput = tree.root.findByProps({
            placeholder: 'Enter old password*'
        }).props;
        await act(() => textInput.onChangeText('pass'));
        expect(onUpdatePasswordState).toHaveBeenCalledWith({
            confirmPass: '',
            newPass: '',
            oldPass: 'pass'
        });
        const newPass = tree.root.findByProps({
            placeholder: 'Set up new password*'
        }).props;
        await act(() => newPass.onChangeText('new pass'));
        expect(onUpdatePasswordState).toHaveBeenCalledWith({
            confirmPass: '',
            newPass: 'new pass',
            oldPass: 'pass'
        });
        const newCnfPass = tree.root.findByProps({
            placeholder: 'Repeat password*'
        }).props;
        await act(() => newCnfPass.onChangeText('new cnf pass'));
        expect(onUpdatePasswordState).toHaveBeenCalledWith({
            confirmPass: 'new cnf pass',
            newPass: 'new pass',
            oldPass: 'pass'
        });
        await act(() => newCnfPass.onBlur());
        const newCnfPassUpdate = tree.root.findByProps({
            placeholder: 'Repeat password*'
        }).props;
        expect(newCnfPassUpdate.showError).toBe(true);
        expect(newCnfPassUpdate.errorMessage).toBe('Password does not match');
    });

    it('clears error message when new password and confirm password match', async () => {
        const onUpdatePasswordState = jest.fn();
        const tree = renderer.create(
            <Form onUpdatePasswordState={onUpdatePasswordState} />
        );
        const textInput = tree.root.findByProps({
            placeholder: 'Enter old password*'
        }).props;
        await act(() => textInput.onChangeText('pass'));
        expect(onUpdatePasswordState).toHaveBeenCalledWith({
            confirmPass: '',
            newPass: '',
            oldPass: 'pass'
        });
        const newPass = tree.root.findByProps({
            placeholder: 'Set up new password*'
        }).props;
        await act(() => newPass.onChangeText('new pass'));
        expect(onUpdatePasswordState).toHaveBeenCalledWith({
            confirmPass: '',
            newPass: 'new pass',
            oldPass: 'pass'
        });
        const newCnfPass = tree.root.findByProps({
            placeholder: 'Repeat password*'
        }).props;
        await act(() => newCnfPass.onChangeText('new pass'));
        expect(onUpdatePasswordState).toHaveBeenCalledWith({
            confirmPass: 'new pass',
            newPass: 'new pass',
            oldPass: 'pass'
        });
        const newCnfPassUpdate = tree.root.findByProps({
            placeholder: 'Repeat password*'
        }).props;
        expect(newCnfPassUpdate.showError).toBe(false);
        expect(newCnfPassUpdate.errorMessage).toBe('');
    });

    it('calls the onBlur function when confirming password field loses focus', async () => {
        const onUpdatePasswordState = jest.fn();
        const tree = renderer.create(
            <Form onUpdatePasswordState={onUpdatePasswordState} />
        );
        const newPass = tree.root.findByProps({
            placeholder: 'Set up new password*'
        }).props;
        await act(() => newPass.onChangeText('new pass'));
        expect(onUpdatePasswordState).toHaveBeenCalledWith({
            confirmPass: '',
            newPass: 'new pass',
            oldPass: ''
        });
        const newCnfPass = tree.root.findByProps({
            placeholder: 'Repeat password*'
        }).props;
        await act(() => newCnfPass.onChangeText('new pass'));
        expect(onUpdatePasswordState).toHaveBeenCalledWith({
            confirmPass: 'new pass',
            newPass: 'new pass',
            oldPass: ''
        });
        expect(newCnfPass.showError).toBe(false);

        // on blur we are checking validation so put assertation of error before it
        await act(() => newCnfPass.onBlur());
        const newCnfPassUpdate = tree.root.findByProps({
            placeholder: 'Repeat password*'
        }).props;
        expect(newCnfPassUpdate.showError).toBe(true);
        expect(newCnfPassUpdate.errorMessage).toBe('Password does not match');
    });
});
