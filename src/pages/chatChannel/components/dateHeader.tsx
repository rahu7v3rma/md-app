import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    dateString?: string;
};

const DateHeader: FunctionComponent<Props> = ({ dateString }: Props) => {
    return (
        <View style={styles.dateHeader}>
            <Text
                size={Size.XXXSmall}
                fontWeight="600"
                color={Colors.text.text_gray_black}
            >
                {dateString}
            </Text>
        </View>
    );
};

export default DateHeader;

const styles = StyleSheet.create({
    dateHeader: {
        paddingHorizontal: 16,
        backgroundColor: Colors.extras.white,
        borderRadius: 12,
        borderStyle: 'solid',
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 5,
        lineHeight: 18
    }
});
