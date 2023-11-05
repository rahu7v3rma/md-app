import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { FunctionComponent, useState } from 'react';
import {
    Keyboard,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from 'react-native';

import { RootNavigationProp } from '@/navigation';
import { TrackSelectors } from '@/reducers/track';
import Button from '@/shared/button';
import Text, { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { Constants } from '@/utils/constants';

type Props = {
    onLeftBtnPress?: () => void;
    leftIcon?: any;
    title?: string;
    isPressable?: boolean;
    onRightBtnPress?: () => void;
    rightIcon?: any;
    isFastTrackerActive?: boolean;
    styles?: any;
    leftBtnStyles?: ViewStyle;
    seperator?: boolean;
    rightBtnText?: string;
    leftIconBgColor?: string;
    isLeftIconShadow?: boolean;
    rightIconBadgeCount?: number;
};

const Header: FunctionComponent<Props> = ({
    onLeftBtnPress,
    leftIcon: LeftIcon,
    title,
    isPressable = false,
    onRightBtnPress,
    rightIcon: RightIcon,
    isFastTrackerActive,
    styles,
    leftBtnStyles,
    seperator = true,
    rightBtnText,
    leftIconBgColor = '',
    isLeftIconShadow = false,
    rightIconBadgeCount = 0
}: Props) => {
    const titleStyles: StyleProp<ViewStyle> = {
        ...style.titleWrapper,
        alignItems: LeftIcon ? 'center' : 'flex-start',
        width: LeftIcon ? '60%' : '80%'
    };

    // const currTime = moment().format('HH:mm:ss');

    const navigation = useNavigation<RootNavigationProp>();
    const {
        trackStartedAt,
        trackFastState,
        trackedTimeInSeconds,
        trackTimeLimitInSeconds
    } = TrackSelectors();

    const [date] = useState(
        moment(trackStartedAt || undefined).format('YYYY-MM-DD')
    );
    const fastCompletionPerc =
        (trackedTimeInSeconds / trackTimeLimitInSeconds) * 100;

    const formatTime = (timeInSeconds: number) => {
        return moment(date)
            .startOf('day')
            .seconds(timeInSeconds || 0)
            .format('HH:mm:ss');
    };

    const headerContentStyles = [
        style.header,
        styles,
        isFastTrackerActive
            ? trackFastState === 'tracked'
                ? style.stoppedTrackerBackground
                : trackFastState === 'complete'
                ? style.completedTrackerBackground
                : style.activeTrackerBackground
            : {}
    ];

    return (
        <>
            <View>
                <TouchableOpacity
                    disabled={!isFastTrackerActive && !isPressable}
                    style={[headerContentStyles]}
                    onPress={
                        isFastTrackerActive
                            ? () => navigation.navigate('TrackFast')
                            : () => Keyboard.dismiss()
                    }
                >
                    {LeftIcon && (
                        <View style={style.leftBtnContainer}>
                            <Button
                                testID="leftButton"
                                bordered={false}
                                rounded
                                onPress={onLeftBtnPress}
                                style={[
                                    style.btn,
                                    leftBtnStyles,
                                    leftIconStyles(
                                        leftIconBgColor,
                                        isLeftIconShadow
                                    )
                                ]}
                            >
                                <LeftIcon />
                            </Button>
                        </View>
                    )}
                    <View style={titleStyles}>
                        {isFastTrackerActive ? (
                            <View
                                style={style.fastTime}
                                testID="trackStateActive"
                            >
                                <Text
                                    color={
                                        trackFastState === 'tracked'
                                            ? Colors.text.error
                                            : Colors.text.white
                                    }
                                    size={Size.XXXSmall}
                                    fontWeight="700"
                                >
                                    {Constants.trackerTitle[trackFastState]}
                                </Text>
                                <Text
                                    color={Colors.text.white}
                                    size={Size.XXLarge}
                                    fontWeight="700"
                                >
                                    {formatTime(
                                        trackTimeLimitInSeconds -
                                            trackedTimeInSeconds
                                    )}
                                </Text>
                            </View>
                        ) : (
                            <Text
                                testID="title"
                                size={LeftIcon ? Size.XSmall : Size.Large}
                                fontWeight={LeftIcon ? '600' : '700'}
                                color={
                                    LeftIcon
                                        ? Colors.text.green
                                        : Colors.text.mainDarker
                                }
                            >
                                {title}
                            </Text>
                        )}
                    </View>
                    <View style={style.rightBtnContainer}>
                        {RightIcon && (
                            <Button
                                testID="rightButton"
                                bordered={false}
                                rounded
                                onPress={onRightBtnPress}
                                style={[
                                    style.btn,
                                    isFastTrackerActive &&
                                        trackFastState !== 'complete' &&
                                        style.whiteBackground
                                ]}
                            >
                                <RightIcon />
                                {rightIconBadgeCount > 0 && (
                                    <View
                                        testID="rightButtonBadge"
                                        style={[
                                            style.rightIconBadgeCount,
                                            badgeCountStyle(rightIconBadgeCount)
                                        ]}
                                    >
                                        <Text
                                            color={Colors.text.white}
                                            size={Size.XSmall}
                                        >
                                            {rightIconBadgeCount}
                                        </Text>
                                    </View>
                                )}
                            </Button>
                        )}
                        {rightBtnText && (
                            <Text
                                color={Colors.button.app_button_red_background}
                                fontWeight="600"
                                size={Size.XXSmall}
                                onPress={onRightBtnPress}
                            >
                                {rightBtnText}
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>

                {isFastTrackerActive && trackFastState !== 'complete' && (
                    <View
                        style={[
                            style.activeTrackerBorder,
                            { width: `${fastCompletionPerc}%` }
                        ]}
                    >
                        <View style={style.activeTrackerBorderRightKnob} />
                    </View>
                )}
                {seperator && (
                    <View style={!LeftIcon && style.shadowView}>
                        <View style={!LeftIcon && style.botderBottomView} />
                    </View>
                )}
            </View>
        </>
    );
};

export default Header;

const leftIconStyles = (
    leftIconBgColor: string,
    isLeftIconShadow: boolean
): StyleProp<ViewStyle> => {
    return {
        backgroundColor: leftIconBgColor || Colors.theme.primary_light,
        shadowColor: isLeftIconShadow ? Colors.extras.blackCards : '',
        shadowOpacity: isLeftIconShadow ? 1 : 0,
        shadowOffset: isLeftIconShadow
            ? { width: 0, height: 4 }
            : { width: 0, height: 0 }
    };
};

const badgeCountStyle = (rightIconBadgeCount: number): StyleProp<ViewStyle> => {
    return {
        width: rightIconBadgeCount < 999 ? 30 : 40,
        height: rightIconBadgeCount < 999 ? 30 : 40,
        borderRadius: rightIconBadgeCount <= 999 ? 30 : 40
    };
};

const style = StyleSheet.create({
    whiteBackground: {
        backgroundColor: 'white'
    },
    header: {
        paddingTop: 10,
        paddingHorizontal: 19,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 22,
        backgroundColor: Colors.extras.white
    },
    completedTrackerBackground: {
        backgroundColor: Colors.text.black_gray
    },
    activeTrackerBackground: {
        backgroundColor: Colors.extras.error_base
    },
    stoppedTrackerBackground: {
        backgroundColor: Colors.extras.error_lighter
    },
    activeTrackerBorder: {
        position: 'relative',
        borderBottomWidth: 3,
        borderBottomColor: Colors.progress.headerProgressColor
    },
    activeTrackerBorderRightKnob: {
        position: 'absolute',
        right: -12,
        bottom: -7,
        height: 12,
        width: 12,
        backgroundColor: Colors.extras.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.progress.headerProgressColor
    },
    leftBtnContainer: {
        width: '20%',
        alignItems: 'flex-start'
    },
    rightBtnContainer: {
        width: '20%',
        alignItems: 'flex-end'
    },
    btn: {
        width: 48,
        height: 48
    },
    titleWrapper: { width: '60%' },
    colorWhite: {
        color: Colors.extras.white
    },
    fastTime: {
        paddingVertical: 12
    },
    shadowView: {
        width: '100%',
        borderColor: Colors.button.app_button_border,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        shadowColor: 'rgba(0, 0, 0, 0.03)',
        shadowOffset: { width: 2, height: 6 },
        elevation: 8,
        shadowRadius: 17
    },
    botderBottomView: {
        borderBottomWidth: 3,
        borderBottomColor: 'rgba(0, 0, 0, 0.03)'
    },
    rightIconBadgeCount: {
        position: 'absolute',
        top: -10,
        right: -10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.extras.badgeRed
    }
});
