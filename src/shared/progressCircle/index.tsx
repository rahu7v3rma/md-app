/*
 * Very much based on code from https://github.com/MrToph/react-native-progress-circle
 * which is no longer maintained and uses deprecated react-native classes
 */

import React, { FunctionComponent, useCallback, useMemo } from 'react';
import {
    I18nManager,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle
} from 'react-native';

import { Colors } from '@/theme/colors';

type Props = {
    color?: string;
    shadowColor?: string;
    bgColor?: string;
    internalButtonColor?: string;
    internalStartButtonColor?: string;
    radius: number;
    borderWidth?: number;
    percent: number;
    children?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    outerCircleStyle?: StyleProp<ViewStyle>;
    complete?: boolean;
};

function percentToDegrees(percent: number): number {
    return percent * 3.6;
}

const ProgressCircle: FunctionComponent<Props> = ({
    color = Colors.progressCircle.color,
    shadowColor = Colors.progressCircle.shadow_color,
    bgColor = Colors.progressCircle.bg_color,
    internalButtonColor = Colors.progressCircle.inner_ball_color,
    internalStartButtonColor = Colors.progressCircle.inner_ball_color,
    radius,
    borderWidth = 2,
    percent = 0,
    children,
    containerStyle,
    outerCircleStyle,
    complete
}) => {
    const computeDerivedState = useCallback(
        (
            currentPercent: number,
            currentColor: string,
            currentShadowColor: string
        ) => {
            const normalizedPercent = Math.max(
                Math.min(100, currentPercent),
                0
            );
            const needHalfCircle2 = normalizedPercent > 50;

            let halfCircle1Degree;
            let halfCircle2Degree;

            // degrees indicate the 'end' of the half circle, i.e. they span (degree - 180, degree)
            if (needHalfCircle2) {
                halfCircle1Degree = 180;
                halfCircle2Degree = percentToDegrees(normalizedPercent);
            } else {
                halfCircle1Degree = percentToDegrees(normalizedPercent);
                halfCircle2Degree = 0;
            }

            return {
                halfCircle1Degree,
                halfCircle2Degree,
                halfCircle2Styles: {
                    // when the second half circle is not needed, we need it to cover
                    // the negative degrees of the first circle
                    backgroundColor: needHalfCircle2
                        ? currentColor
                        : currentShadowColor
                }
            };
        },
        []
    );

    const renderHalfCircle = useCallback(
        (
            circleRadius: number,
            circleColor: string,
            rotateDegrees: number,
            halfCircleStyles?: StyleProp<ViewStyle>,
            testID?: string
        ) => {
            return (
                <View
                    style={[
                        styles.leftWrap,
                        {
                            width: circleRadius,
                            height: circleRadius * 2
                        }
                    ]}
                >
                    <View
                        testID={testID}
                        style={[
                            styles.halfCircle,
                            {
                                width: circleRadius,
                                height: circleRadius * 2,
                                borderRadius: circleRadius,
                                transform: [
                                    { translateX: circleRadius / 2 },
                                    { rotate: `${rotateDegrees}deg` },
                                    { translateX: -circleRadius / 2 }
                                ],
                                backgroundColor: circleColor
                            },
                            percent === 0 && styles.transparent,
                            halfCircleStyles
                        ]}
                    />
                </View>
            );
        },
        [percent]
    );

    const renderInternalCircle = useCallback(
        (currentPercent: number) => {
            const normalizedPercent = Math.max(
                Math.min(100, currentPercent),
                0
            );

            const circleDegree = percentToDegrees(normalizedPercent);

            return (
                <View
                    testID="internalCircleWrapper"
                    style={[
                        styles.outerCircle,
                        styles.internalCirclWrapperStyle,
                        {
                            height: radius * 2,
                            width: radius * 2,
                            borderRadius: radius,
                            transform: [{ rotate: `${circleDegree}deg` }]
                        }
                    ]}
                >
                    <View
                        testID="internalCircleBackground"
                        style={[
                            styles.InternalCircleContainerStyle,
                            {
                                height: borderWidth,
                                width: borderWidth,
                                borderRadius: borderWidth,
                                backgroundColor: color
                            }
                        ]}
                    />
                    {!complete && (
                        <View
                            testID="internalCircle"
                            style={[
                                styles.InternalCircleStyle,
                                {
                                    height: borderWidth - 4,
                                    width: borderWidth - 4,
                                    borderRadius: borderWidth,
                                    borderColor: internalButtonColor
                                }
                            ]}
                        />
                    )}
                </View>
            );
        },
        [borderWidth, color, internalButtonColor, radius, complete]
    );

    const innerCircle = useMemo(() => {
        const radiusMinusBorder = radius - borderWidth;

        return (
            <View
                testID="innerCircleContainer"
                style={[
                    styles.innerCircle,
                    {
                        width: radiusMinusBorder * 2,
                        height: radiusMinusBorder * 2,
                        borderRadius: radiusMinusBorder,
                        backgroundColor: bgColor
                    },
                    containerStyle
                ]}
            >
                {children || null}
            </View>
        );
    }, [radius, borderWidth, bgColor, containerStyle, children]);

    const { firstHalfCircle, secondHalfCircle } = useMemo(() => {
        const { halfCircle1Degree, halfCircle2Degree, halfCircle2Styles } =
            computeDerivedState(percent, color, shadowColor);

        const first = renderHalfCircle(
            radius,
            color,
            halfCircle1Degree,
            {},
            'firstHalfCircle'
        );
        const second = renderHalfCircle(
            radius,
            color,
            halfCircle2Degree,
            halfCircle2Styles,
            'secondHalfCircle'
        );

        return { firstHalfCircle: first, secondHalfCircle: second };
    }, [
        computeDerivedState,
        percent,
        color,
        shadowColor,
        renderHalfCircle,
        radius
    ]);

    return (
        <View
            style={[
                styles.outerCircle,
                {
                    width: radius * 2,
                    height: radius * 2,
                    borderRadius: radius,
                    backgroundColor: shadowColor
                },
                outerCircleStyle
            ]}
        >
            {firstHalfCircle}
            {secondHalfCircle}
            {innerCircle}
            <View
                testID="internalCircleContainer"
                style={[
                    styles.InternalCircleContainerStyle,
                    {
                        height: borderWidth,
                        width: borderWidth,
                        borderRadius: borderWidth,
                        backgroundColor: internalStartButtonColor
                            ? internalStartButtonColor
                            : internalButtonColor
                    }
                ]}
            />
            {renderInternalCircle(percent)}
        </View>
    );
};

const direction = I18nManager.isRTL ? 'right' : 'left';
const opDirection = I18nManager.isRTL ? 'Left' : 'Right';

const styles = StyleSheet.create({
    outerCircle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerCircle: {
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftWrap: {
        position: 'absolute',
        top: 0,
        [`${direction}`]: 0
    },
    halfCircle: {
        position: 'absolute',
        top: 0,
        left: 0,
        [`borderTop${opDirection}Radius`]: 0,
        [`borderBottom${opDirection}Radius`]: 0,
        overflow: 'hidden'
    },
    transparent: {
        opacity: 0
    },
    internalCirclWrapperStyle: {
        position: 'absolute'
    },
    InternalCircleContainerStyle: {
        position: 'absolute',
        top: 0
    },
    InternalCircleStyle: {
        backgroundColor: Colors.extras.white,
        position: 'absolute',
        top: 0,
        borderWidth: 4,
        marginTop: 2
    }
});

export default ProgressCircle;
