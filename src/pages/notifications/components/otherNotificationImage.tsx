import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import { BellIcon } from '@/assets/svgs';
import { Colors } from '@/theme/colors';

type Props = Record<string, never>;

const OtherNotificationImage: FunctionComponent<Props> = ({}: Props) => {
    return (
        <View style={styles.root}>
            <BellIcon />
        </View>
    );
};

export default OtherNotificationImage;

const styles = StyleSheet.create({
    root: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.extras.white,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
