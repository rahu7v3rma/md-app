import React, { FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { CheckIcon } from '@/assets/svgs';
import { Colors } from '@/theme/colors';

type Props = {
    checked: boolean;
    onChange: (value: boolean) => void;
};

const Checkbox: FunctionComponent<Props> = ({ checked, onChange }: Props) => {
    return (
        <TouchableOpacity
            style={[checkboxStyle.wrapper, checked && checkboxStyle.checked]}
            activeOpacity={0.8}
            onPress={() => onChange(!checked)}
        >
            {checked && (
                <CheckIcon color={Colors.extras.white} width={18} height={18} />
            )}
        </TouchableOpacity>
    );
};

export default Checkbox;

const checkboxStyle = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.text.white,
        borderWidth: 1.5,
        borderColor: Colors.button.app_button_disabled_border,
        width: 28,
        height: 28,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center'
    },
    checked: {
        backgroundColor: Colors.text.green,
        borderWidth: 0
    }
});
