import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
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
    deleteLogMedication,
    getDailyCompletedLogs,
    getLogPickerValues,
    logMedication,
    LogSelectors,
    storeDefaultMedicationValues,
    updateLogMedication
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

type Props = Record<string, never>;
type LogMedicationProps = RouteProp<RootStackParamList, 'LogMedication'>;

const LogMedication: FunctionComponent<Props> = ({}: Props) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();
    const route = useRoute<LogMedicationProps>();

    const onDeleteBottomSheetRef = useRef<RBSheet>(null);
    const onDiscardBottomSheetRef = useRef<RBSheet>(null);

    const [medication, setMedication] = useState<number>(0);
    const [dateTime, setDateTime] = useState<Date>(moment().toDate());
    const [drugs, setDrugs] = useState<LogInputValue[]>([]);
    const [selectedDrug, setSelectedDrug] = useState<LogInputValue | null>(
        null
    );
    const [doses, setDoses] = useState<LogInputValue[]>([]);
    const [selectedDose, setSelectedDose] = useState<LogInputValue | null>(
        null
    );

    const [submitInProgress, setSubmitInProgress] = useState(false);

    const { defaultLogMedicationValues, pickerValues } = LogSelectors();
    const { userProfile } = UserSelectors();

    useEffect(() => {
        dispatch(getLogPickerValues({}));
    }, [dispatch]);

    useEffect(() => {
        setDrugs(
            pickerValues.medication.drugs.map((md, i) => ({
                id: i + 1,
                name: md
            }))
        );
        setDoses(
            pickerValues.medication.doses.map((md, i) => ({
                id: i + 1,
                name: md.unit
            }))
        );
    }, [pickerValues]);

    useEffect(() => {
        if (route.params?.drug_name) {
            const foundDrug = drugs.find(
                (md) => md.name === route.params?.drug_name
            );
            if (foundDrug) {
                setSelectedDrug(foundDrug);
            }
        } else if (defaultLogMedicationValues?.drug) {
            const foundDrug = drugs.find(
                (md) => md.name === defaultLogMedicationValues?.drug
            );
            if (foundDrug) {
                setSelectedDrug(foundDrug);
            }
        }

        if (route.params?.dose) {
            const foundDose = doses.find(
                (md) => md.name === route.params?.dose
            );
            if (foundDose) {
                setSelectedDose(foundDose);
            }
        } else if (defaultLogMedicationValues?.dose) {
            const foundDose = doses.find(
                (md) => md.name === defaultLogMedicationValues?.dose
            );
            if (foundDose) {
                setSelectedDose(foundDose);
            }
        } else if (pickerValues.medication.doses.length > 0) {
            // sort the doeses so that ones that are part of the user's
            // preferred system will be first
            const orderedDoses = [...pickerValues.medication.doses].sort(
                (a, _b) => {
                    if (a.system === userProfile?.preferred_units) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            );

            // pick the first dose
            const foundDose = doses.find(
                (md) => md.name === orderedDoses[0].unit
            );
            if (foundDose) {
                setSelectedDose(foundDose);
            }
        }

        if (route.params?.amount) {
            setMedication(Number(route.params.amount));
        } else if (defaultLogMedicationValues?.medication) {
            setMedication(defaultLogMedicationValues.medication);
        }

        if (route.params?.log_time) {
            setDateTime(
                moment(route.params.log_time, 'YYYY-MM-DD HH:mm:s').toDate()
            );
        }
    }, [
        route.params?.drug_name,
        drugs,
        route.params?.dose,
        doses,
        pickerValues.medication.doses,
        defaultLogMedicationValues,
        userProfile,
        route.params?.amount,
        route.params?.log_time
    ]);

    const onSubmit = () => {
        if (moment(dateTime).isAfter(moment())) {
            Toast.show({
                type: 'errorResponse',
                text1: Constants.errors.futureTime,
                position: 'bottom'
            });
            return;
        }
        if (!selectedDrug) {
            Toast.show({
                type: 'errorResponse',
                text1: 'Please select a medication!',
                position: 'bottom'
            });
            return;
        }

        if (!selectedDose) {
            Toast.show({
                type: 'errorResponse',
                text1: 'Please select a Dose!',
                position: 'bottom'
            });
            return;
        }

        setSubmitInProgress(true);
        dispatch(
            route?.params?.id
                ? updateLogMedication({
                      id: route?.params?.id,
                      logTime: moment(dateTime).format('YYYY-MM-DDTHH:mm:[00]'),
                      amount: medication,
                      drugName: selectedDrug.name,
                      dose: selectedDose.name
                  })
                : logMedication({
                      logTime: moment(dateTime).format('YYYY-MM-DDTHH:mm:[00]'),
                      amount: medication,
                      drugName: selectedDrug.name,
                      dose: selectedDose.name
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
                dispatch(
                    storeDefaultMedicationValues({
                        medication: medication,
                        drug: selectedDrug.name,
                        dose: selectedDose.name
                    })
                );
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
    };

    const onDeleteHandler = () => {
        if (route?.params) {
            dispatch(
                deleteLogMedication({
                    logId: route.params.id + ''
                })
            )
                .unwrap()
                .then(() => {
                    dispatch(getDailyCompletedLogs({ date: new Date() }));
                    Toast.show({
                        type: 'successResponse',
                        text1: 'User Medication log deleted successfully',
                        position: 'bottom'
                    });
                    navigation.navigate('Me');
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
                    title="Log Medication"
                    rightBtnText={route?.params ? 'Delete' : ''}
                    onRightBtnPress={() =>
                        onDeleteBottomSheetRef?.current?.open()
                    }
                />
                <ScrollView style={styles.contentWrapper}>
                    <View style={styles.content}>
                        <View>
                            <LogUnitPicker
                                title="What medication did you take?"
                                value={medication}
                                onDecrementHandler={() =>
                                    setMedication(
                                        medication > 1 ? medication - 1 : 1
                                    )
                                }
                                onIncrementHandler={() =>
                                    setMedication(medication + 1)
                                }
                                onChangeHandler={(value: number) =>
                                    setMedication(Math.max(1, Number(value)))
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
                                fieldName="Select Your Dose"
                                selectedValue={selectedDose?.id}
                                labelKey="name"
                                valueKey="id"
                                onSelect={(selected) =>
                                    setSelectedDose(selected)
                                }
                                options={doses}
                            />
                            <LogInputDropdown
                                fieldName="Select Your Medication"
                                selectedValue={selectedDrug?.id}
                                labelKey="name"
                                valueKey="id"
                                onSelect={(selected) =>
                                    setSelectedDrug(selected)
                                }
                                options={drugs}
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
                        onPress={onSubmit}
                        disabled={submitInProgress}
                    >
                        <Text color={Colors.text.white} fontWeight="600">
                            {route?.params ? 'Save' : 'Log Medication'}
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
                        onDeleteBottomSheetRef.current?.close();
                        // Calling the delete api
                        onDeleteHandler();
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

export default LogMedication;

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
