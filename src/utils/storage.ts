import AsyncStorage from '@react-native-async-storage/async-storage';

const HAS_LAUNCHED = 'hasLaunched';
const FCM_PUSH_TOKEN = 'fcmPushToken';

export const hasAppLaunched = async () => {
    const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED);
    if (hasLaunched === 'true') {
        return true;
    } else {
        AsyncStorage.setItem(HAS_LAUNCHED, 'true');
        return false;
    }
};

export const getCachedFCMPushToken = async () => {
    return await AsyncStorage.getItem(FCM_PUSH_TOKEN);
};

export const setCachedFCMPushToken = async (newToken: string) => {
    await AsyncStorage.setItem(FCM_PUSH_TOKEN, newToken);
};
