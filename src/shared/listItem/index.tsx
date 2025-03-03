import React, { FunctionComponent } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import Arrow from '@/assets/svg/arrow-next.svg';
import { Text } from '@/shared';
import { Colors } from '@/theme/colors';

import { Size } from '../text';

type Props = {
    Icon?: React.FunctionComponent;
    title?: string;
    onPress?: () => void;
};

const ListItem: FunctionComponent<Props> = ({
    Icon,
    title = '',
    onPress
}: Props) => {
    return (
        <TouchableOpacity
            testID="listItemButton"
            style={styles.container}
            onPress={onPress}
        >
            <View style={styles.icon} testID="listItemIcon">
                {Icon && <Icon />}
            </View>
            <View style={styles.title} testID="listItemTitleContainer">
                <Text
                    testID="listItemTitle"
                    size={Size.XXSmall}
                    fontWeight="600"
                    color={Colors.text.black}
                >
                    {title}
                </Text>
            </View>
            <View style={styles.arrow} testID="listItemArrow">
                <SvgXml xml={Arrow} />
            </View>
        </TouchableOpacity>
    );
};

export default ListItem;

const styles = StyleSheet.create({
    container: {
        height: 56,
        backgroundColor: Colors.extras.white,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 16
    },
    icon: {
        width: '15%',
        alignItems: 'center'
    },
    title: {
        width: '75%'
    },
    arrow: {
        width: '10%'
    }
});
