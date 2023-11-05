import messaging, {
    FirebaseMessagingTypes
} from '@react-native-firebase/messaging';
import { useCallback, useEffect, useRef } from 'react';
import { StreamChat } from 'stream-chat';

import { useAppDispatch } from '@/hooks';
import { refreshProfileSession, UserSelectors } from '@/reducers/user';
import {
    getFCMToken,
    registerFirebaseMessageListener,
    triggerFirebaseForegroundNotification
} from '@/services/notification';
import { getCachedFCMPushToken, setCachedFCMPushToken } from '@/utils/storage';

const registerChatPushToken = async (
    chatClient: StreamChat,
    firebasePushProviderName: string,
    onNewToken?: (token: string) => void
) => {
    const token = await getFCMToken();
    const pushProvider = 'firebase';

    // add and cache current token
    await chatClient.addDevice(
        token,
        pushProvider,
        chatClient.userID,
        firebasePushProviderName
    );
    await setCachedFCMPushToken(token);

    // the return value is an unsubscribe function for the event
    const unsubscribe = messaging().onTokenRefresh(async (newToken: string) => {
        // remove old token
        const oldToken = await getCachedFCMPushToken();
        if (oldToken !== null) {
            await chatClient.removeDevice(oldToken);
        }

        // add and cache new token
        await chatClient.addDevice(
            newToken,
            pushProvider,
            chatClient.userID,
            firebasePushProviderName
        );
        await setCachedFCMPushToken(newToken);

        // notify new token
        onNewToken?.(newToken);
    });

    return unsubscribe;
};

const useChatNotifications = (
    chatClient: StreamChat | null,
    activeChatChannel: string | null
) => {
    const dispatch = useAppDispatch();

    const { chatProfile } = UserSelectors();

    const unsubscribeTokenRefreshListenerRef = useRef<() => void>();
    const unsubscribeMessageListener = useRef<() => void>();

    const handleForegroundMessageReceived = useCallback(
        (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            if (remoteMessage.data?.cid !== activeChatChannel) {
                triggerFirebaseForegroundNotification(remoteMessage);
            }
        },
        [activeChatChannel]
    );

    useEffect(() => {
        const onNewToken = (token: string) => {
            dispatch(refreshProfileSession({ fcmToken: token }));
        };

        if (chatClient && chatProfile) {
            registerChatPushToken(
                chatClient,
                chatProfile.firebasePushProviderName,
                onNewToken
            )
                .then((unsubsribe) => {
                    unsubscribeTokenRefreshListenerRef.current = unsubsribe;
                })
                .catch((error) => {
                    console.log(
                        `An error occurred while registering Firebase push token: ${error?.message}`
                    );
                });
        }

        return () => {
            // unsubscribe token refresh listeners
            unsubscribeTokenRefreshListenerRef.current?.();
        };
    }, [dispatch, chatClient, chatProfile]);

    useEffect(() => {
        unsubscribeMessageListener.current = registerFirebaseMessageListener(
            handleForegroundMessageReceived
        );

        return () => {
            // unsubscribe message listeners
            unsubscribeMessageListener.current?.();
        };
    }, [handleForegroundMessageReceived]);

    return {
        chatClient
    };
};

export default useChatNotifications;
