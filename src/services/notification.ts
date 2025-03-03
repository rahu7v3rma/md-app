import notifee, {
    AuthorizationStatus,
    EventType,
    Notification,
    TimestampTrigger,
    TriggerType
} from '@notifee/react-native';
import messaging, {
    FirebaseMessagingTypes
} from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

import { navigateScreen } from '@/navigation';
import { getActiveLesson } from '@/reducers/content';
import store from '@/store';
import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';
import { Constants } from '@/utils/constants';

export const checkInitialNotification = () => {
    notifee.getInitialNotification().then((initialNotification) => {
        if (initialNotification) {
            handleNotification(initialNotification.notification);
        }
    });
};

export const registerBackgroundNotificationsListener = () => {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === EventType.PRESS && detail.notification) {
            return handleNotification(detail.notification);
        }
    });
};

export const registerForegroundNotificationsListener = () => {
    return notifee.onForegroundEvent((event) => {
        const { type, detail } = event;
        if (type === EventType.PRESS && detail.notification) {
            return handleNotification(detail.notification);
        }
    });
};

const handleNotification = (notification: Notification) => {
    if (notification.id) {
        notifee.cancelNotification(notification.id);
    }

    const notificationType = notification.data?.type.toString();

    if (notificationType) {
        if (
            notificationType === Constants.notificationType.STREAM_CHAT_MESSAGE
        ) {
            const channelId = notification.data?.cid;

            if (channelId) {
                notificationAction(notificationType, channelId as string);
            }
        } else if (
            notificationType === Constants.notificationType.LOG_REMINDER
        ) {
            const logType = notification.data?.logType;

            if (logType) {
                notificationAction(notificationType, logType as string);
            }
        } else {
            notificationAction(notificationType, null);
        }
    }
};

export const notificationAction = (
    notificationType: string,
    notificationPayload: string | null
) => {
    if (notificationType === Constants.notificationType.STREAM_CHAT_MESSAGE) {
        if (notificationPayload) {
            // for chat notifications the payload is a channel id
            navigateScreen('ChatChannel', { channelId: notificationPayload });
        }
    } else if (notificationType === Constants.notificationType.LOG_REMINDER) {
        if (notificationPayload) {
            // for log reminder notifications the payload is the reminder type
            if (notificationPayload === 'general') {
                navigateScreen('Main.Home', {});
            } else if (notificationPayload === 'glucose') {
                navigateScreen('LogBlood', undefined);
            } else if (notificationPayload === 'food') {
                navigateScreen('LogMeal', undefined);
            } else if (notificationPayload === 'exercise') {
                navigateScreen('LogActivity', undefined);
            } else if (notificationPayload === 'drink') {
                navigateScreen('LogWaterIntake', undefined);
            }
        }
    } else if (
        notificationType === Constants.notificationType.LESSON_REMINDER
    ) {
        const activeLesson = getActiveLesson(store.getState());
        const lessonId = activeLesson?.lesson.id;
        const lessonTitle = activeLesson?.lesson.title;

        if (lessonId && lessonTitle) {
            navigateScreen('LessonContent', {
                lessonId,
                lessonName: lessonTitle,
                type: 'Home'
            });
        } else {
            // if no active lessons is available right no (for example if all
            // lessons were completed since the notification was sent),
            // navigate to the home page
            navigateScreen('Main.Home', {});
        }
    } else if (notificationType === Constants.notificationType.FAST_COMPLETE) {
        navigateScreen('TrackFast', undefined);
    }
};

export const registerTriggerNotifications = async (
    date: Date,
    title: string,
    body: string,
    type: string
) => {
    // request permissions if needed
    const permission = await requestNotificationPermissions();

    if (permission.authorizationStatus === AuthorizationStatus.DENIED) {
        return;
    }

    const channelId = await notifee.createChannel({
        id: 'triggerNotification',
        name: 'triggerNotification reminders'
    });

    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
        alarmManager: {
            allowWhileIdle: true
        }
    };

    // create a timestamp-trigger notification
    await notifee.createTriggerNotification(
        {
            title: title,
            body: body,
            android: {
                channelId: channelId,
                pressAction: {
                    id: trigger.timestamp.toString(),
                    launchActivity: 'default'
                }
            },
            data: {
                type
            }
        },
        trigger
    );
};

export const triggerFirebaseForegroundNotification = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage
) => {
    const notificationType = remoteMessage.data?.type;

    if (remoteMessage.notification) {
        if (
            notificationType === Constants.notificationType.STREAM_CHAT_MESSAGE
        ) {
            triggerChatNotification(
                remoteMessage.notification.title,
                remoteMessage.notification.body,
                remoteMessage.data
            );
        } else if (
            notificationType === Constants.notificationType.LOG_REMINDER
        ) {
            triggerLogReminderNotification(
                remoteMessage.notification.title,
                remoteMessage.notification.body,
                remoteMessage.data
            );
        } else if (
            notificationType === Constants.notificationType.LESSON_REMINDER
        ) {
            triggerLessonReminderNotification(
                remoteMessage.notification.title,
                remoteMessage.notification.body,
                remoteMessage.data
            );
        }
    }
};

const triggerChatNotification = async (
    title?: string,
    body?: string,
    data?: { [key: string]: string }
) => {
    const channelId = await notifee.createChannel({
        id: 'chatNotifications',
        name: 'Chat notifications'
    });

    await notifee.displayNotification({
        title,
        body,
        data,
        android: {
            channelId,
            smallIcon: 'ic_notification_small',
            color: Colors.theme.primary,
            // general press action to open the app. we will handle navigating
            // to the correct screen at `handleNotification`
            pressAction: {
                id: 'default'
            }
        }
    });
};

const triggerLogReminderNotification = async (
    title?: string,
    body?: string,
    data?: { [key: string]: string }
) => {
    const channelId = await notifee.createChannel({
        id: 'logReminders',
        name: 'Log reminders'
    });

    await notifee.displayNotification({
        title,
        body,
        data,
        android: {
            channelId,
            smallIcon: 'ic_notification_small',
            color: Colors.theme.primary,
            // general press action to open the app. we will handle navigating
            // to the correct screen at `handleNotification`
            pressAction: {
                id: 'default'
            }
        }
    });
};

const triggerLessonReminderNotification = async (
    title?: string,
    body?: string,
    data?: { [key: string]: string }
) => {
    const channelId = await notifee.createChannel({
        id: 'lessonReminders',
        name: 'Lesson reminders'
    });

    await notifee.displayNotification({
        title,
        body,
        data,
        android: {
            channelId,
            smallIcon: 'ic_notification_small',
            color: Colors.theme.primary,
            // general press action to open the app. we will handle navigating
            // to the correct screen at `handleNotification`
            pressAction: {
                id: 'default'
            }
        }
    });
};

export const resetNotifications = async () => {
    await messaging().deleteToken();
    await notifee.cancelAllNotifications();
};

export const initNotifications = async () => {
    // create the required chat channel (for android only) ahead of time so
    // that push notifications can use it before a foreground notification is
    // ever received
    await notifee.createChannel({
        id: 'chatNotifications',
        name: 'Chat notifications'
    });
    await notifee.createChannel({
        id: 'logReminders',
        name: 'Log reminders'
    });
    await notifee.createChannel({
        id: 'lessonReminders',
        name: 'Lesson reminders'
    });
};

export const requestNotificationPermissions = async () => {
    const settings = await notifee.requestPermission({
        alert: true,
        sound: true
    });
    if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
        Toast.show({
            type: 'errorResponse',
            text1: "Please allow the app to send you notifications via your phone's settings",
            position: 'bottom'
        });
    }
    return settings;
};

export const getFCMToken = async () => {
    if (COMMON.isIos) {
        // workaround for ios apns token not always being available yet when
        // we request a fcm token which leads to an error. this is apparently
        // due to some race condition on app start. issue is described here:
        // https://github.com/invertase/react-native-firebase/issues/6893
        await COMMON.retryOperation(() => messaging().getAPNSToken(), 500, 5);
    }

    const token = await messaging().getToken();

    return token;
};

export const registerFirebaseMessageListener = (
    listener: (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => void
): (() => void) => {
    const unsubscribe = messaging().onMessage(listener);
    return unsubscribe;
};

// this is unused currently as the push notifications we receive contain data
// in the notification object which is displayed by ios and android
export const registerBackgroundFirebaseMessageListener = (
    listener: (
        remoteMessage: FirebaseMessagingTypes.RemoteMessage
    ) => Promise<any>
) => {
    messaging().setBackgroundMessageHandler(listener);
};

// notification-opened-app is triggered on android when the app is in the
// background and opened via a notification
export const registerFirebaseNotificationOpenedApp = (): (() => void) => {
    const unsubscribe = messaging().onNotificationOpenedApp(handleNotification);
    return unsubscribe;
};

export const checkInitialFirebaseNotification = () => {
    messaging()
        .getInitialNotification()
        .then((initialNotification) => {
            if (initialNotification?.notification) {
                handleNotification(initialNotification);
            }
        });
};
