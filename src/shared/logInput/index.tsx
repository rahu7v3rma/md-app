import React, { FunctionComponent } from 'react';
import {
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

import Text, { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    fieldName: string;
    value: string;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    rightIcon?: any;
};

const LogInput: FunctionComponent<Props> = ({
    fieldName,
    value,
    style,
    onPress,
    rightIcon: RightIcon
}: Props) => {
    return (
        <TouchableOpacity
            testID="logInputContainer"
            style={[styles.container, style]}
            onPress={onPress}
        >
            <Text
                testID="fieldNameTxt"
                size={Size.XXSmall}
                fontWeight="500"
                color={Colors.text.gray_Base}
                style={styles.titleText}
            >
                {fieldName}
            </Text>
            <View style={styles.valueButton}>
                <Text
                    testID="valueTxt"
                    size={Size.XXSmall}
                    fontWeight="600"
                    color={Colors.text.black}
                    style={styles.valueText}
                >
                    {value}
                </Text>
                {RightIcon && (
                    <View style={styles.rightIcon}>
                        <RightIcon width={15} height={10} />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default LogInput;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.extras.white,
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 16,
        shadowColor: Colors.theme.app_sheet_background_color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 5,
        marginVertical: 8
    },
    valueText: {
        flex: 1,
        textAlign: 'right',
        lineHeight: 20,
        paddingRight: 10
    },
    titleText: {
        flex: 1,
        lineHeight: 20
    },
    valueButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12
    },
    styleIcon: {
        height: 20,
        width: 25
    }
});
