import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, { FunctionComponent, useCallback, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-toast-message';

import BackIcon from '@/assets/svgs/Back';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import ImagePicker from '@/pages/logMeal/components/imagePicker';
import {
    createLogMeal,
    deleteMealLog,
    getDailyCompletedLogs,
    updateLogMeal
} from '@/reducers/log';
import { UserSelectors } from '@/reducers/user';
import { uploadImage } from '@/services/image';
import {
    Button,
    ConfirmationDialogue,
    CustomStatusBar,
    Header,
    LogTimePicker,
    Text
} from '@/shared';
import LogInputDatePicker from '@/shared/logInputDatePicker';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { Constants } from '@/utils/constants';

type Props = Record<string, never>;
type LogMealProps = RouteProp<RootStackParamList, 'LogMeal'>;

const LogMeal: FunctionComponent<Props> = ({}: Props) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<RootNavigationProp>();
    const route = useRoute<LogMealProps>();
    const onDeleteBottomSheetRef = useRef<RBSheet>(null);
    const onDiscardBottomSheetRef = useRef<RBSheet>(null);
    const [dateTime, setDateTime] = useState<Date>(
        route?.params?.log_time
            ? moment(route.params.log_time, 'YYYY-MM-DD HH:mm:s').toDate()
            : moment().toDate()
    );
    const [image, setImage] = useState({ data: '', mime: '' });
    const [bottomSheetActive, setBottomSheetActive] = useState<boolean>(false);

    const { userInfo } = UserSelectors();

    const [submitInProgress, setSubmitInProgress] = useState(false);

    const createOrUpdateMealPlan = useCallback(
        (uploadedImageName: string) => {
            dispatch(
                route?.params?.id
                    ? updateLogMeal({
                          id: route?.params?.id,
                          logTime: moment(dateTime).format(
                              'YYYY-MM-DDTHH:mm:[00]'
                          ),
                          image: uploadedImageName
                      })
                    : createLogMeal({
                          logTime: moment(dateTime).format(
                              'YYYY-MM-DDTHH:mm:[00]'
                          ),
                          image: uploadedImageName
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
        },
        [route?.params?.id, dispatch, dateTime, navigation]
    );

    const onSubmit = useCallback(() => {
        if (moment(dateTime).isAfter(moment())) {
            Toast.show({
                type: 'errorResponse',
                text1: Constants.errors.futureTime,
                position: 'bottom'
            });
            return;
        }

        setSubmitInProgress(true);
        if (!image.data) {
            createOrUpdateMealPlan('');
        } else {
            uploadImage(image.data!, image.mime, userInfo!.username, false)
                .then((uploadedImageName) => {
                    createOrUpdateMealPlan(uploadedImageName);
                })
                .catch(() => {
                    Toast.show({
                        type: 'errorResponse',
                        text1: 'Image upload failed, please try again',
                        position: 'bottom'
                    });
                })
                .finally(() => setSubmitInProgress(false));
        }
    }, [dateTime, image.data, image.mime, userInfo, createOrUpdateMealPlan]);

    const onDeleteMealLog = useCallback(() => {
        dispatch(
            deleteMealLog({
                logId: route?.params?.id + ''
            })
        )
            .unwrap()
            .then(() => {
                dispatch(getDailyCompletedLogs({ date: new Date() }));
                Toast.show({
                    type: 'successResponse',
                    text1: 'User logged meal deleted successfully.',
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
                title="Log a Meal"
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
                        <Text
                            style={styles.title}
                            fontWeight="700"
                            size={Size.Large}
                        >
                            What did you eat?
                        </Text>
                        <ImagePicker
                            onImagePicked={(data: string, mime: string) =>
                                setImage({ data, mime })
                            }
                            imageSource={route?.params?.image}
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
                    onPress={onSubmit}
                    style={styles.logBtn}
                    disabled={submitInProgress || !image.data}
                >
                    <Text color={Colors.text.white}>
                        {route?.params ? 'Save' : 'Log a Meal'}
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
                    onDeleteMealLog();
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

export default LogMeal;
