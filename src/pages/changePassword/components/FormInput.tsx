import React, { FunctionComponent, useState } from 'react';

import { EyeIcon, EyeOpenIcon } from '@/assets/svgs';
import { Input } from '@/shared';

import { changePasswordStyles } from '../style';

type Props = {
    placeholder?: string;
    errorMessage?: string;
    showError?: boolean;
    onChangeText?: (text: string) => void;
    onBlur?: () => void;
};

const FormInput: FunctionComponent<Props> = ({
    placeholder,
    errorMessage,
    showError = false,
    onChangeText,
    onBlur
}: Props) => {
    const [secureTextEntry, setTextSecureEntry] = useState(true);

    const handleTextSecureEntry = () => {
        setTextSecureEntry(!secureTextEntry);
    };

    return (
        <Input
            placeholder={placeholder}
            style={changePasswordStyles.input}
            secureTextEntry={secureTextEntry}
            onChangeText={onChangeText}
            Icon={secureTextEntry ? EyeIcon : EyeOpenIcon}
            errorMessage={errorMessage}
            required
            showError={showError}
            iconPress={handleTextSecureEntry}
            onBlur={onBlur}
            textInputStyle={changePasswordStyles.textInput}
        />
    );
};

export default FormInput;
