import AsyncStorage from '@react-native-async-storage/async-storage';

const FCM_PUSH_TOKEN = 'fcmPushToken';

export const getCachedFCMPushToken = async () => {
    return await AsyncStorage.getItem(FCM_PUSH_TOKEN);
};

export const setCachedFCMPushToken = async (newToken: string) => {
    await AsyncStorage.setItem(FCM_PUSH_TOKEN, newToken);
};
