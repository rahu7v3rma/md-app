import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import React, { FunctionComponent, useCallback } from 'react';
import { BackHandler, Linking, StyleSheet, View } from 'react-native';

import { NoData } from '@/assets/svgs';
import { RootStackParamList } from '@/navigation';
import { Button, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = Record<string, never>;

type CriticalUpdateRouteProp = RouteProp<RootStackParamList, 'CriticalUpdate'>;

const CriticalUpdate: FunctionComponent<Props> = ({}: Props) => {
    const route = useRoute<CriticalUpdateRouteProp>();

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                BackHandler.exitApp();

                // return true to indicate this event was handled
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener(
                    'hardwareBackPress',
                    onBackPress
                );
        }, [])
    );

    return (
        <View style={styles.container}>
            <NoData width={141} height={201} />
            <Text
                color={Colors.text.black_gray}
                size={Size.Small}
                fontWeight={'400'}
                style={styles.text}
            >
                {
                    'A critical update is available!\nPlease update your app before you can continue using it'
                }
            </Text>
            <Button
                primary
                block
                bordered={false}
                style={styles.btn}
                onPress={() => {
                    Linking.openURL(route.params.linkUrl);
                }}
            >
                <Text
                    size={Size.XXSmall}
                    fontWeight="600"
                    color={Colors.text.white}
                >
                    Update now
                </Text>
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    btn: {
        width: '90%',
        marginTop: 30
    },
    text: {
        marginHorizontal: 20,
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 20
    },
    image: {
        height: 200,
        width: 150
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default CriticalUpdate;
