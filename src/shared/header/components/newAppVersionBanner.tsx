import React, { FunctionComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import Button from '@/shared/button';
import Text, { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    onAppUpdate: () => void;
};

const NewAppVersionBanner: FunctionComponent<Props> = ({ onAppUpdate }) => {
    return (
        <View style={style.containerStyle}>
            <Button
                style={style.buttonStyle}
                bordered={false}
                onPress={onAppUpdate}
            >
                <Text size={Size.XXXSmall} color={Colors.text.white}>
                    A new version is available! Press here to update
                </Text>
            </Button>
        </View>
    );
};

export default NewAppVersionBanner;

const style = StyleSheet.create({
    containerStyle: {
        backgroundColor: '#831100'
    },
    buttonStyle: { paddingVertical: 2 }
});
