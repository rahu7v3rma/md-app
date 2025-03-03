import React from 'react';
import { View } from 'react-native';

import { Checkbox, Text } from '@/shared';
import { Colors } from '@/theme/colors';

import { signupStyle } from '../style';

const TermsAndCondition = () => {
    const [checked, setChecked] = React.useState<boolean>(false);

    return (
        <View style={signupStyle.termsAndConditionsContainer}>
            <Checkbox
                checked={checked}
                onChange={(value) => {
                    setChecked(value);
                }}
            />
            <Text style={signupStyle.termsAndConditions} fontWeight="400">
                By signing up you confirm you agree to our{' '}
                <Text
                    style={signupStyle.termsAndConditionBtnTxt}
                    color={Colors.text.green}
                    fontWeight="600"
                >
                    Terms of Service
                </Text>{' '}
                and{' '}
                <Text
                    style={signupStyle.termsAndConditionBtnTxt}
                    color={Colors.text.green}
                    fontWeight="600"
                >
                    Privacy Policy
                </Text>
            </Text>
        </View>
    );
};

export default TermsAndCondition;
