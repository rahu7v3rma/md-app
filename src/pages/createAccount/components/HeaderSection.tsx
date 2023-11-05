import React, { useState } from 'react';
import { View } from 'react-native';

import { EyeIcon, EyeOpenIcon, WolfIcon } from '@/assets/svgs';
import { Input, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

import { signupStyle } from '../style';

type Props = {
    onChangeEmail?: (text: string) => void;
    onChangePassword?: (text: string) => void;
};

const HeaderSection = ({ onChangeEmail, onChangePassword }: Props) => {
    const [secureTextEntry, setTextSecureEntry] = useState(true);

    const handleTextSecureEntry = () => {
        setTextSecureEntry(!secureTextEntry);
    };

    return (
        <View style={signupStyle.inputWrapper}>
            <WolfIcon />
            <Text
                style={signupStyle.headerText}
                size={Size.XLarge}
                fontWeight="700"
                color={Colors.text.text_gray_black}
            >
                Create an Account
            </Text>

            <Input
                placeholder="Email*"
                keyboardType="email-address"
                onChangeText={onChangeEmail}
                style={{ backgroundColor: Colors.extras.white }}
            />
            <Input
                placeholder="Password*"
                Icon={secureTextEntry ? EyeIcon : EyeOpenIcon}
                secureTextEntry={secureTextEntry}
                style={signupStyle.passwordInput}
                onChangeText={onChangePassword}
                iconPress={handleTextSecureEntry}
                eyeColor={Colors.icons.eyeGreen}
            />
        </View>
    );
};

export default HeaderSection;
