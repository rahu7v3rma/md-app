import mock from '@notifee/react-native/jest-mock';

import * as navigation from '@/navigation';

import {
    checkInitialFirebaseNotification,
    checkInitialNotification,
    registerBackgroundNotificationsListener,
    registerFirebaseNotificationOpenedApp,
    registerForegroundNotificationsListener
} from '../notification';

const chatNotification = {
    notification: {
        id: 'test-id',
        title: 'test-title',
        body: 'test-body',
        android: {
            channelId: 'default'
        },
        data: {
            type: 'log.reminder',
            cid: 'cid'
        }
    },
    data: {
        type: 'message.new',
        cid: 'cid'
    }
};

const generalLogNotification = {
    notification: {
        id: 'test-id',
        title: 'test-title',
        body: 'test-body',
        android: {
            channelId: 'default'
        },
        data: {
            type: 'log.reminder',
            logType: 'general'
        }
    },
    data: {
        type: 'log.reminder',
        logType: 'general'
    }
};

const glucoseLogNotification = {
    notification: {
        id: 'test-id',
        title: 'test-title',
        body: 'test-body',
        android: {
            channelId: 'default'
        },
        data: {
            type: 'log.reminder',
            logType: 'glucose'
        }
    },
    data: {
        type: 'log.reminder',
        logType: 'glucose'
    }
};

const foodLogNotification = {
    notification: {
        id: 'test-id',
        title: 'test-title',
        body: 'test-body',
        android: {
            channelId: 'default'
        },
        data: {
            type: 'log.reminder',
            logType: 'food'
        }
    },
    data: {
        type: 'log.reminder',
        logType: 'food'
    }
};

const activityLogNotification = {
    notification: {
        id: 'test-id',
        title: 'test-title',
        body: 'test-body',
        android: {
            channelId: 'default'
        },
        data: {
            type: 'log.reminder',
            logType: 'exercise'
        }
    },
    data: {
        type: 'log.reminder',
        logType: 'exercise'
    }
};

const wateryLogNotification = {
    notification: {
        id: 'test-id',
        title: 'test-title',
        body: 'test-body',
        android: {
            channelId: 'default'
        },
        data: {
            type: 'log.reminder',
            logType: 'drink'
        }
    },
    data: {
        type: 'log.reminder',
        logType: 'drink'
    }
};

const lessonReminderNotification = {
    notification: {
        id: 'test-id',
        title: 'test-title',
        body: 'test-body',
        android: {
            channelId: 'default'
        },
        data: {
            type: 'lesson.reminder'
        }
    },
    data: {
        type: 'lesson.reminder'
    }
};

const trackFastCompleteNotification = {
    notification: {
        id: 'test-id',
        title: 'test-title',
        body: 'test-body',
        android: {
            channelId: 'default'
        },
        data: {
            type: 'fast.complete'
        }
    },
    data: {
        type: 'fast.complete'
    }
};

jest.unmock('@/services/notification');

jest.mock('@react-native-firebase/messaging', () => {
    return jest
        .fn()
        .mockImplementationOnce(() => {
            return {
                getInitialNotification: jest.fn(() =>
                    Promise.resolve(chatNotification)
                ),
                onNotificationOpenedApp: (callback) =>
                    callback(glucoseLogNotification)
            };
        })
        .mockImplementation(() => {
            return {
                getInitialNotification: jest.fn(() =>
                    Promise.resolve(wateryLogNotification)
                ),
                onNotificationOpenedApp: (callback) =>
                    callback(glucoseLogNotification)
            };
        });
});

jest.mock('@notifee/react-native', () => {
    return {
        ...mock,
        getInitialNotification: jest
            .fn()
            .mockImplementationOnce(() =>
                Promise.resolve(generalLogNotification)
            )
            .mockImplementation(() =>
                Promise.resolve(lessonReminderNotification)
            ),
        onBackgroundEvent: (callback) =>
            callback({
                detail: foodLogNotification,
                type: 1
            }),
        onForegroundEvent: jest
            .fn()
            .mockImplementationOnce((callback) =>
                callback({
                    detail: activityLogNotification,
                    type: 1
                })
            )
            .mockImplementation((callback) =>
                callback({
                    detail: trackFastCompleteNotification,
                    type: 1
                })
            )
    };
});

const mockNotificationPayloadFor = (mockNotificationData) => {
    jest.mock('@react-native-firebase/messaging', () => {
        return jest.fn().mockImplementation(() => {
            return {
                getInitialNotification: jest.fn(() =>
                    Promise.resolve(mockNotificationData)
                ),
                onNotificationOpenedApp: (callback) =>
                    callback(mockNotificationData)
            };
        });
    });

    jest.mock('@notifee/react-native', () => {
        return {
            ...mock,
            getInitialNotification: jest
                .fn()
                .mockImplementation(() =>
                    Promise.resolve(mockNotificationData)
                ),
            onBackgroundEvent: (callback) =>
                callback({
                    detail: mockNotificationData,
                    type: 1
                }),
            onForegroundEvent: jest.fn().mockImplementation((callback) =>
                callback({
                    detail: mockNotificationData,
                    type: 1
                })
            )
        };
    });
};

const spyNavigate = jest.spyOn(navigation, 'navigateScreen');

describe('user can click on new message notification and it will redirect to chat screen', () => {
    beforeAll(() => {
        mockNotificationPayloadFor(chatNotification);
    });

    it('when app is closed', async () => {
        // firebase
        await checkInitialFirebaseNotification();
        expect(spyNavigate).toBeCalledWith('ChatChannel', { channelId: 'cid' });

        // notifee
        await checkInitialNotification();
        expect(spyNavigate).toBeCalledWith('ChatChannel', { channelId: 'cid' });
    });

    it('when app is background', async () => {
        // firebase
        await registerFirebaseNotificationOpenedApp();
        expect(spyNavigate).toBeCalledWith('ChatChannel', { channelId: 'cid' });

        // notifee
        await registerBackgroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('ChatChannel', { channelId: 'cid' });
    });

    it('when app is foreground', async () => {
        await registerForegroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('ChatChannel', { channelId: 'cid' });
    });
});

describe('user can click on general log notification and it will redirect to home screen', () => {
    beforeAll(() => {
        mockNotificationPayloadFor(generalLogNotification);
    });

    it('when app is closed', async () => {
        // firebase
        await checkInitialFirebaseNotification();
        expect(spyNavigate).toBeCalledWith('Main.Home', {});

        // notifee
        await checkInitialNotification();
        expect(spyNavigate).toBeCalledWith('Main.Home', {});
    });

    it('when app is background', async () => {
        // firebase
        await registerFirebaseNotificationOpenedApp();
        expect(spyNavigate).toBeCalledWith('Main.Home', {});

        // notifee
        await registerBackgroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('Main.Home', {});
    });

    it('when app is foreground', async () => {
        await registerForegroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('Main.Home', {});
    });
});

describe('user can click on glucose log notification and it will redirect to log blood screen', () => {
    beforeAll(() => {
        mockNotificationPayloadFor(glucoseLogNotification);
    });

    it('when app is closed', async () => {
        // firebase
        await checkInitialFirebaseNotification();
        expect(spyNavigate).toBeCalledWith('LogBlood', undefined);

        // notifee
        await checkInitialNotification();
        expect(spyNavigate).toBeCalledWith('LogBlood', undefined);
    });

    it('when app is background', async () => {
        // firebase
        await registerFirebaseNotificationOpenedApp();
        expect(spyNavigate).toBeCalledWith('LogBlood', undefined);

        // notifee
        await registerBackgroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('LogBlood', undefined);
    });

    it('when app is foreground', async () => {
        await registerForegroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('LogBlood', undefined);
    });
});

describe('user can click on food log notification and it will redirect to log meal screen', () => {
    beforeAll(() => {
        mockNotificationPayloadFor(foodLogNotification);
    });

    it('when app is closed', async () => {
        // firebase
        await checkInitialFirebaseNotification();
        expect(spyNavigate).toBeCalledWith('LogMeal', undefined);

        // notifee
        await checkInitialNotification();
        expect(spyNavigate).toBeCalledWith('LogMeal', undefined);
    });

    it('when app is background', async () => {
        // firebase
        await registerFirebaseNotificationOpenedApp();
        expect(spyNavigate).toBeCalledWith('LogMeal', undefined);

        // notifee
        await registerBackgroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('LogMeal', undefined);
    });

    it('when app is foreground', async () => {
        await registerForegroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('LogMeal', undefined);
    });
});

describe('user can click on exercise log notification and it will redirect to log activity screen', () => {
    beforeAll(() => {
        mockNotificationPayloadFor(activityLogNotification);
    });

    it('when app is closed', async () => {
        // firebase
        await checkInitialFirebaseNotification();
        expect(spyNavigate).toBeCalledWith('LogActivity', undefined);

        // notifee
        await checkInitialNotification();
        expect(spyNavigate).toBeCalledWith('LogActivity', undefined);
    });

    it('when app is background', async () => {
        // firebase
        await registerFirebaseNotificationOpenedApp();
        expect(spyNavigate).toBeCalledWith('LogActivity', undefined);

        // notifee
        await registerBackgroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('LogActivity', undefined);
    });

    it('when app is foreground', async () => {
        await registerForegroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('LogActivity', undefined);
    });
});

describe('user can click on drink log notification and it will redirect to log water intake screen', () => {
    beforeAll(() => {
        mockNotificationPayloadFor(wateryLogNotification);
    });

    it('when app is closed', async () => {
        // firebase
        await checkInitialFirebaseNotification();
        expect(spyNavigate).toBeCalledWith('LogWaterIntake', undefined);

        // notifee
        await checkInitialNotification();
        expect(spyNavigate).toBeCalledWith('LogWaterIntake', undefined);
    });

    it('when app is background', async () => {
        // firebase
        await registerFirebaseNotificationOpenedApp();
        expect(spyNavigate).toBeCalledWith('LogWaterIntake', undefined);

        // notifee
        await registerBackgroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('LogWaterIntake', undefined);
    });

    it('when app is foreground', async () => {
        await registerForegroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('LogWaterIntake', undefined);
    });
});

describe('user can click on lesson reminder notification and it will redirect to home screen', () => {
    beforeAll(() => {
        mockNotificationPayloadFor(lessonReminderNotification);
    });

    it('when app is closed', async () => {
        // firebase
        await checkInitialFirebaseNotification();
        expect(spyNavigate).toBeCalledWith('Main.Home', {});

        // notifee
        await checkInitialNotification();
        expect(spyNavigate).toBeCalledWith('Main.Home', {});
    });

    it('when app is background', async () => {
        // firebase
        await registerFirebaseNotificationOpenedApp();
        expect(spyNavigate).toBeCalledWith('Main.Home', {});

        // notifee
        await registerBackgroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('Main.Home', {});
    });

    it('when app is foreground', async () => {
        await registerForegroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('Main.Home', {});
    });
});

describe('user can click on fast complete notification and it will redirect to track fast screen', () => {
    beforeAll(() => {
        mockNotificationPayloadFor(trackFastCompleteNotification);
    });

    it('when app is closed', async () => {
        // firebase
        await checkInitialFirebaseNotification();
        expect(spyNavigate).toBeCalledWith('TrackFast', undefined);

        // notifee
        await checkInitialNotification();
        expect(spyNavigate).toBeCalledWith('TrackFast', undefined);
    });

    it('when app is background', async () => {
        // firebase
        await registerFirebaseNotificationOpenedApp();
        expect(spyNavigate).toBeCalledWith('TrackFast', undefined);

        // notifee
        await registerBackgroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('TrackFast', undefined);
    });

    it('when app is foreground', async () => {
        await registerForegroundNotificationsListener();
        expect(spyNavigate).toBeCalledWith('TrackFast', undefined);
    });
});
