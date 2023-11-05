import moment from 'moment';
import React, { FunctionComponent, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ClockIcon } from '@/assets/svgs';
import { TrackSelectors } from '@/reducers/track';
import { Text } from '@/shared';
import { Colors } from '@/theme/colors';
import { Constants } from '@/utils/constants';

import ProgressCircle from '../progressCircle';

type Props = {
    onPress?: () => void;
};

const stateTypes = Constants.trackFast.state;

const TrackFastTimer: FunctionComponent<Props> = ({ onPress }: Props) => {
    const {
        trackFastState,
        trackStartedAt,
        trackedTimeInSeconds,
        trackTimeLimitInSeconds
    } = TrackSelectors();

    const [date] = useState(
        moment(trackStartedAt || undefined).format('YYYY-MM-DD')
    );

    const formatTime = (timeInSeconds: number) => {
        return moment(date)
            .startOf('day')
            .seconds(timeInSeconds || 0)
            .format('H:mm:ss');
    };

    return (
        <View style={styles.progressCircle}>
            <ProgressCircle
                internalStartButtonColor={
                    trackFastState === stateTypes.tracked
                        ? Colors.progressCircle.start_ball_disable_color
                        : Colors.progressCircle.start_ball_color
                }
                internalButtonColor={
                    trackFastState === stateTypes.tracked
                        ? Colors.progressCircle.inner_ball_disable_color
                        : Colors.progressCircle.inner_ball_color
                }
                percent={(100 * trackedTimeInSeconds) / trackTimeLimitInSeconds}
                radius={150}
                borderWidth={55}
                color={
                    trackFastState === stateTypes.tracked
                        ? Colors.progress.fillDisable
                        : Colors.progress.fillGreen
                }
                shadowColor={Colors.progress.trackColor}
                bgColor={Colors.theme.app_background}
            />
            <TouchableOpacity
                testID="trackFastTimerButton"
                style={styles.textMiddleContainer}
                onPress={() => {
                    onPress && onPress();
                }}
            >
                <Text
                    size={40}
                    fontWeight="700"
                    testID="trackFastTimeText"
                    color={
                        trackFastState === stateTypes.tracked
                            ? Colors.text.gray
                            : Colors.text.black_gray
                    }
                >
                    {formatTime(trackTimeLimitInSeconds - trackedTimeInSeconds)}
                </Text>
                {trackFastState !== stateTypes.empty && (
                    <View style={styles.icontextContent} testID="trackState">
                        <ClockIcon
                            width={10}
                            height={10}
                            color={
                                trackFastState === stateTypes.tracked
                                    ? Colors.text.gray
                                    : Colors.button.app_button_green_background
                            }
                        />
                        <Text
                            style={styles.textlast}
                            size={15}
                            color={
                                trackFastState === stateTypes.tracked
                                    ? Colors.text.gray
                                    : Colors.text.black_gray
                            }
                        >
                            {formatTime(trackedTimeInSeconds)}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    progressCircle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textMiddleContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute'
    },
    icontextContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textlast: {
        marginLeft: 5
    }
});

export default TrackFastTimer;
