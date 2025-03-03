/*
<LogTimePicker
    style={{ marginHorizontal: 16 }}
    fieldName="Start Time"
    selectedValue={new Date()}
    onSelect={(time) => {
        console.log("Selected Time::", time.toISOString());
    }}
/>
*/

import moment from 'moment';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';

import { TrackSelectors } from '@/reducers/track';
import { Constants } from '@/utils/constants';

import LogInput from '../logInput';
import TimePickerModal, { TimePickerModalElement } from '../timePickerModal';

type Props = {
    fieldName: string;
    selectedValue: Date;
    style?: StyleProp<ViewStyle>;
    onSelect?: (time: Date) => void;
    displayTime?: string;
    timeZoneOffsetInMinutes?: number;
    locale?: string;
    customTitle?: string;
    disabled?: boolean;
    onPressInput?: () => void;
    onDismissBottomSheet?: () => void;
};
const stateTypes = Constants.trackFast.state;
const LogTimePicker: FunctionComponent<Props> = ({
    fieldName,
    selectedValue,
    style,
    onSelect,
    displayTime,
    timeZoneOffsetInMinutes,
    customTitle,
    disabled,
    onPressInput,
    onDismissBottomSheet
}: Props) => {
    const { trackFastState } = TrackSelectors();

    const [time, setTime] = useState<Date>(selectedValue);
    const [pickerTime, setPickerTime] = useState<Date>(selectedValue);
    const trackFastTimerRef = React.useRef<TimePickerModalElement>(null);

    useEffect(() => {
        setTime(selectedValue);
        setPickerTime(moment(selectedValue).utcOffset(0, true).toDate());
    }, [selectedValue]);
    return (
        <>
            <LogInput
                style={style}
                fieldName={fieldName}
                value={
                    customTitle && !displayTime
                        ? customTitle
                        : displayTime
                        ? displayTime
                        : moment(time)
                              .utc(Platform.OS === 'ios')
                              .format('HH:mm')
                }
                onPress={() => {
                    if (trackFastState === stateTypes.empty && !disabled) {
                        trackFastTimerRef.current?.openTimePickerModal();
                        setPickerTime(time);
                    }
                    onPressInput && onPressInput();
                }}
            />
            <TimePickerModal
                ref={trackFastTimerRef}
                selectedValue={pickerTime}
                onSelect={onSelect}
                locale={'en_US'}
                timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
                disMissModal={onDismissBottomSheet}
            />
        </>
    );
};

export default LogTimePicker;
