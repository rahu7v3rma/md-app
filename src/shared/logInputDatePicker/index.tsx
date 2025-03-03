import moment from 'moment';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text as TextNative,
    TouchableOpacity,
    View
} from 'react-native';
import { CalendarList } from 'react-native-calendars';
import RBSheet from 'react-native-raw-bottom-sheet';

import LogInput from '@/shared/logInput';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';
import { Constants } from '@/utils/constants';

type Props = {
    selectedDate?: string;
    onDateSelected: (date: Date) => void;
    onCalendarClosed?: () => void;
    disabled?: boolean;
    minDate?: string;
    onPressInput?: () => void;
};

const LogInputDatePicker: FunctionComponent<Props> = ({
    selectedDate,
    onDateSelected,
    onCalendarClosed,
    disabled,
    minDate,
    onPressInput
}: Props) => {
    const calendarRef = useRef(null);
    const [selectedDay, setSelectedDay] = useState(
        selectedDate
            ? moment(selectedDate).format('YYYY-MM-DD')
            : moment().format('YYYY-MM-DD')
    );
    const [value, setValue] = useState(
        selectedDate
            ? moment(selectedDate).format('DD MMM YYYY')
            : moment().format('DD MMM YYYY')
    );
    const bottomSheetRef = useRef<RBSheet>();

    useEffect(() => {
        setTimeout(() => {
            calendarRef?.current?.scrollToDay(
                new Date(moment(selectedDay).startOf('month').toString()),
                undefined,
                true
            );
        }, 500);
    }, [selectedDay]);

    const onPressSelectDate = (date: any) => {
        setSelectedDay(date);
        setValue(moment(date, 'YYYY-MM-DD').format('DD MMM YYYY'));
        onDateSelected(date);
        bottomSheetRef.current?.close();
    };

    const onPressLogInput = () => {
        onPressInput && onPressInput();
        bottomSheetRef.current?.open();
        setTimeout(() => {
            calendarRef?.current?.scrollToDay(
                new Date(moment(selectedDay).startOf('month').toString()),
                undefined,
                true
            );
        }, 500);
    };

    return (
        <React.Fragment>
            <LogInput
                fieldName="Date"
                value={value}
                onPress={disabled ? () => {} : onPressLogInput}
            />
            <RBSheet
                ref={bottomSheetRef}
                closeOnDragDown={true}
                dragFromTopOnly={true}
                closeOnPressMask={true}
                height={500}
                customStyles={{
                    wrapper: calendarStyle.wrapper,
                    container: calendarStyle.contentContainer,
                    draggableIcon: calendarStyle.draggableIcon
                }}
                closeDuration={0}
                testID="calendarSheet"
                onClose={onCalendarClosed}
            >
                <View
                    style={calendarStyle.calendarContainer}
                    testID="calendarContainer"
                >
                    <View style={calendarStyle.calendarHeader}>
                        <TextNative
                            style={calendarStyle.selectDateText}
                            maxFontSizeMultiplier={
                                Constants.maxFontSizeMultiplier
                            }
                        >
                            Select Date
                        </TextNative>
                        <TouchableOpacity
                            onPress={() => {
                                setSelectedDay(moment().format('YYYY-MM-DD'));
                                setValue(moment().format('DD MMM YYYY'));
                                calendarRef?.current?.scrollToDay(
                                    new Date(
                                        moment().startOf('month').toString()
                                    ),
                                    undefined,
                                    true
                                );
                                onDateSelected(
                                    new Date(moment().format('YYYY-MM-DD'))
                                );
                                bottomSheetRef.current?.close();
                            }}
                            style={calendarStyle.buttonToday}
                            testID="todayButton"
                        >
                            <TextNative
                                style={calendarStyle.todayText}
                                maxFontSizeMultiplier={
                                    Constants.maxFontSizeMultiplier
                                }
                            >
                                Today
                            </TextNative>
                        </TouchableOpacity>
                    </View>
                    <CalendarList
                        ref={calendarRef}
                        theme={{
                            selectedDayBackgroundColor: Colors.theme.primary,
                            'stylesheet.calendar.header': {
                                header: {},
                                monthText: {
                                    color: Colors.text.black,
                                    fontWeight: '700',
                                    fontSize: Size.XSmall
                                }
                            }
                        }}
                        markedDates={{
                            [selectedDay]: { selected: true }
                        }}
                        renderHeader={(date) => (
                            <TextNative
                                style={calendarStyle.dateStyle}
                                maxFontSizeMultiplier={
                                    Constants.maxFontSizeMultiplier
                                }
                            >
                                {moment(
                                    date.toISOString(),
                                    'YYYY-MM-DD'
                                ).format('MMM')}
                                .{' '}
                                {moment(
                                    date.toISOString(),
                                    'YYYY-MM-DD'
                                ).format('YYYY')}
                            </TextNative>
                        )}
                        onDayPress={(day) => {
                            onPressSelectDate(day.dateString);
                        }}
                        futureScrollRange={
                            selectedDate
                                ? moment().diff(
                                      moment(selectedDate).format('YYYY-MM-DD'),
                                      'months',
                                      true
                                  ) + 1
                                : 1
                        }
                        minDate={minDate}
                        maxDate={moment().format('YYYY-MM-DD')}
                        current={
                            selectedDate
                                ? moment(selectedDate).format('YYYY-MM-DD')
                                : moment().format('YYYY-MM-DD')
                        }
                        testID="calendar"
                    />
                </View>
            </RBSheet>
        </React.Fragment>
    );
};

const calendarStyle = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.theme.app_sheet_background_color
    },
    draggableIcon: {
        width: 60
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1,
        backgroundColor: 'transparent'
    },
    modal: {
        margin: 0
    },
    fullWidth: {
        width: '100%'
    },
    calendarWrapper: {
        backgroundColor: 'transparent',
        flex: 1
    },
    rectangleContainer: {
        width: 60,
        height: 10,
        marginTop: 60,
        marginBottom: 20,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 90,
        backgroundColor: Colors.modals.close_handle
    },
    calendarContainer: {
        backgroundColor: 'white',
        flex: 1,
        marginLeft: 8,
        marginRight: 8,
        borderTopLeftRadius: 48,
        borderTopRightRadius: 48,
        transform: [{ translateY: 0 }]
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        alignItems: 'center',
        paddingVertical: 20
    },
    selectDateText: {
        marginLeft: '25%',
        flex: 1,
        textAlign: 'center',
        color: Colors.text.black,
        fontSize: 14,
        fontWeight: '600'
    },
    todayText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.text_gray_black
    },
    buttonToday: {
        backgroundColor: Colors.input.light_back_color,
        paddingHorizontal: 17.5,
        paddingVertical: 18,
        marginRight: 16,
        borderRadius: 90,
        lineHeight: 20
    },
    dateStyle: {
        paddingLeft: 16,
        paddingVertical: 8,
        fontSize: Size.XXSmall,
        fontWeight: '600',
        color: Colors.text.black
    }
});

export default LogInputDatePicker;
