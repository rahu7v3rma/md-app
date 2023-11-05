import moment from 'moment';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Modal,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import DatePicker from 'react-native-date-picker';

import Minus from '@/assets/svg/minus';
import Plus from '@/assets/svg/plus';
import Button from '@/shared/button';
import Input from '@/shared/input';
import Text, { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

type Type = 'timer';

type Props = {
    title?: string;
    unit?: string;
    value: number;
    type?: Type;
    onIncrementHandler?: () => void;
    onDecrementHandler?: () => void;
    onChangeHandler?: (value: number) => void;
    valueTextTestID?: string;
    plusButtonTestID?: string;
    minusButtonTestID?: string;
    textInputTestID?: string;
    touchValueTestID?: string;
    hourTextTestID?: string;
    minTextTestID?: string;
    timerTouchTestID?: string;
    timePicModalTestID?: string;
};

const LogUnitPicker: FunctionComponent<Props> = ({
    title,
    unit,
    value,
    type,
    onIncrementHandler,
    onDecrementHandler,
    onChangeHandler = (_) => {},
    valueTextTestID,
    plusButtonTestID,
    minusButtonTestID,
    textInputTestID,
    touchValueTestID,
    hourTextTestID,
    minTextTestID,
    timerTouchTestID,
    timePicModalTestID
}: Props) => {
    const [timerPickerModal, setTimerPickerModal] = useState<boolean>(false);
    const [time, setTime] = useState<Date>(new Date());
    const [isUnitEditable, setUnitEditable] = useState<boolean>(false);
    const [hours, setHours] = useState<string>('');
    const [minutes, setMinutes] = useState<string>('');
    const textInputRef = useRef<TextInput>();

    useEffect(() => {
        const defaultTime = getTimeFromMins(value).split(':');
        setHours(defaultTime[0]);
        setMinutes(defaultTime[defaultTime.length - 1]);
        setTime(
            moment(new Date())
                .set({
                    hour: Number(defaultTime[0]),
                    minute: Number(defaultTime[defaultTime.length - 1])
                })
                .toDate()
        );
    }, [value]);

    useEffect(() => {
        if (isUnitEditable) {
            textInputRef.current?.focus();
        }
    }, [isUnitEditable, textInputRef]);

    const getTimeFromMins = (mins: number) => {
        let h = mins / 60;
        let m = mins % 60;
        return moment.utc().hours(h).minutes(m).format('H:mm');
    };

    const renderUnit = () => {
        return (
            <View style={styles.unitPicker}>
                {isUnitEditable ? (
                    <Input
                        textInputTestID={textInputTestID}
                        textInputRef={textInputRef}
                        textInputStyle={styles.inputText}
                        keyboardType="decimal-pad"
                        initialValue={value.toString()}
                        onChangeText={(text) => onChangeHandler(Number(text))}
                        onBlur={() => setUnitEditable(false)}
                        autoFocus
                    />
                ) : (
                    <TouchableOpacity
                        style={styles.units}
                        testID={touchValueTestID}
                        onPress={() => setUnitEditable(true)}
                    >
                        <Text
                            fontWeight="bold"
                            testID={valueTextTestID}
                            size={Size.XXXLarge}
                            color={Colors.text.dark_black}
                        >
                            {value}
                        </Text>
                    </TouchableOpacity>
                )}
                {unit && (
                    <Text
                        fontWeight="600"
                        size={Size.XXXSmall}
                        color={Colors.text.dark_black}
                    >
                        {unit}
                    </Text>
                )}
            </View>
        );
    };

    const renderTimer = () => {
        return (
            <View style={styles.timerPicker}>
                <TouchableOpacity
                    style={styles.time}
                    testID={timerTouchTestID}
                    onPress={() => setTimerPickerModal(true)}
                >
                    <Text
                        fontWeight="bold"
                        size={Size.XXXLarge}
                        testID={hourTextTestID}
                        color={Colors.text.dark_black}
                    >
                        {hours}
                    </Text>
                    <Text
                        fontWeight="bold"
                        size={Size.XXXLarge}
                        color={Colors.text.dark_black}
                    >
                        :
                    </Text>
                    <Text
                        fontWeight="bold"
                        testID={minTextTestID}
                        size={Size.XXXLarge}
                        color={Colors.text.dark_black}
                    >
                        {minutes}
                    </Text>
                </TouchableOpacity>
                <View style={styles.hoursMinutesView}>
                    <Text
                        fontWeight="600"
                        size={Size.XXXSmall}
                        color={Colors.text.dark_black}
                    >
                        hours
                    </Text>
                    <Text
                        fontWeight="600"
                        size={Size.XXXSmall}
                        color={Colors.text.dark_black}
                    >
                        minutes
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <React.Fragment>
            {title && (
                <Text fontWeight="bold" size={Size.Large} style={styles.title}>
                    {title}
                </Text>
            )}
            <View style={styles.content}>
                <TouchableOpacity
                    testID={minusButtonTestID}
                    onPress={onDecrementHandler}
                >
                    <Minus />
                </TouchableOpacity>
                {type ? renderTimer() : renderUnit()}
                <TouchableOpacity
                    testID={plusButtonTestID}
                    onPress={onIncrementHandler}
                >
                    <Plus />
                </TouchableOpacity>
            </View>
            {timerPickerModal && (
                <Modal
                    animated
                    animationType="fade"
                    testID={timePicModalTestID}
                    transparent
                    visible={true}
                    onRequestClose={() => setTimerPickerModal(false)}
                >
                    <TouchableWithoutFeedback
                        style={styles.container}
                        onPress={() => {
                            setTimerPickerModal(false);
                        }}
                    >
                        <View style={styles.bottomedView}>
                            <TouchableOpacity
                                style={styles.modalHandle}
                                onPress={() => {
                                    setTimerPickerModal(false);
                                }}
                            />
                            <View style={styles.modalView}>
                                <View style={styles.picker}>
                                    <View style={styles.textContainerStyle}>
                                        <Text>:</Text>
                                    </View>
                                    <DatePicker
                                        textColor={Colors.text.black}
                                        date={time}
                                        mode="time"
                                        onDateChange={(date) => {
                                            setTime(date);
                                            const newTime = moment(date)
                                                .format('H:mm')
                                                .split(':');
                                            setHours(newTime[0]);
                                            setMinutes(
                                                newTime[newTime.length - 1]
                                            );
                                            onChangeHandler(
                                                moment
                                                    .duration(
                                                        moment(date).format(
                                                            'HH:mm'
                                                        )
                                                    )
                                                    .asMinutes()
                                            );
                                        }}
                                        timeZoneOffsetInMinutes={undefined}
                                        locale="en_GB"
                                        is24hourSource="locale"
                                    />
                                </View>
                                <Button
                                    block
                                    primary
                                    style={styles.saveBtn}
                                    onPress={() => {
                                        setTimerPickerModal(false);
                                        setTime(time);
                                    }}
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
                    </TouchableWithoutFeedback>
                </Modal>
            )}
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        paddingTop: 15
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 15
    },
    unitPicker: {
        width: 214,
        paddingVertical: 20,
        backgroundColor: Colors.extras.white,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    timerPicker: {
        width: '54%',
        height: 102,
        backgroundColor: Colors.extras.white,
        borderRadius: 20,
        justifyContent: 'center'
    },
    time: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    hoursMinutesView: {
        flexDirection: 'row',
        justifyContent: 'space-around'
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
        backgroundColor: Colors.modals.backdrop
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
        marginBottom: Platform.OS === 'ios' ? 8 : 32
    },
    modalHandle: {
        backgroundColor: Colors.modals.close_handle,
        width: 60,
        height: 6,
        marginBottom: 12,
        borderRadius: 3
    },
    picker: {
        height: 220,
        alignItems: 'center'
    },
    saveBtn: {
        backgroundColor: Colors.theme.primary,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14
    },
    inputText: {
        padding: 0,
        textAlign: 'center',
        fontSize: 34,
        fontWeight: 'bold',
        color: Colors.text.dark_black
    },
    units: {
        display: 'flex',
        flexDirection: 'row',
        width: '50%',
        justifyContent: 'center'
    },
    textContainerStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Platform.OS === 'android' ? 36 : 0
    }
});

export default LogUnitPicker;
