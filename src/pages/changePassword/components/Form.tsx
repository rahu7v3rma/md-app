import React, { FunctionComponent, useCallback, useState } from 'react';
import { View } from 'react-native';

import { changePasswordStyles } from '../style';

import FormInput from './FormInput';

interface IPasswordState {
    oldPass: string;
    newPass: string;
    confirmPass: string;
}

type Props = {
    onUpdatePasswordState: (passwordState: IPasswordState) => void;
};

const Form: FunctionComponent<Props> = ({ onUpdatePasswordState }: Props) => {
    const [passwordState, setPasswordState] = useState<IPasswordState>({
        oldPass: '',
        newPass: '',
        confirmPass: ''
    });
    const [verifyPassError, setVerifiedPassError] = useState('');

    const updatePassword = useCallback(
        (value: string, key: string) => {
            setPasswordState({
                ...passwordState,
                [key]: value
            });

            // validate that new and confirm passes match if one of them was changed
            if (['newPass', 'confirmPass'].indexOf(key) !== -1) {
                if (
                    (key === 'newPass' &&
                        value !== passwordState.confirmPass) ||
                    (key === 'confirmPass' && value !== passwordState.newPass)
                ) {
                    if (
                        key === 'newPass' &&
                        value !== passwordState.confirmPass &&
                        passwordState.confirmPass !== ''
                    ) {
                        setVerifiedPassError('Password does not match');
                    }
                } else {
                    setVerifiedPassError('');
                }
            }
            onUpdatePasswordState({
                ...passwordState,
                [key]: value
            });
        },
        [passwordState, onUpdatePasswordState]
    );

    const checkValidation = useCallback(
        (value: string, key: string) => {
            if (['newPass', 'confirmPass'].indexOf(key) !== -1) {
                if (
                    (key === 'newPass' &&
                        value !== passwordState.confirmPass) ||
                    (key === 'confirmPass' && value !== passwordState.newPass)
                ) {
                    setVerifiedPassError('Password does not match');
                } else {
                    setVerifiedPassError('');
                }
            }
        },
        [passwordState]
    );

    return (
        <View style={changePasswordStyles.inputContainer}>
            <FormInput
                placeholder="Enter old password*"
                errorMessage="*Required"
                onChangeText={(txt) => updatePassword(txt, 'oldPass')}
            />
            <FormInput
                placeholder="Set up new password*"
                errorMessage={
                    passwordState.newPass === '' ? '*Required' : verifyPassError
                }
                showError={verifyPassError !== ''}
                onChangeText={(txt) => updatePassword(txt, 'newPass')}
            />
            <FormInput
                placeholder="Repeat password*"
                errorMessage={
                    passwordState.confirmPass === ''
                        ? '*Required'
                        : verifyPassError
                }
                onBlur={() =>
                    checkValidation(passwordState.confirmPass, 'confirmPass')
                }
                onChangeText={(txt) => updatePassword(txt, 'confirmPass')}
                showError={verifyPassError !== ''}
            />
        </View>
    );
};

export default Form;
