import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import { Switch, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    text: string;
    toggled: boolean;
    onPressToggle: () => void;
};

const SettingOption: FunctionComponent<Props> = ({
    text,
    toggled,
    onPressToggle
}: Props) => {
    return (
        <View style={styles.wrapper}>
            <Text
                size={Size.XXSmall}
                fontWeight="600"
                color={Colors.text.darker}
            >
                {text}
            </Text>
            <Switch toggled={toggled} onPress={onPressToggle} />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        backgroundColor: Colors.extras.white,
        borderRadius: 16,
        paddingHorizontal: 20,
        marginBottom: 16
    }
});

export default SettingOption;
