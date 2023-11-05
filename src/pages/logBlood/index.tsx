import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useRef,
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
import { Toast } from 'react-native-toast-message/lib/src/Toast';

import { BackIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import {
    createLogBlood,
    deleteBloodLog,
    getDailyCompletedLogs,
    getLogPickerValues,
    LogSelectors,
    updateLogBlood
} from '@/reducers/log';
import { UserSelectors } from '@/reducers/user';
import Button from '@/shared/button';
import ConfirmationDialogue from '@/shared/confirmationDialogue';
import CustomStatusBar from '@/shared/customStatusBar';
import Header from '@/shared/header';
import LogInputDatePicker from '@/shared/logInputDatePicker';
import LogInputDropdown from '@/shared/logInputDropdown';
import LogTimePicker from '@/shared/logTimePicker';
import LogUnitPicker from '@/shared/logUnitPicker';
import Text from '@/shared/text';
import { Colors } from '@/theme/colors';
import { LogInputValue } from '@/types/log';
import { Constants } from '@/utils/constants';
import { isUnitValid } from '@/utils/helper';

type Props = Record<string, never>;
type LogBloodProp = RouteProp<RootStackParamList, 'LogBlood'>;

const LogBlood: FunctionComponent<Props> = ({}: Props) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();
    const route = useRoute<LogBloodProp>();

    const onDeleteBottomSheetRef = useRef<RBSheet>(null);
    const onDiscardBottomSheetRef = useRef<RBSheet>(null);

    const [bloodGlucose, setBloodGlucose] = useState<number>(
        Number(route?.params?.amount || 100)
    );
    const [dateTime, setDateTime] = useState<Date>(
        route?.params?.log_time
            ? moment(route.params.log_time, 'YYYY-MM-DD HH:mm:s').toDate()
            : moment().toDate()
    );
    const [measurementTypes, setMeasurementTypes] = useState<LogInputValue[]>(
        []
    );
    const [selectedMeasurementType, setSelectedMeasurementType] =
        useState<LogInputValue | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<string | undefined>(
        undefined
    );

    const { pickerValues } = LogSelectors();
    const { userProfile } = UserSelectors();

    useEffect(() => {
        dispatch(getLogPickerValues({}));
    }, [dispatch]);

    useEffect(() => {
        setMeasurementTypes(
            pickerValues.glucose.measurement_types.map((mt, i) => ({
                id: i + 1,
                name: mt
            }))
        );
    }, [pickerValues]);

    useEffect(() => {
        if (route.params?.measurement_type) {
            const foundMeasurementType = measurementTypes.find(
                (mt) => mt.name === route.params?.measurement_type
            );
            if (foundMeasurementType) {
                setSelectedMeasurementType(foundMeasurementType);
            }
        }

        if (route.params?.unit) {
            setSelectedUnit(route.params.unit);
        } else if (pickerValues.glucose.units.length > 0) {
            // sort the units so that ones that are part of the user's
            // preferred system will be first
            const orderedUnits = [...pickerValues.glucose.units].sort(
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
    }, [
        route.params?.measurement_type,
        measurementTypes,
        route.params?.unit,
        pickerValues.glucose.units,
        userProfile
    ]);

    const [submitInProgress, setSubmitInProgress] = useState(false);
    const onSubmit = useCallback(() => {
        if (!isUnitValid(bloodGlucose)) {
            Toast.show({
                type: 'errorResponse',
                text1: Constants.errors.logValue,
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

        if (!selectedMeasurementType) {
            Toast.show({
                type: 'errorResponse',
                text1: 'Please select Type.',
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
                ? updateLogBlood({
                      id: route?.params?.id,
                      logTime: moment(dateTime).format('YYYY-MM-DDTHH:mm:[00]'),
                      amount: bloodGlucose,
                      unit: selectedUnit,
                      measurementType: selectedMeasurementType.name
                  })
                : createLogBlood({
                      logTime: moment(dateTime).format('YYYY-MM-DDTHH:mm:[00]'),
                      amount: bloodGlucose,
                      unit: selectedUnit,
                      measurementType: selectedMeasurementType.name
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
    }, [
        bloodGlucose,
        dateTime,
        dispatch,
        navigation,
        route?.params?.id,
        selectedMeasurementType,
        selectedUnit
    ]);

    const onDeleteBloodLog = useCallback(() => {
        dispatch(
            deleteBloodLog({
                logId: route?.params?.id + ''
            })
        )
            .unwrap()
            .then(() => {
                dispatch(getDailyCompletedLogs({ date: new Date() }));
                Toast.show({
                    type: 'successResponse',
                    text1: 'User blood glucose log deleted successfully.',
                    position: 'bottom'
                });
                if (navigation.canGoBack()) {
                    navigation.goBack();
                }
            })
            .catch((error: any) => {
                Toast.show({
                    type: 'errorResponse',
                    text1: error?.data?.message || 'Something went wrong!',
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
                    title="Log Blood Glucose"
                    rightBtnText={route?.params ? 'Delete' : ''}
                    onRightBtnPress={() =>
                        onDeleteBottomSheetRef?.current?.open()
                    }
                />
                <ScrollView style={styles.contentWrapper}>
                    <View style={styles.content}>
                        <View>
                            <LogUnitPicker
                                title="What was your blood glucose level?"
                                value={bloodGlucose}
                                unit={selectedUnit}
                                onDecrementHandler={() => {
                                    const value =
                                        bloodGlucose > 0 ? bloodGlucose - 1 : 0;
                                    setBloodGlucose(value);
                                }}
                                onIncrementHandler={() => {
                                    const value =
                                        bloodGlucose >= 0
                                            ? bloodGlucose + 1
                                            : 0;
                                    setBloodGlucose(value);
                                }}
                                onChangeHandler={(value: number) =>
                                    setBloodGlucose(Math.max(0, Number(value)))
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
                                fieldName="Type"
                                selectedValue={selectedMeasurementType?.id}
                                labelKey="name"
                                valueKey="id"
                                onSelect={(selected) =>
                                    setSelectedMeasurementType(selected)
                                }
                                options={measurementTypes}
                            />
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.logBtnWrapper}>
                    <Button
                        testID="submitButton"
                        primary
                        style={styles.logBtn}
                        onPress={onSubmit}
                        bordered={false}
                        disabled={submitInProgress}
                    >
                        <Text color={Colors.text.white} fontWeight="600">
                            {route?.params ? 'Save' : 'Log Blood Glucose'}
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
                        onDeleteBloodLog();
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

export default LogBlood;

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
