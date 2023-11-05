import React, { FunctionComponent } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import wolfThingPng from '@/assets/images/wolfThinfPng.png';
import wolfDance from '@/assets/svg/wolfdance.svg';
import wolfNote from '@/assets/svg/wolfNote.svg';
import { Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Props = {
    index: number;
};

const Slide: FunctionComponent<Props> = ({ index }: Props) => {
    return (
        <View style={styles.slide}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    {index === 0 && <SvgXml xml={wolfNote} />}
                    {index === 1 && <Image source={wolfThingPng} />}
                    {index === 2 && <SvgXml xml={wolfDance} />}
                </View>
                {index === 0 && (
                    <>
                        <Text
                            style={styles.title}
                            size={Size.XLarge}
                            fontWeight="bold"
                            color={Colors.text.black_gray}
                        >
                            Create and track your daily habits
                        </Text>
                        <Text
                            style={styles.text}
                            size={Size.XSmall}
                            color={Colors.text.black}
                            fontWeight="400"
                        >
                            Build new habits and keep track of them every day.
                            Share them with your coach to stay on track with
                            your goals
                        </Text>
                    </>
                )}
                {index === 1 && (
                    <>
                        <Text
                            style={styles.titleSecond}
                            size={Size.XLarge}
                            fontWeight="bold"
                            color={Colors.text.black_gray}
                        >
                            Chat with your coach to stay accountable
                        </Text>
                        <Text
                            style={styles.text}
                            size={Size.XSmall}
                            color={Colors.text.black}
                            fontWeight="400"
                        >
                            Communicate with your coach frequently to share your
                            experience and ask questions in real-time
                        </Text>
                    </>
                )}
                {index === 2 && (
                    <>
                        <Text
                            style={styles.title}
                            size={Size.XLarge}
                            testID="titleTextSlide2"
                            fontWeight="bold"
                            color={Colors.text.black_gray}
                        >
                            Learn powerful tips to transform your health
                        </Text>
                        <Text
                            style={styles.text}
                            size={Size.XSmall}
                            color={Colors.text.black}
                            fontWeight="400"
                        >
                            Discover simple and powerful insights that can
                            positively impact your metabolic health
                        </Text>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        marginTop: -400,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        position: 'absolute',
        alignSelf: 'center',
        width: '80%',
        top: '43%'
    },
    iconContainer: {
        alignItems: 'center'
    },
    title: {
        textAlign: 'center',
        textShadowColor: 'rgba(255, 255, 255, 0.7)',
        textShadowRadius: 6,
        marginBottom: 16
    },
    titleSecond: {
        marginTop: 23,
        textAlign: 'center',
        textShadowColor: 'rgba(255, 255, 255, 0.7)',
        textShadowRadius: 6,
        marginBottom: 16
    },
    text: {
        textAlign: 'center',
        textShadowColor: 'rgba(255, 255, 255, 0.7)',
        textShadowRadius: 6,
        paddingBottom: 30
    }
});

export default Slide;
