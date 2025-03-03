import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

import BackIcon from '@/assets/svgs/Back';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import {
    createLogWeight,
    deleteLogWeight,
    getDailyCompletedLogs,
    getLogPickerValues,
    LogSelectors,
    updateLogWeight
} from '@/reducers/log';
import { UserSelectors } from '@/reducers/user';
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
import { formatNumber, isUnitValid } from '@/utils/helper';

type Props = Record<string, never>;
type LogWeightProp = RouteProp<RootStackParamList, 'LogWeight'>;

const LogWeight: FunctionComponent<Props> = ({}: Props) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();
    const route = useRoute<LogWeightProp>();

    const onDeleteBottomSheetRef = useRef<RBSheet>(null);
    const onDiscardBottomSheetRef = useRef<RBSheet>(null);

    const [dateTime, setDateTime] = useState<Date>(
        route?.params?.log_time
            ? moment(route.params.log_time, 'YYYY-MM-DD HH:mm:s').toDate()
            : moment().toDate()
    );
    const [selectedUnit, setSelectedUnit] = useState<string | undefined>(
        undefined
    );
    const [weight, setWeight] = useState<number>(
        route?.params?.amount ? Number(route?.params?.amount) : 1
    );
    const [submitInProgress, setSubmitInProgress] = useState(false);
    const [bottomSheetActive, setBottomSheetActive] = useState<boolean>(false);

    const { pickerValues } = LogSelectors();
    const { userProfile } = UserSelectors();

    useEffect(() => {
        dispatch(getLogPickerValues({}));
    }, [dispatch]);

    useEffect(() => {
        if (route.params?.unit) {
            setSelectedUnit(route.params.unit);
        } else if (pickerValues.weight.units.length > 0) {
            // sort the units so that ones that are part of the user's
            // preferred system will be first
            const orderedUnits = [...pickerValues.weight.units].sort(
                (a, _b) => {
                    if (a.system === userProfile?.preferred_units) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            );

            // pick the first unit
            setSelectedUnit(orderedUnits[0].unit);
        }
    }, [route.params?.unit, pickerValues, userProfile]);

    const onSubmit = useCallback(() => {
        if (moment(dateTime).isAfter(moment())) {
            Toast.show({
                type: 'errorResponse',
                text1: Constants.errors.futureTime,
                position: 'bottom'
            });
            return;
        }

        if (!isUnitValid(weight)) {
            Toast.show({
                type: 'errorResponse',
                text1: Constants.errors.logValue,
                position: 'bottom'
            });
            return;
        }

        // this will currently never happen since there is no selection
        // component for units, but there may be in the future
        if (!selectedUnit) {
            Toast.show({
                type: 'errorResponse',
                text1: 'Please select a unit',
                position: 'bottom'
            });
            return;
        }

        setSubmitInProgress(true);
        dispatch(
            route?.params?.id
                ? updateLogWeight({
                      logTime: moment(dateTime).format('YYYY-MM-DDTHH:mm:[00]'),
                      amount: weight,
                      unit: selectedUnit,
                      logId: route?.params?.id
                  })
                : createLogWeight({
                      logTime: moment(dateTime).format('YYYY-MM-DDTHH:mm:[00]'),
                      amount: weight,
                      unit: selectedUnit
                  })
        )
            .unwrap()
            .then(() => {
                dispatch(getDailyCompletedLogs({ date: new Date() }));

                Toast.show({
                    type: 'successResponse',
                    text1: route?.params?.id
                        ? 'log updated successfully'
                        : 'Logged Successfully',
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
    }, [
        dateTime,
        dispatch,
        navigation,
        weight,
        route.params?.id,
        selectedUnit
    ]);

    const onDeleteLogWeight = useCallback(() => {
        dispatch(
            deleteLogWeight({
                logId: route?.params?.id + ''
            })
        )
            .unwrap()
            .then(() => {
                dispatch(getDailyCompletedLogs({ date: new Date() }));
                Toast.show({
                    type: 'successResponse',
                    text1: 'User weight log deleted successfully.',
                    position: 'bottom'
                });
                if (navigation.canGoBack()) {
                    navigation.goBack();
                }
            })
            .catch((error: any) => {
                Toast.show({
                    type: 'errorResponse',
                    text1: error.message || 'Something went wrong!',
                    position: 'bottom'
                });
            });
    }, [route?.params?.id, dispatch, navigation]);

    return (
        <SafeAreaView style={styles.root}>
            <CustomStatusBar />
            <Header
                title="Log Weight"
                leftIcon={BackIcon}
                onLeftBtnPress={() =>
                    route?.params
                        ? onDiscardBottomSheetRef?.current?.open()
                        : navigation.pop()
                }
                rightBtnText={route?.params ? 'Delete' : ''}
                onRightBtnPress={() => onDeleteBottomSheetRef?.current?.open()}
            />
            <ScrollView style={styles.contentWrapper}>
                <View style={styles.content}>
                    <View>
                        <LogUnitPicker
                            title="How much do you weigh?"
                            value={weight}
                            unit={selectedUnit}
                            onDecrementHandler={() =>
                                setWeight(Math.max(formatNumber(weight - 1), 1))
                            }
                            onIncrementHandler={() =>
                                setWeight(formatNumber(weight + 1))
                            }
                            onChangeHandler={(value: number) =>
                                setWeight(Math.max(1, Number(value)))
                            }
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
                    bordered={false}
                    style={styles.logBtn}
                    onPress={onSubmit}
                    disabled={submitInProgress}
                >
                    <Text fontWeight="600" size={14} color={Colors.text.white}>
                        {route?.params ? 'Save' : 'Log Weight'}
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
                    onDeleteLogWeight();
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

export default LogWeight;
