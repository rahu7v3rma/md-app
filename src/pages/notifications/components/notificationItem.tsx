import moment from 'moment';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useAppDispatch } from '@/hooks';
import { updateNotification } from '@/reducers/notification';
import { notificationAction } from '@/services/notification';
import { Text } from '@/shared';
import { Size } from '@/shared/text';
import { Colors } from '@/theme/colors';

import ChatNotificationImage from './chatNotificationImage';
import OtherNotificationImage from './otherNotificationImage';

type Props = {
    id: number;
    title: string;
    description: string;
    dateTime: string;
    type: string;
    payload: string | null;
    read: boolean;
};

const NotificationItem: FunctionComponent<Props> = ({
    id,
    title,
    description,
    dateTime,
    type,
    payload,
    read
}: Props) => {
    const dispatch = useAppDispatch();

    const handleNotificationPress = useCallback(() => {
        notificationAction(type, payload);

        if (read === false) {
            dispatch(updateNotification({ id }));
        }
    }, [type, payload, read, dispatch, id]);

    const formattedTime = useMemo(() => {
        const parsedDateTime = moment(dateTime);
        const now = moment();
        if (parsedDateTime.isSame(now, 'day')) {
            return parsedDateTime.format('HH:mmA');
        } else if (parsedDateTime.isSame(now.subtract(1, 'days'), 'day')) {
            return 'Yesterday';
        } else {
            return parsedDateTime.format('MM/DD/YYYY');
        }
    }, [dateTime]);

    return (
        <TouchableOpacity
            onPress={handleNotificationPress}
            style={[styles.wrapper, read && styles.readNotification]}
        >
            <View style={styles.firstCol}>
                {type === 'message.new' && payload ? (
                    <ChatNotificationImage channelId={payload} />
                ) : (
                    <OtherNotificationImage />
                )}
            </View>
            <View style={styles.secondCol}>
                <Text
                    size={Size.XXSmall}
                    fontWeight="bold"
                    color={Colors.text.mainDarker}
                >
                    {title}
                </Text>
                <Text size={Size.XXXSmall} color={Colors.text.gray}>
                    {description}
                </Text>
            </View>
            <View style={styles.thirdCol}>
                <Text size={Size.XXXSmall} color={Colors.text.gray}>
                    {formattedTime}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default NotificationItem;

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: Colors.theme.primary_light
    },
    readNotification: {
        backgroundColor: Colors.extras.transparent
    },
    firstCol: {
        width: '20%',
        alignItems: 'center'
    },
    secondCol: {
        width: '60%'
    },
    thirdCol: {
        width: '20%',
        alignItems: 'center'
    }
});
