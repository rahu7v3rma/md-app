import React, { FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { CheckIcon } from '@/assets/svgs';
import Text, { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { LayoutContants } from '@/theme/layoutContants';

type Props = {
    icon: any;
    title: string;
    active?: boolean;
    onTabPress?: () => void;
    style?: any;
    textStyle?: any;
};

const LogTab: FunctionComponent<Props> = ({
    icon,
    title,
    active = false,
    onTabPress,
    style = {},
    textStyle = {}
}: Props) => {
    return (
        <TouchableOpacity
            onPress={onTabPress}
            style={[
                styles.wrapper,
                {
                    borderColor: active
                        ? Colors.theme.primary
                        : Colors.extras.white
                },
                style
            ]}
            testID="logTab"
        >
            <View style={styles.iconView}>
                <SvgXml xml={icon} testID="logTabIcon" />
            </View>
            <View style={textStyle} testID="logTabTitleContainer">
                <Text
                    size={Size.XXSmall}
                    color={Colors.theme.primary}
                    fontWeight="600"
                    style={styles.title}
                    testID="logTabTitle"
                >
                    {title}
                </Text>
            </View>
            {active && (
                <View style={styles.successIcon}>
                    <CheckIcon
                        width={18}
                        height={18}
                        color={Colors.extras.white}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

export default LogTab;

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: LayoutContants.cardHeight,
        width: '44%',
        borderWidth: 1.5,
        backgroundColor: Colors.extras.white,
        borderRadius: 20,
        shadowColor: Colors.theme.app_sheet_background_color,
        elevation: 3
    },
    iconView: {
        alignItems: 'center',
        marginHorizontal: 16
    },
    title: {
        width: '95%',
        flexWrap: 'wrap'
    },
    successIcon: {
        height: 21,
        width: 21,
        borderRadius: 9,
        position: 'absolute',
        right: 8,
        top: 6,
        backgroundColor: Colors.theme.primary,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
