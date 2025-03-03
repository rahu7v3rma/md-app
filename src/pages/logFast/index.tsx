import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, { FunctionComponent, useCallback, useRef, useState } from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

import { BackIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import {
    createLogFast,
    deleteLogFast,
    getDailyCompletedLogs,
    getRecentLogs,
    updateLogFast
} from '@/reducers/log';
import {
    Button,
    ConfirmationDialogue,
    CustomStatusBar,
    Header,
    LogTimePicker,
    LogUnitPicker,
    Text
} from '@/shared';
import LogInputDatePicker from '@/shared/logInputDatePicker';
import { Colors } from '@/theme/colors';
import { Constants } from '@/utils/constants';
import { isTimerValid } from '@/utils/helper';

type Props = Record<string, never>;
type LogFastRouteProp = RouteProp<RootStackParamList, 'LogFast'>;

const LogFast: FunctionComponent<Props> = ({}: Props) => {
    const dispatch = useAppDispatch();

    const route = useRoute<LogFastRouteProp>();
    const navigation = useNavigation<RootNavigationProp>();
    const onDeleteBottomSheetRef = useRef<RBSheet>(null);
    const onDiscardBottomSheetRef = useRef<RBSheet>(null);
    const [timer, setTimer] = useState<number>(
        Number(route?.params?.duration_minutes) || 960
    );
    const [dateTime, setDateTime] = useState<Date>(
        route?.params?.log_time
            ? moment(route.params.log_time, 'YYYY-MM-DD HH:mm:s').toDate()
            : moment().toDate()
    );
    const [submitInProgress, setSubmitInProgress] = useState(false);
    const [bottomSheetActive, setBottomSheetActive] = useState<boolean>(false);
    const onSubmit = useCallback(() => {
        if (!isTimerValid(timer)) {
            Toast.show({
                type: 'errorResponse',
                text1: Constants.errors.fastDuration,
                position: 'bottom'
            });
            return;
        }

        if (moment(dateTime).isAfter(moment())) {
            Toast.show({
                type: 'errorResponse',
                text1: Constants.errors.futureTime,
                position: 'bottom'
            });
            return;
        }

        setSubmitInProgress(true);
        if (!route.params) {
            dispatch(
                createLogFast({
                    logTime: moment(dateTime).format('YYYY-MM-DDTHH:mm:[00]'),
                    durationMinutes: timer
                })
            )
                .unwrap()
                .then(() => {
                    Toast.show({
                        type: 'successResponse',
                        text1: 'log updated successfully',
                        position: 'bottom'
                    });
                    navigation.navigate('Main');
                })
                .catch(() => {
                    Toast.show({
                        type: 'errorResponse',
                        text1: 'Something went wrong!',
                        position: 'bottom'
                    });
                })
                .finally(() => setSubmitInProgress(false));
        } else {
            dispatch(
                updateLogFast({
                    id: route?.params?.id,
                    logTime: moment(dateTime).format('YYYY-MM-DDTHH:mm:[00]'),
                    durationMinutes: timer
                })
            )
                .unwrap()
                .then(() => {
                    dispatch(getDailyCompletedLogs({ date: new Date() }));

                    Toast.show({
                        type: 'successResponse',
                        text1: 'Logged Successfully',
                        position: 'bottom'
                    });
                    dispatch(
                        getRecentLogs({
                            page: 1,
                            limit: 5
                        })
                    );
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                    }
                })
                .catch(() => {
                    Toast.show({
                        type: 'errorResponse',
                        text1: 'Something went wrong!',
                        position: 'bottom'
                    });
                })
                .finally(() => setSubmitInProgress(false));
        }
    }, [dateTime, dispatch, navigation, route.params, timer]);

    const onDeleteFastLog = useCallback(() => {
        dispatch(
            deleteLogFast({
                logId: route?.params?.id + ''
            })
        )
            .unwrap()
            .then(() => {
                dispatch(getDailyCompletedLogs({ date: new Date() }));
                Toast.show({
                    type: 'successResponse',
                    text1: 'User fast log deleted successfully',
                    position: 'bottom'
                });
                if (navigation.canGoBack()) {
                    navigation.goBack();
                }
            })
            .catch((errorRes) => {
                Toast.show({
                    type: 'errorResponse',
                    text1: errorRes?.data?.message || 'Network Error',
                    position: 'bottom'
                });
            });
    }, [route?.params?.id, dispatch, navigation]);

    return (
        <SafeAreaView style={styles.root}>
            <CustomStatusBar />
            <Header
                leftIcon={BackIcon}
                onLeftBtnPress={() =>
                    route?.params
                        ? onDiscardBottomSheetRef?.current?.open()
                        : navigation.pop()
                }
                title="Log a Fast"
                rightBtnText={route?.params ? 'Delete' : ''}
                onRightBtnPress={() => onDeleteBottomSheetRef?.current?.open()}
            />
            <ScrollView style={styles.contentWrapper}>
                <View style={styles.content}>
                    <View>
                        <LogUnitPicker
                            title="Tell us about your fast"
                            value={timer}
                            type="timer"
                            onDecrementHandler={() =>
                                setTimer(timer > 0 ? timer - 1 : 0)
                            }
                            onIncrementHandler={() => setTimer(timer + 1)}
                            onChangeHandler={setTimer}
                        />
                        <LogTimePicker
                            fieldName="Time"
                            selectedValue={dateTime}
                            onSelect={(selTime: Date) =>
                                // create a new date to avoid cases in
                                // which a Date object is manipulated and
                                // react doesn't see it as a state update
                                setDateTime(new Date(selTime))
                            }
                            timeZoneOffsetInMinutes={
                                Platform.OS === 'android' ? 0 : undefined
                            }
                            locale="en_GB"
                            disabled={bottomSheetActive}
                            onPressInput={() => setBottomSheetActive(true)}
                            onDismissBottomSheet={() =>
                                setBottomSheetActive(false)
                            }
                        />
                        <LogInputDatePicker
                            selectedDate={moment(dateTime).format('YYYY-MM-DD')}
                            onDateSelected={(selDate: Date) => {
                                const newDateTime = moment(selDate);
                                const oldDateTime = moment(dateTime);
                                newDateTime.set('hour', oldDateTime.hour());
                                newDateTime.set('minute', oldDateTime.minute());
                                setDateTime(newDateTime.toDate());
                            }}
                            disabled={bottomSheetActive}
                            onPressInput={() => setBottomSheetActive(true)}
                            onCalendarClosed={() => setBottomSheetActive(false)}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={styles.logBtnWrapper}>
                <Button
                    testID="submitButton"
                    primary
                    onPress={onSubmit}
                    style={styles.logBtn}
                    bordered={false}
                    disabled={submitInProgress}
                >
                    <Text color={Colors.text.white} fontWeight="600">
                        {route?.params ? 'Save' : 'Log a Fast'}
                    </Text>
                </Button>
            </View>
            <ConfirmationDialogue
                bottomSheetRef={onDeleteBottomSheetRef}
                title={Constants.confirmationDialog.title.delete}
                dismissBtnTitle={'No'}
                confirmBtnTitle={'Delete'}
                onDismissBtnHandler={() => {
                    onDeleteBottomSheetRef.current?.close();
                }}
                onConfirmBtnHandler={() => {
                    onDeleteFastLog();
                    onDeleteBottomSheetRef.current?.close();
                }}
                confirmBtnStyles={{
                    backgroundColor: Colors.button.app_button_red_background
                }}
            />
            <ConfirmationDialogue
                bottomSheetRef={onDiscardBottomSheetRef}
                title={Constants.confirmationDialog.title.discard}
                dismissBtnTitle={'No'}
                confirmBtnTitle={'Yes'}
                onDismissBtnHandler={() => {
                    onDiscardBottomSheetRef.current?.close();
                }}
                onConfirmBtnHandler={() => {
                    onDiscardBottomSheetRef.current?.close();
                    navigation.pop();
                }}
            />
        </SafeAreaView>
    );
};

export default LogFast;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.extras.white
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
    title: {
        lineHeight: 32,
        textAlign: 'center'
    },
    logBtnWrapper: {
        paddingBottom: 20,
        paddingHorizontal: 20
    },
    logBtn: {
        height: 56,
        paddingVertical: 0
    }
});
