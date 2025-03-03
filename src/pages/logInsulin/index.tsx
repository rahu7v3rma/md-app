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

import { BackIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import {
    createLogInsulin,
    deleteLogInsulin,
    getDailyCompletedLogs,
    getLogPickerValues,
    LogSelectors,
    updateLogInsulin
} from '@/reducers/log';
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
import { formatNumber, isUnitValid } from '@/utils/helper';

type Props = Record<string, never>;
type LogInsulinProp = RouteProp<RootStackParamList, 'LogInsulin'>;

const LogInsulin: FunctionComponent<Props> = ({}: Props) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();
    const route = useRoute<LogInsulinProp>();

    const onDeleteBottomSheetRef = useRef<RBSheet>(null);
    const onDiscardBottomSheetRef = useRef<RBSheet>(null);
    const [insulin, setInsulin] = useState<number>(
        Number(route?.params?.units || 1)
    );
    const [dateTime, setDateTime] = useState<Date>(
        route?.params?.log_time
            ? moment(route.params.log_time, 'YYYY-MM-DD HH:mm:s').toDate()
            : moment().toDate()
    );
    const [injectionTypes, setInjectionTypes] = useState<LogInputValue[]>([]);
    const [selectedInjectionType, setSelectedInjectionType] =
        useState<LogInputValue | null>(null);
    const [bottomSheetActive, setBottomSheetActive] = useState<boolean>(false);

    const { pickerValues } = LogSelectors();

    useEffect(() => {
        dispatch(getLogPickerValues({}));
    }, [dispatch]);

    useEffect(() => {
        setInjectionTypes(
            pickerValues.insulin.injection_types.map((it, i) => ({
                id: i + 1,
                name: it
            }))
        );
    }, [pickerValues]);
    const [submitInProgress, setSubmitInProgress] = useState(false);

    useEffect(() => {
        if (route.params?.injection_type) {
            const foundInjectionType = injectionTypes.find(
                (it) => it.name === route.params?.injection_type
            );
            if (foundInjectionType) {
                setSelectedInjectionType(foundInjectionType);
            }
        }
    }, [route.params?.injection_type, injectionTypes]);

    const onSubmit = useCallback(() => {
        if (!isUnitValid(insulin)) {
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

        if (!selectedInjectionType) {
            Toast.show({
                type: 'errorResponse',
                text1: 'Please select Type.',
                position: 'bottom'
            });
            return;
        }

        setSubmitInProgress(true);
        dispatch(
            route?.params?.id
                ? updateLogInsulin({
                      id: route?.params?.id,
                      logTime: moment(dateTime).format('YYYY-MM-DDTHH:mm:[00]'),
                      units: insulin,
                      injectionType: selectedInjectionType.name
                  })
                : createLogInsulin({
                      logTime: moment(dateTime).format('YYYY-MM-DDTHH:mm:[00]'),
                      units: insulin,
                      injectionType: selectedInjectionType.name
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
        selectedInjectionType,
        dispatch,
        route?.params?.id,
        dateTime,
        insulin,
        navigation
    ]);

    const onDelete = () => {
        onDeleteBottomSheetRef.current?.close();
        if (route?.params?.id) {
            dispatch(deleteLogInsulin({ id: route.params.id }))
                .unwrap()
                .then(() => {
                    dispatch(getDailyCompletedLogs({ date: new Date() }));

                    Toast.show({
                        type: 'successResponse',
                        text1: 'Log deleted successfully!',
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
                });
        }
    };

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
                title="Log Insulin"
                rightBtnText={route?.params ? 'Delete' : ''}
                onRightBtnPress={() => onDeleteBottomSheetRef?.current?.open()}
            />
            <ScrollView style={styles.contentWrapper}>
                <View style={styles.content}>
                    <View>
                        <LogUnitPicker
                            title="How much insulin did you inject?"
                            value={insulin}
                            unit="Units"
                            onDecrementHandler={() =>
                                setInsulin(
                                    Math.max(formatNumber(insulin - 1), 0)
                                )
                            }
                            onIncrementHandler={() =>
                                setInsulin(formatNumber(insulin + 1))
                            }
                            onChangeHandler={(value: number) =>
                                setInsulin(Math.max(0, Number(value)))
                            }
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
                            fieldName="Type"
                            selectedValue={selectedInjectionType?.id}
                            labelKey="name"
                            valueKey="id"
                            onSelect={(selected) =>
                                setSelectedInjectionType(selected)
                            }
                            options={injectionTypes}
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
                    onPress={onSubmit}
                    style={styles.logBtn}
                    bordered={false}
                    disabled={submitInProgress}
                >
                    <Text color={Colors.text.white} fontWeight="600">
                        {route?.params ? 'Save' : 'Log Insulin'}
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
                onConfirmBtnHandler={onDelete}
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

export default LogInsulin;

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
