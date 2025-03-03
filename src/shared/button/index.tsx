import React, { FunctionComponent } from 'react';
import {
    GestureResponderEvent,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    ViewStyle
} from 'react-native';

import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';

type Props = {
    children?: React.ReactNode;
    primary?: boolean;
    bordered?: boolean;
    rounded?: boolean;
    block?: boolean;
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    onPress?: (e: GestureResponderEvent) => void;
    testID?: string;
};

const Button: FunctionComponent<Props> = ({
    children,
    primary = false,
    bordered = true,
    rounded,
    block,
    style,
    disabled,
    onPress,
    testID
}: Props) => {
    return (
        <TouchableOpacity
            testID={testID}
            style={[
                buttonStyle.wrapper,
                bordered && buttonStyle.bordered,
                primary && buttonStyle.primary,
                disabled && buttonStyle.disabled,
                rounded && buttonStyle.rounded,
                block && buttonStyle.block,
                style
            ]}
            disabled={disabled}
            activeOpacity={disabled ? 1 : 0.75}
            onPress={onPress}
        >
            {children}
        </TouchableOpacity>
    );
};

export default Button;

const buttonStyle = StyleSheet.create({
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15.5,
        paddingVertical: COMMON.isIos ? 24 : 17.5,
        borderRadius: 20,
        margin: 0
    },
    bordered: {
        borderWidth: 1,
        borderBottomWidth: 5,
        borderColor: Colors.theme.primary
    },
    primary: {
        backgroundColor: Colors.theme.primary,
        borderColor: Colors.theme.primary
    },
    disabled: {
        backgroundColor: Colors.button.app_button_disabled_bg,
        borderColor: Colors.button.app_button_disabled_border
    },
    rounded: {
        borderRadius: 100,
        backgroundColor: Colors.button.app_btn_light_color
    },
    block: {
        width: '100%'
    }
});
