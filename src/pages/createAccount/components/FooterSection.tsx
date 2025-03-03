import { Link } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';

import { Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

import { signupStyle } from '../style';

const FooterSection = () => {
    return (
        <View style={signupStyle.footerEndContainer}>
            <Text
                style={signupStyle.footerEndTxt}
                size={Size.XXXSmall}
                fontWeight="400"
            >
                Already have account?
            </Text>
            <Link to={{ screen: 'SignIn' }}>
                <Text
                    size={Size.XXXSmall}
                    fontWeight="600"
                    color={Colors.text.green}
                >
                    Login
                </Text>
            </Link>
        </View>
    );
};

export default FooterSection;
