import moment from 'moment';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';

import Button from '@/shared/button';
import Text, { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

export type TimePickerModalElement = {
    openTimePickerModal: () => void;
};

type Props = {
    selectedValue: Date;
    onSelect?: (time: Date) => void;
    locale?: string;
    timeZoneOffsetInMinutes?: number;
    disMissModal?: () => void;
    shouldAllowZeroTime?: boolean;
};
const TimePickerModal = React.forwardRef(
    (
        {
            selectedValue,
            onSelect,
            locale,
            timeZoneOffsetInMinutes,
            disMissModal,
            shouldAllowZeroTime = true
        }: Props,
        ref
    ) => {
        const [showModal, setShowModal] = useState<boolean>(false);
        const [pickerTime, setPickerTime] = useState<Date>(selectedValue);

        useImperativeHandle(
            ref,
            () =>
                ({
                    openTimePickerModal: () => {
                        setShowModal(true);
                        setPickerTime(selectedValue);
                    }
                } as TimePickerModalElement)
        );
        useEffect(() => {
            setPickerTime(selectedValue);
        }, [selectedValue]);

        return (
            <Modal
                isVisible={showModal}
                onSwipeComplete={() => {
                    disMissModal && disMissModal();
                    setShowModal(false);
                }}
                animationOut={'slideOutDown'}
                swipeDirection={'down'}
                style={styles.modal}
                testID="timePickerModal"
            >
                <View style={styles.bottomedView} testID="timerPickerContainer">
                    <View
                        style={styles.mask}
                        onTouchEnd={() => {
                            disMissModal && disMissModal();
                            setShowModal(false);
                        }}
                    >
                        <TouchableOpacity style={styles.modalHandle} />
                    </View>
                    <View style={styles.modalView}>
                        <Text
                            style={styles.title}
                            color={Colors.text.black}
                            size={Size.XXSmall}
                            fontWeight="700"
                            testID={'title'}
                        >
                            {locale === 'en_GB'
                                ? 'Select Fast Duration'
                                : 'Select Start Time'}
                        </Text>
                        <View style={styles.picker}>
                            <View
                                style={[
                                    styles.textContainerStyle,
                                    locale === 'en_GB' &&
                                        styles.textContainerStyleLocal
                                ]}
                            >
                                <Text style={styles.textStyle}>:</Text>
                            </View>
                            <DatePicker
                                date={pickerTime}
                                mode="time"
                                onDateChange={(date) => {
                                    setPickerTime(date);
                                }}
                                timeZoneOffsetInMinutes={
                                    timeZoneOffsetInMinutes
                                }
                                is24hourSource="locale"
                                locale={locale}
                                textColor={Colors.text.black}
                            />
                        </View>
                        <Button
                            disabled={
                                !shouldAllowZeroTime &&
                                moment(pickerTime)
                                    .utc(Platform.OS === 'ios')
                                    .format('H:mm') === '0:00'
                            }
                            block
                            primary
                            style={styles.saveBtn}
                            bordered={false}
                            onPress={() => {
                                setShowModal(false);
                                disMissModal && disMissModal();
                                onSelect && onSelect(pickerTime);
                            }}
                            testID="saveBtn"
                        >
                            <Text
                                size={Size.XXSmall}
                                fontWeight="600"
                                color={Colors.text.white}
                            >
                                Save
                            </Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }
);

export default TimePickerModal;

const styles = StyleSheet.create({
    modal: {
        margin: 0
    },
    container: {
        flex: 1
    },
    bottomedView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: 'absolute',
        zIndex: 1000,
        transform: [{ translateY: 0 }]
    },
    backDropView: {
        flex: 1,
        width: Dimensions.get('window').width
    },
    modalView: {
        marginHorizontal: 8,
        backgroundColor: Colors.text.white,
        borderRadius: 48,
        width: '94%',
        paddingHorizontal: 20,
        paddingTop: 48,
        paddingBottom: 48,
        overflow: 'scroll',
        marginBottom: 32
    },
    mask: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    modalHandle: {
        backgroundColor: Colors.modals.close_handle,
        width: 60,
        height: 6,
        marginBottom: 12,
        borderRadius: 3
    },
    title: {
        height: 56,
        textAlign: 'center'
    },
    picker: {
        alignItems: 'center',
        marginBottom: 30
    },
    saveBtn: {
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14
    },
    textContainerStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainerStyleLocal: {
        left: '15%'
    },
    textStyle: {
        marginRight: Platform.OS === 'android' ? 52 : 72
    }
});
