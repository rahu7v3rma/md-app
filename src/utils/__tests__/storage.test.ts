import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    getCachedFCMPushToken,
    hasAppLaunched,
    setCachedFCMPushToken
} from '../storage';

beforeEach(() => {
    AsyncStorage.clear();
});

test('should return false for hasAppLaunched if it has not been set before', async () => {
    expect(await hasAppLaunched()).toBe(false);
});

test('should return true for hasAppLaunched if it has been set before', async () => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    expect(await hasAppLaunched()).toBe(true);
});

test('should return null for getCachedFCMPushToken if it has not been set before', async () => {
    expect(await getCachedFCMPushToken()).toBe(null);
});

test('should return the cached FCM token for getCachedFCMPushToken if it has been set', async () => {
    await AsyncStorage.setItem('fcmPushToken', 'newToken');
    expect(await getCachedFCMPushToken()).toBe('newToken');
});

test('should set a new FCM token for setCachedFCMPushToken', async () => {
    await setCachedFCMPushToken('newToken');
    expect(await AsyncStorage.getItem('fcmPushToken')).toBe('newToken');
});
