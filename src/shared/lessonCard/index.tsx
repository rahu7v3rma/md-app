import React, { FunctionComponent, useEffect, useMemo } from 'react';
import {
    Animated,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import check from '@/assets/svg/check.svg';
import lock from '@/assets/svg/lock.svg';
import { ArrowNext } from '@/assets/svgs';
import { CustomCacheImage, Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { LayoutContants } from '@/theme/layoutContants';

type Props = {
    imageUrl?: string;
    label?: string;
    id?: number;
    activeLessonId?: number;
    sublabel?: string;
    progress?: boolean;
    complete?: boolean;
    onPress?: () => void;
    onCompleted?: (completed: boolean) => void;
    time?: string;
    style?: StyleProp<ViewStyle>;
    shouldAnimate?: boolean;
    cardContainerID?: string;
    cardTouchViewID?: string;
};

const LessonCard: FunctionComponent<Props> = ({
    imageUrl,
    activeLessonId,
    label,
    id,
    sublabel,
    progress,
    complete,
    onPress,
    time,
    onCompleted,
    style,
    shouldAnimate = true,
    cardContainerID,
    cardTouchViewID
}) => {
    const animation = useMemo(() => new Animated.Value(0), []);
    const animation2 = useMemo(() => new Animated.Value(0), []);
    const animation3 = useMemo(() => new Animated.Value(0), []);
    const animation4 = useMemo(() => new Animated.Value(0), []);
    const animation5 = useMemo(() => new Animated.Value(0), []);

    const inputRange = [0, 1];
    const outputRange = ['0%', '100%'];

    const animatedWidth = animation.interpolate({ inputRange, outputRange });
    const animatedWidth2 = animation3.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    useEffect(() => {
        if (complete) {
            if (shouldAnimate) {
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: false
                }).start();

                setTimeout(() => {
                    Animated.timing(animation2, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: false
                    }).start();

                    Animated.timing(animation3, {
                        toValue: 1,
                        duration: 200,
                        delay: 200,
                        useNativeDriver: false
                    }).start(() => {
                        Animated.timing(animation4, {
                            toValue: 1,
                            duration: 200,
                            useNativeDriver: false
                        }).start();
                        Animated.timing(animation3, {
                            toValue: 0,
                            duration: 1000,
                            useNativeDriver: false
                        }).start(() => {
                            onCompleted && onCompleted(true);
                        });
                    });
                }, 1500);
            } else {
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 0,
                    useNativeDriver: false
                }).start();

                Animated.timing(animation2, {
                    toValue: 1,
                    duration: 0,
                    useNativeDriver: false
                }).start();

                Animated.timing(animation3, {
                    toValue: 1,
                    duration: 0,
                    delay: 0,
                    useNativeDriver: false
                }).start(() => {
                    Animated.timing(animation4, {
                        toValue: 1,
                        duration: 0,
                        useNativeDriver: false
                    }).start();
                    Animated.timing(animation3, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: false
                    }).start(() => {
                        onCompleted && onCompleted(true);
                    });
                });
            }
        }
    }, [
        animation,
        animation2,
        animation3,
        animation4,
        animation5,
        complete,
        onCompleted,
        shouldAnimate
    ]);

    return (
        <Animated.View
            testID={cardContainerID}
            style={[
                styles().card,
                complete && styles().cardComplete,
                progress && styles().cardInProgress,
                {
                    transform: [{ translateX: animation5 }]
                },
                style
            ]}
        >
            <TouchableOpacity
                style={styles().touchableContainerStyle}
                testID={cardTouchViewID}
                onPress={onPress}
                disabled={!(complete || progress)}
            >
                <Animated.View
                    style={[
                        styles(
                            animatedWidth,
                            complete,
                            animation2,
                            animation4,
                            animatedWidth2
                        ).animatedButtonStyle
                    ]}
                />
                <View style={styles().leftContainer}>
                    <View style={styles().leftImg}>
                        <CustomCacheImage
                            style={styles().image}
                            source={{
                                uri: imageUrl
                            }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles().leftText}>
                        <Text
                            size={Size.XXSmall}
                            fontWeight="700"
                            color={Colors.text.mainDarker}
                            numberOfLines={2}
                        >
                            {label}
                        </Text>
                        <Text
                            size={Size.XXXSmall}
                            style={styles().subheading}
                            color={Colors.text.gray}
                        >
                            {sublabel}
                        </Text>
                    </View>
                </View>

                <View style={styles().progressContainer}>
                    {id !== activeLessonId + 1 ? (
                        <View>
                            {complete ? (
                                <SvgXml xml={check} width={25} height={25} />
                            ) : (
                                <View>
                                    {progress ? (
                                        <ArrowNext
                                            width={32}
                                            height={32}
                                            color={Colors.theme.primary}
                                        />
                                    ) : (
                                        <SvgXml
                                            xml={lock}
                                            width={25}
                                            height={25}
                                        />
                                    )}
                                    <Animated.View
                                        style={
                                            styles(
                                                animatedWidth,
                                                complete,
                                                animation2,
                                                animation4,
                                                animatedWidth2
                                            ).circleAnimatedStyle
                                        }
                                    >
                                        {progress ? (
                                            <ArrowNext
                                                width={32}
                                                height={32}
                                                color={Colors.theme.primary}
                                            />
                                        ) : (
                                            <SvgXml
                                                xml={lock}
                                                width={25}
                                                height={25}
                                            />
                                        )}
                                    </Animated.View>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View style={styles().leftArrow}>
                            <ArrowNext
                                width={15}
                                height={20}
                                color={Colors.text.primary}
                            />
                            {time && (
                                <Text
                                    color={Colors.text.primary}
                                    style={styles().subheadingmin}
                                >
                                    {time}
                                </Text>
                            )}
                        </View>
                    )}
                    {complete && (
                        <View>
                            <Animated.View
                                style={
                                    styles(
                                        animatedWidth,
                                        complete,
                                        animation2,
                                        animation4,
                                        animatedWidth2
                                    ).completedStyle
                                }
                            >
                                <Text
                                    style={styles().progressText}
                                    color={Colors.theme.primary}
                                >
                                    Completed!
                                </Text>
                            </Animated.View>
                            <Animated.View
                                style={
                                    styles(
                                        animatedWidth,
                                        complete,
                                        animation2,
                                        animation4,
                                        animatedWidth2
                                    ).completedWrapperStyle
                                }
                            />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = (
    animatedWidth: Animated.Value,
    complete: boolean,
    animation2: Animated.Value,
    animation4: Animated.Value,
    animatedWidth2: Animated.Value
) =>
    StyleSheet.create({
        card: {
            width: '100%',
            height: LayoutContants.cardHeight,
            borderColor: Colors.button.app_button_disabled_bg,
            borderRadius: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
            backgroundColor: Colors.extras.white,
            elevation: 1,
            shadowOpacity: 0.06,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 0 },
            shadowColor: Colors.theme.app_sheet_background_color
        },
        cardComplete: {},
        cardInProgress: {
            backgroundColor: Colors.extras.card_inProgress
        },
        leftContainer: {
            width: '60%',
            flexDirection: 'row',
            alignItems: 'center'
        },
        leftImg: {
            width: '28%',
            height: 70,
            borderRadius: 15,
            backgroundColor: '#f8f8f8',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10
        },
        image: {
            width: 45,
            height: 45
        },
        leftText: {
            marginStart: 10,
            width: '65%'
        },
        leftArrow: {
            marginStart: 10,
            width: '65%',
            alignItems: 'flex-end'
        },
        subheading: {
            marginTop: LayoutContants.gapSpacing
        },
        subheadingmin: {
            marginTop: 16
        },
        progressContainer: {
            width: '40%',
            paddingLeft: 10,
            alignItems: 'flex-end',
            paddingRight: 10
        },
        progressText: {
            textAlign: 'right',
            marginTop: 6
        },
        animatedButtonStyle: {
            position: 'absolute',
            top: 0,
            left: 0,
            height: LayoutContants.cardHeight,
            width: animatedWidth,
            borderRadius: 20,
            backgroundColor: complete
                ? Colors.extras.card_completed
                : Colors.extras.white
        },
        circleAnimatedStyle: {
            position: 'absolute',
            opacity: animation2
        },
        completedStyle: {
            opacity: animation4
        },
        completedWrapperStyle: {
            position: 'absolute',
            backgroundColor: Colors.extras.card_completed,
            right: 0,
            height: '100%',
            width: animatedWidth2
        },
        touchableContainerStyle: {
            height: LayoutContants.cardHeight,
            width: '100%',
            borderRadius: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: Colors.extras.white
        }
    });

export default LessonCard;
