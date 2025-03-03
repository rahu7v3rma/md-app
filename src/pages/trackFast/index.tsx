import {
    NavigationProp,
    RouteProp,
    useNavigation
} from '@react-navigation/native';
import moment from 'moment';
import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    AppState,
    BackHandler,
    Platform,
    SafeAreaView,
    StyleSheet,
    View
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

import { BackIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp, TrackFastTimerProps } from '@/navigation';
import { createLogFast } from '@/reducers/log';
import {
    trackedTimeUpdateManual,
    trackReset,
    TrackSelectors,
    trackStart,
    trackStartTime,
    trackStop,
    trackTimeLimitUpdate,
    trackUpdate
} from '@/reducers/track';
import {
    Button,
    ConfirmationDialogue,
    CustomStatusBar,
    Header,
    LogTimePicker,
    Text
} from '@/shared';
import LogInputDatePicker from '@/shared/logInputDatePicker';
import TimePickerModal, {
    TimePickerModalElement
} from '@/shared/timePickerModal';
import TrackFastTimer from '@/shared/trackFastTimer';
import { Colors } from '@/theme/colors';
import { Constants } from '@/utils/constants';
import { padNum } from '@/utils/helper';

type Props = {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
} & TrackFastTimerProps;

const stateTypes = Constants.trackFast.state;

const TrackFast: FunctionComponent<Props> = (props) => {
    const [openTrackFast, setOpenTrackFast] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [logPickerTime, setLogPickerTime] = useState<Date>(
        Platform.OS === 'android'
            ? moment(`${moment().format('YYYY-MM-DD')}T${'16:00'}:00`)
                  .utcOffset(0, true)
                  .toDate()
            : moment(`${moment().format('YYYY-MM-DD')}T${'16:00'}:00`).toDate()
    );

    const bottomSheetRef = React.useRef<RBSheet>(null);
    const onResetBottomSheetRef = React.useRef<RBSheet>(null);
    const trackFastTimerRef = React.useRef<TimePickerModalElement>(null);

    const navigation = useNavigation<RootNavigationProp>();
    const {
        trackFastState,
        trackStartedAt,
        trackedTimeInSeconds,
        trackStartTimeInSecond,
        trackTimeLimitInSeconds
    } = TrackSelectors();
    const {
        startTrackFastTimerInterval,
        stopTrackFastTimerInterval,
        trackFastTimerListener,
        setTrackFastTimerListener
    } = props;

    const [time, setTime] = useState(
        moment(trackStartedAt || undefined).format('HH:mm')
    );
    const [date, setDate] = useState(
        moment(trackStartedAt || undefined).format('YYYY-MM-DD')
    );

    const onStart = () => {
        const currentSec = padNum(moment().get('second'));
        const currentDateTime = moment(`${date}T${time}:${currentSec}`);
        if (moment().isBefore(currentDateTime)) {
            Toast.show({
                type: 'errorResponse',
                text1: 'You can not select future time.',
                position: 'bottom'
            });
            return;
        }
        dispatch(
            trackStart({
                startDateTime: currentDateTime.toISOString()
            })
        );
        if (moment(`${date}T${time}:${currentSec}`).isBefore(moment())) {
            if (
                trackTimeLimitInSeconds >
                moment().diff(moment(`${date}T${time}:${currentSec}`), 'second')
            ) {
                dispatch(
                    trackUpdate({
                        timeToUpdate: moment().diff(
                            moment(`${date}T${time}:${currentSec}`),
                            'second'
                        )
                    })
                );
            } else {
                dispatch(
                    trackUpdate({
                        timeToUpdate: trackTimeLimitInSeconds - 1
                    })
                );
            }
        }

        startTrackFastTimerInterval();
    };

    const onResume = () => {
        const currentSec = padNum(moment().get('second'));
        dispatch(
            trackStart({
                startDateTime: moment(
                    `${date}T${time}:${currentSec}`
                ).toISOString()
            })
        );
        startTrackFastTimerInterval();
    };

    useEffect(() => {
        if (trackFastState === 'tracking' && trackStartedAt) {
            trackFastTimerListener?.remove();
            setTrackFastTimerListener(
                AppState.addEventListener('change', (state) => {
                    if (state === 'active') {
                        if (
                            moment(
                                moment(trackStartedAt)
                                    .add(trackTimeLimitInSeconds, 's')
                                    .format()
                            ).diff(moment(), 'seconds') > 0
                        ) {
                            dispatch(
                                trackedTimeUpdateManual({
                                    trackedTimeInSeconds: moment().diff(
                                        moment(trackStartedAt),
                                        'seconds'
                                    )
                                })
                            );
                            startTrackFastTimerInterval();
                        } else {
                            dispatch(
                                trackedTimeUpdateManual({
                                    trackedTimeInSeconds:
                                        trackTimeLimitInSeconds
                                })
                            );
                            stopTrackFastTimerInterval();
                            trackFastTimerListener?.remove();
                        }
                    } else {
                        stopTrackFastTimerInterval();
                    }
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackFastState, trackStartedAt]);

    const onPause = () => {
        dispatch(trackStop());
        bottomSheetRef.current?.open();
        stopTrackFastTimerInterval();
        trackFastTimerListener?.remove();
    };

    const onReset = () => {
        setLogPickerTime(
            Platform.OS === 'android'
                ? moment(`${moment().format('YYYY-MM-DD')}T${'16:00'}:00`)
                      .utcOffset(0, true)
                      .toDate()
                : moment(
                      `${moment().format('YYYY-MM-DD')}T${'16:00'}:00`
                  ).toDate()
        );

        onResetBottomSheetRef.current?.open();
    };

    const onPressBack = () => {
        if (trackFastState === 'tracked') {
            onResetBottomSheetRef.current?.open();
        } else {
            navigation.pop();
        }
    };

    const formatTime = (timeInSeconds: number) => {
        return moment(date)
            .startOf('day')
            .seconds(timeInSeconds || 0)
            .format('HH:mm:ss');
    };

    function padTo2Digits(num: any) {
        return num.toString().padStart(2, '0');
    }

    function toSeconds(hours: number, minutes: number) {
        return hours * 3600 + minutes * 60;
    }

    const onSelectTime = (selTime: Date) => {
        let _date = moment(selTime);
        if (Platform.OS === 'android') {
            _date.utcOffset(0);
        }
        const hours = _date.format('HH');
        const minutes = _date.format('mm');
        if (openTrackFast) {
            setLogPickerTime(new Date(selTime));
            dispatch(
                trackTimeLimitUpdate({
                    timeLimitInSeconds: toSeconds(
                        Number(hours),
                        Number(minutes)
                    )
                })
            );
            setOpenTrackFast(false);
        } else {
            setTime(_date.format('HH:mm'));

            dispatch(
                trackStartTime({
                    startTimeInSecond: toSeconds(Number(hours), Number(minutes))
                })
            );
        }
    };

    const onLog = () => {
        dispatch(
            createLogFast({
                logTime: `${date} ${time}:00`,
                durationMinutes: Number(
                    padTo2Digits(Math.floor(trackedTimeInSeconds / 60))
                )
            })
        )
            .unwrap()
            .then(() => {
                Toast.show({
                    type: 'successResponse',
                    text1: 'Logged Successfully',
                    position: 'bottom'
                });
                dispatch(trackReset());
                navigation.navigate('Main');
            })
            .catch(() => {
                Toast.show({
                    type: 'errorResponse',
                    text1: 'Something went wrong!',
                    position: 'bottom'
                });
            });
    };

    useEffect(() => {
        const backAction = () => {
            if (trackFastState === 'tracked') {
                onResetBottomSheetRef.current?.open();
                setLogPickerTime(
                    Platform.OS === 'android'
                        ? moment(
                              `${moment().format('YYYY-MM-DD')}T${'16:00'}:00`
                          )
                              .utcOffset(0, true)
                              .toDate()
                        : moment(
                              `${moment().format('YYYY-MM-DD')}T${'16:00'}:00`
                          ).toDate()
                );
            } else {
                navigation.pop();
            }
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [navigation, trackFastState]);

    return (
        <>
            <SafeAreaView style={styles.top} />
            <SafeAreaView style={styles.root}>
                <CustomStatusBar />
                <Header
                    leftIcon={BackIcon}
                    onLeftBtnPress={onPressBack}
                    title="Fasting Timer"
                />
                <View style={styles.contentWrapper}>
                    <View style={styles.content}>
                        <View>
                            <TrackFastTimer
                                onPress={() => {
                                    if (trackFastState === stateTypes.empty) {
                                        trackFastTimerRef.current?.openTimePickerModal();
                                        setOpenTrackFast(true);
                                    }
                                }}
                            />

                            <LogTimePicker
                                style={styles.logTimePicker}
                                fieldName="Select start time"
                                selectedValue={new Date(`${date}T${time}:00`)}
                                onSelect={onSelectTime}
                                displayTime={time}
                                timeZoneOffsetInMinutes={
                                    Platform.OS === 'android' ? 0 : undefined
                                }
                                locale="en_GB"
                                customTitle={formatTime(trackStartTimeInSecond)}
                                disabled={trackFastState !== stateTypes.empty}
                            />

                            <LogInputDatePicker
                                onDateSelected={(selDate: Date) =>
                                    setDate(
                                        moment(selDate).format('YYYY-MM-DD')
                                    )
                                }
                                disabled={trackFastState !== stateTypes.empty}
                                minDate={moment()
                                    .subtract(1, 'd')
                                    .format('YYYY-MM-DD')}
                            />
                        </View>

                        {trackFastState === stateTypes.empty && (
                            <Button
                                primary
                                onPress={onStart}
                                style={styles.startLog}
                                bordered={false}
                            >
                                <Text
                                    color={Colors.text.white}
                                    fontWeight="600"
                                >
                                    Start
                                </Text>
                            </Button>
                        )}

                        {trackFastState === stateTypes.tracking && (
                            <Button
                                primary
                                bordered={false}
                                onPress={onPause}
                                style={styles.pauseLog}
                            >
                                <Text
                                    color={Colors.text.white}
                                    fontWeight="600"
                                >
                                    Pause
                                </Text>
                            </Button>
                        )}

                        {(trackFastState === stateTypes.tracked ||
                            trackFastState === stateTypes.complete) && (
                            <View style={styles.actionsContainer}>
                                <Button
                                    primary
                                    bordered={false}
                                    onPress={onReset}
                                    style={styles.stopLog}
                                >
                                    <Text
                                        color={Colors.text.white}
                                        fontWeight="600"
                                    >
                                        Reset
                                    </Text>
                                </Button>
                                <Button
                                    primary
                                    bordered={false}
                                    onPress={() =>
                                        trackFastState === stateTypes.complete
                                            ? onLog()
                                            : onResume()
                                    }
                                    style={styles.resumeLog}
                                >
                                    <Text
                                        color={Colors.text.white}
                                        fontWeight="600"
                                    >
                                        {trackFastState === stateTypes.complete
                                            ? 'Log'
                                            : 'Resume'}
                                    </Text>
                                </Button>
                            </View>
                        )}
                    </View>
                </View>
                <TimePickerModal
                    shouldAllowZeroTime={false}
                    ref={trackFastTimerRef}
                    selectedValue={logPickerTime}
                    onSelect={onSelectTime}
                    locale={'en_GB'}
                    disMissModal={() => setOpenTrackFast(false)}
                    timeZoneOffsetInMinutes={
                        Platform.OS === 'android' ? 0 : undefined
                    }
                />
                <ConfirmationDialogue
                    bottomSheetRef={bottomSheetRef}
                    title={'Do you want to log your fast?'}
                    subTitle={`${formatTime(
                        trackedTimeInSeconds
                    )}, ${time}, ${date}`}
                    dismissBtnTitle={'No'}
                    confirmBtnTitle={'Log'}
                    onDismissBtnHandler={() => {
                        bottomSheetRef.current?.close();
                    }}
                    onConfirmBtnHandler={() => {
                        onLog();
                        bottomSheetRef.current?.close();
                    }}
                />
                <ConfirmationDialogue
                    bottomSheetRef={onResetBottomSheetRef}
                    title={'Do you want to reset\nyour unsaved fast data?'}
                    dismissBtnTitle={'No'}
                    confirmBtnTitle={'Yes'}
                    onDismissBtnHandler={() => {
                        onResetBottomSheetRef.current?.close();
                    }}
                    onConfirmBtnHandler={() => {
                        dispatch(trackReset());
                        onResetBottomSheetRef.current?.close();
                        stopTrackFastTimerInterval();
                        trackFastTimerListener?.remove();
                    }}
                />
            </SafeAreaView>
        </>
    );
};

export default TrackFast;

const styles = StyleSheet.create({
    top: {
        backgroundColor: Colors.extras.white
    },
    root: {
        flex: 1,
        backgroundColor: Colors.theme.log_page_background_color
    },
    contentWrapper: {
        flex: 1,
        backgroundColor: Colors.theme.log_page_background_color
    },
    content: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: 20,
        marginHorizontal: 20
    },
    startLog: {
        width: '100%',
        backgroundColor: Colors.theme.primary,
        marginBottom: 28,
        height: 56,
        paddingVertical: 0
    },
    stopLog: {
        width: '49%',
        backgroundColor: Colors.button.app_button_red_background,
        marginBottom: 28,
        height: 56,
        paddingVertical: 0
    },
    pauseLog: {
        width: '100%',
        backgroundColor: Colors.button.app_button_red_background,
        marginBottom: 28,
        height: 56,
        paddingVertical: 0
    },
    resumeLog: {
        width: '49%',
        backgroundColor: Colors.theme.primary,
        marginBottom: 28,
        height: 56,
        paddingVertical: 0
    },
    logTimePicker: {
        marginTop: 36
    },
    actionsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    }
});
