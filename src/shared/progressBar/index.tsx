import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useMemo,
    useRef
} from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';

type Props = {
    progress: number;
    style?: StyleProp<ViewStyle>;
    barStyle?: StyleProp<ViewStyle>;
};

const ProgressBar: FunctionComponent<Props> = ({
    progress = 0,
    style,
    barStyle
}: Props) => {
    const progressValue = useRef(new Animated.Value(0)).current;

    const width = useMemo(
        () =>
            progressValue.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp'
            }),
        [progressValue]
    );

    const animationConfig = useMemo(
        () => ({
            toValue: progress,
            duration: 500,
            useNativeDriver: false
        }),
        [progress]
    );

    const startProgress = useCallback(() => {
        Animated.timing(progressValue, animationConfig).start();
    }, [animationConfig, progressValue]);

    const stopProgress = useCallback(() => {
        Animated.timing(progressValue, animationConfig).stop();
    }, [animationConfig, progressValue]);

    useEffect(() => {
        if (progress >= 100) {
            stopProgress();
        }

        startProgress();
    }, [progress, startProgress, stopProgress]);

    return (
        <View style={[styles.container, style]}>
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    styles.bar,
                    barStyle,
                    {
                        width
                    }
                ]}
            />
        </View>
    );
};

export default ProgressBar;

const styles = StyleSheet.create({
    container: {
        height: COMMON.responsiveSize(8),
        backgroundColor: Colors.extras.white,
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        position: 'relative'
    },
    bar: {
        backgroundColor: Colors.progress.fill,
        borderBottomWidth: 2,
        borderBottomColor: Colors.progress.fill_border
    }
});
