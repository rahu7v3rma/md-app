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
import Toast from 'react-native-toast-message';

import { BackIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import {
    createLogWaterIntake,
    deleteWaterInTakeLog,
    getDailyCompletedLogs,
    getLogPickerValues,
    LogSelectors,
    updateLogWaterIntake
} from '@/reducers/log';
import { UserSelectors } from '@/reducers/user';
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
import { formatNumber, isUnitValid } from '@/utils/helper';

type Props = Record<string, never>;
type LogWaterIntakeProp = RouteProp<RootStackParamList, 'LogWaterIntake'>;

const LogWaterIntake: FunctionComponent<Props> = ({}: Props) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();
    const route = useRoute<LogWaterIntakeProp>();

    const onDeleteBottomSheetRef = useRef<RBSheet>(null);
    const onDiscardBottomSheetRef = useRef<RBSheet>(null);

    const [waterIntake, setWaterIntake] = useState<number>(
        Number(route?.params?.amount || 1)
    );
    const [dateTime, setDateTime] = useState<Date>(
        route?.params?.log_time
            ? moment(route.params.log_time, 'YYYY-MM-DD HH:mm:s').toDate()
            : moment().toDate()
    );
    const [units, setUnits] = useState<LogInputValue[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<LogInputValue | null>(
        null
    );
    const [submitInProgress, setSubmitInProgress] = useState(false);
    const [bottomSheetActive, setBottomSheetActive] = useState<boolean>(false);

    const { pickerValues } = LogSelectors();
    const { userProfile } = UserSelectors();

    useEffect(() => {
        dispatch(getLogPickerValues({}));
    }, [dispatch]);

    useEffect(() => {
        setUnits(
            pickerValues.hydration.units.map((u, i) => ({
                id: i + 1,
                name: u.unit
            }))
        );
    }, [pickerValues]);

    useEffect(() => {
        if (route.params?.unit) {
            const foundUnit = units.find((u) => u.name === route.params?.unit);
            if (foundUnit) {
                setSelectedUnit(foundUnit);
            }
        } else if (pickerValues.hydration.units.length > 0) {
            // sort the units so that ones that are part of the user's
            // preferred system will be first
            const orderedUnits = [...pickerValues.hydration.units].sort(
                (a, _b) => {
                    if (a.system === userProfile?.preferred_units) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            );

            // pick the first unit
            const foundUnit = units.find(
                (u) => u.name === orderedUnits[0].unit
            );
            if (foundUnit) {
                setSelectedUnit(foundUnit);
            }
        }
    }, [route.params?.unit, units, pickerValues, userProfile]);

    const submitHandler = useCallback(() => {
        if (!isUnitValid(waterIntake)) {
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
        if (!selectedUnit) {
            Toast.show({
                type: 'errorResponse',
                text1: 'Please select Unit!',
                position: 'bottom'
            });
            return;
        }

        setSubmitInProgress(true);
        dispatch(
            route?.params?.id
                ? updateLogWaterIntake({
                      id: route.params.id,
                      log_time: moment(dateTime).format(
                          'YYYY-MM-DDTHH:mm:[00]'
                      ),
                      amount: waterIntake,
                      unit: selectedUnit.name
                  })
                : createLogWaterIntake({
                      log_time: moment(dateTime).format(
                          'YYYY-MM-DDTHH:mm:[00]'
                      ),
                      amount: waterIntake,
                      unit: selectedUnit.name
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
        route?.params?.id,
        selectedUnit,
        waterIntake
    ]);

    const onDeleteWaterInTakeLog = useCallback(() => {
        dispatch(
            deleteWaterInTakeLog({
                logId: route?.params?.id + ''
            })
        )
            .unwrap()
            .then(() => {
                dispatch(getDailyCompletedLogs({ date: new Date() }));
                Toast.show({
                    type: 'successResponse',
                    text1: 'User Hydration log deleted successfully.',
                    position: 'bottom'
                });
                if (navigation.canGoBack()) {
                    navigation.goBack();
                }
            })
            .catch((error: any) => {
                Toast.show({
                    type: 'errorResponse',
                    text1: error?.message || 'Something went wrong!',
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
                title="Log Hydration"
                rightBtnText={route?.params ? 'Delete' : ''}
                onRightBtnPress={() => onDeleteBottomSheetRef?.current?.open()}
            />
            <ScrollView style={styles.contentWrapper}>
                <View style={styles.content}>
                    <View>
                        <LogUnitPicker
                            title="How much water did you drink?"
                            value={waterIntake}
                            unit={selectedUnit?.name}
                            onDecrementHandler={() =>
                                setWaterIntake(
                                    Math.max(formatNumber(waterIntake - 1), 0)
                                )
                            }
                            onIncrementHandler={() =>
                                setWaterIntake(formatNumber(waterIntake + 1))
                            }
                            onChangeHandler={(value: number) =>
                                setWaterIntake(Math.max(0, Number(value)))
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
                        <LogInputDropdown
                            fieldName="Units"
                            selectedValue={selectedUnit?.id}
                            labelKey="name"
                            valueKey="id"
                            onSelect={(selected) => setSelectedUnit(selected)}
                            options={units}
                            disabled={bottomSheetActive}
                            onPressInput={() => setBottomSheetActive(true)}
                            onClose={() => setBottomSheetActive(false)}
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
                    onPress={submitHandler}
                    disabled={submitInProgress}
                >
                    <Text color={Colors.text.white} fontWeight="600">
                        {route?.params ? 'Save' : 'Log Hydration'}
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
                    onDeleteWaterInTakeLog();
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

export default LogWaterIntake;

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
