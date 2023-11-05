import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useState
} from 'react';
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-toast-message';

import { BackIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import {
    deleteActivityLog,
    getDailyCompletedLogs,
    getLogPickerValues,
    logActivity,
    LogSelectors,
    updateLogActivity
} from '@/reducers/log';
import {
    Button,
    ConfirmationDialogue,
    CustomStatusBar,
    Header,
    LogInputDropdown,
    LogTimePicker,
    LogUnitPicker,
    Text
} from '@/shared';
import LogInputDatePicker from '@/shared/logInputDatePicker';
import { Colors } from '@/theme/colors';
import { LogInputValue } from '@/types/log';
import { Constants } from '@/utils/constants';
import { isTimerValid } from '@/utils/helper';

export type LogActivityComponentProps = Record<string, never>;

export type LogActivityComponent = FunctionComponent<LogActivityComponentProps>;
type LogActivityProps = RouteProp<RootStackParamList, 'LogActivity'>;

const LogActivity: LogActivityComponent = ({}: LogActivityComponentProps) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();
    const route = useRoute<LogActivityProps>();

    const onDeleteBottomSheetRef = React.useRef<RBSheet>(null);
    const onDiscardBottomSheetRef = React.useRef<RBSheet>(null);

    const [timer, setTimer] = useState<number>(
        Number(route?.params?.duration_minutes || 30)
    );
    const [dateTime, setDateTime] = useState<Date>(
        route?.params?.log_time
            ? moment(route.params.log_time, 'YYYY-MM-DD HH:mm:s').toDate()
            : moment().toDate()
    );
    const [activityTypes, setActivityTypes] = useState<LogInputValue[]>([]);
    const [selectedActivityType, setSelectedActivityType] =
        useState<LogInputValue | null>(null);
    const [intensities, setIntensities] = useState<LogInputValue[]>([]);
    const [selectedIntensity, setSelectedIntensity] =
        useState<LogInputValue | null>(null);
    const [submitInProgress, setSubmitInProgress] = useState(false);

    const { pickerValues } = LogSelectors();

    useEffect(() => {
        dispatch(getLogPickerValues({}));
    }, [dispatch]);

    useEffect(() => {
        setActivityTypes(
            pickerValues.exercise.types.map((at, i) => ({
                id: i + 1,
                name: at
            }))
        );
        setIntensities(
            pickerValues.exercise.intensities.map((ai, i) => ({
                id: i + 1,
                name: ai
            }))
        );
    }, [pickerValues]);

    useEffect(() => {
        if (route.params?.activity_type) {
            const foundActivityType = activityTypes.find(
                (at) => at.name === route.params?.activity_type
            );
            if (foundActivityType) {
                setSelectedActivityType(foundActivityType);
            }
        }

        if (route.params?.intensity) {
            const foundIntensity = intensities.find(
                (ai) => ai.name === route.params?.intensity
            );
            if (foundIntensity) {
                setSelectedIntensity(foundIntensity);
            }
        }
    }, [
        route.params?.activity_type,
        activityTypes,
        route.params?.intensity,
        intensities
    ]);

    const submitExerciseLog = () => {
        if (!isTimerValid(timer)) {
            Toast.show({
                type: 'errorResponse',
                text1: Constants.errors.exerciseDuration,
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

        if (!selectedActivityType) {
            Toast.show({
                type: 'errorResponse',
                text1: 'Please select Activity!',
                position: 'bottom'
            });
            return;
        }

        if (!selectedIntensity) {
            Toast.show({
                type: 'errorResponse',
                text1: 'Please select Intensity!',
                position: 'bottom'
            });
            return;
        }

        setSubmitInProgress(true);
        if (route?.params?.id) {
            dispatch(
                updateLogActivity({
                    id: route?.params?.id,
                    log_time: moment(dateTime).format('YYYY-MM-DDTHH:mm:[00]'),
                    duration_minutes: timer,
                    activity_type: selectedActivityType.name,
                    intensity: selectedIntensity.name
                })
            )
                .unwrap()
                .then(() => {
                    dispatch(getDailyCompletedLogs({ date: new Date() }));
                    Toast.show({
                        type: 'successResponse',
                        text1: 'log updated successfully',
                        position: 'bottom'
                    });
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
        } else {
            dispatch(
                logActivity({
                    log_time: moment(dateTime).format('YYYY-MM-DDTHH:mm:[00]'),
                    duration_minutes: timer,
                    activity_type: selectedActivityType.name,
                    intensity: selectedIntensity.name
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
    };

    const onDeleteActivityLog = useCallback(() => {
        dispatch(
            deleteActivityLog({
                logId: route?.params?.id + ''
            })
        )
            .unwrap()
            .then(() => {
                dispatch(getDailyCompletedLogs({ date: new Date() }));
                Toast.show({
                    type: 'successResponse',
                    text1: 'User Exercise deleted successfully.',
                    position: 'bottom'
                });
                if (navigation.canGoBack()) {
                    navigation.goBack();
                }
            })
            .catch((errorRes) => {
                Toast.show({
                    type: 'errorResponse',
                    text1: errorRes?.data?.message || 'Network Error!',
                    position: 'bottom'
                });
            });
    }, [route?.params?.id, dispatch, navigation]);

    return (
        <>
            <SafeAreaView style={styles.top} />
            <View style={styles.root}>
                <CustomStatusBar />
                <Header
                    leftIcon={BackIcon}
                    onLeftBtnPress={() =>
                        route?.params
                            ? onDiscardBottomSheetRef?.current?.open()
                            : navigation.pop()
                    }
                    title="Log Activity"
                    rightBtnText={route?.params ? 'Delete' : ''}
                    onRightBtnPress={() =>
                        onDeleteBottomSheetRef?.current?.open()
                    }
                />
                <ScrollView style={styles.contentWrapper}>
                    <View style={styles.content}>
                        <View>
                            <LogUnitPicker
                                title="How long was your exercise?"
                                value={timer}
                                type="timer"
                                onChangeHandler={setTimer}
                                onDecrementHandler={() =>
                                    setTimer(timer > 0 ? timer - 1 : 0)
                                }
                                onIncrementHandler={() => setTimer(timer + 1)}
                            />
                            <LogTimePicker
                                fieldName="Start Time"
                                selectedValue={dateTime}
                                onSelect={(selTime: Date) =>
                                    // create a new date to avoid cases in
                                    // which a Date object is manipulated and
                                    // react doesn't see it as a state update
                                    setDateTime(new Date(selTime))
                                }
                                locale="en_GB"
                            />
                            <LogInputDatePicker
                                selectedDate={moment(dateTime).format(
                                    'YYYY-MM-DD'
                                )}
                                onDateSelected={(selDate: Date) => {
                                    const newDateTime = moment(selDate);
                                    const oldDateTime = moment(dateTime);
                                    newDateTime.set('hour', oldDateTime.hour());
                                    newDateTime.set(
                                        'minute',
                                        oldDateTime.minute()
                                    );
                                    setDateTime(newDateTime.toDate());
                                }}
                            />
                            <LogInputDropdown
                                fieldName="Select Activity"
                                selectedValue={selectedActivityType?.id}
                                labelKey="name"
                                valueKey="id"
                                onSelect={(selected) =>
                                    setSelectedActivityType(selected)
                                }
                                options={activityTypes}
                            />
                            <LogInputDropdown
                                fieldName="Intensity"
                                selectedValue={selectedIntensity?.id}
                                labelKey="name"
                                valueKey="id"
                                onSelect={(selected) =>
                                    setSelectedIntensity(selected)
                                }
                                options={intensities}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.logBtnWrapper}>
                    <Button
                        testID="submitButton"
                        primary
                        style={styles.logBtn}
                        bordered={false}
                        onPress={submitExerciseLog}
                        disabled={submitInProgress}
                    >
                        <Text color={Colors.text.white} fontWeight="600">
                            {route?.params ? 'Save' : 'Log Activity'}
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
                        onDeleteActivityLog();
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
            </View>
        </>
    );
};

export default LogActivity;

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
    title: {
        lineHeight: 32,
        textAlign: 'center'
    },
    logBtnWrapper: {
        paddingBottom: Platform.OS === 'ios' ? 45 : 60,
        paddingHorizontal: 20
    },
    logBtn: {
        height: 56,
        paddingVertical: 0
    }
});
