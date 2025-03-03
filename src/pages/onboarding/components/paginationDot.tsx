import React, { FunctionComponent } from 'react';
import {
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    withTiming
} from 'react-native-reanimated';

type PagingAnimatedStyle = {
    transform?: { rotationDegrees?: number };
    color?: string;
};

type Props = {
    dotContainerStyle?: StyleProp<ViewStyle>;
    dotStyle?: StyleProp<ViewStyle>;
    active: boolean;
    activeAnimatedStyle?: PagingAnimatedStyle;
    inactiveAnimatedStyle?: PagingAnimatedStyle;
    onPress?: () => void;
};

const PaginationDot: FunctionComponent<Props> = ({
    dotContainerStyle,
    dotStyle,
    active,
    activeAnimatedStyle,
    inactiveAnimatedStyle,
    onPress
}: Props) => {
    const animationProgress = useDerivedValue(() => {
        return withTiming(active ? 1 : 0);
    });

    const animatedBackgroundColor = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            animationProgress.value,
            [0, 1],
            [
                inactiveAnimatedStyle?.color || '#fff',
                activeAnimatedStyle?.color || '#000'
            ]
        );

        return {
            backgroundColor
        };
    });

    const animatedTransform = useAnimatedStyle(() => {
        const rotation = interpolate(
            animationProgress.value,
            [0, 1],
            [
                inactiveAnimatedStyle?.transform?.rotationDegrees || 0,
                activeAnimatedStyle?.transform?.rotationDegrees || 0
            ]
        );

        return {
            transform: [
                {
                    rotate: `${rotation}deg`
                }
            ]
        };
    });

    return (
        <TouchableOpacity
            accessible={false}
            style={[styles.root, dotContainerStyle]}
            onPress={onPress}
        >
            <Animated.View
                style={[dotStyle, animatedBackgroundColor, animatedTransform]}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8
    }
});

export default PaginationDot;
