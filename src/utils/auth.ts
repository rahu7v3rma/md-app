import { CommonActions } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';

import { navigationRef } from '@/navigation';
import { resetNotifications } from '@/services/notification';
import { resetStore } from '@/store';

export const setAuthToken = (token: string) => {
    Keychain.setGenericPassword('token', token);
};

export const getAuthToken = (): Promise<string | null> => {
    return Keychain.getGenericPassword().then((credentials) =>
        credentials === false ? null : credentials.password
    );
};

export const AUTHORIZATION_HEADER_NAME = 'X-Authorization';

export const getAuthorizationHeaderValue = () => {
    return getAuthToken()
        .then((authToken) => `Token ${authToken || ''}`)
        .catch(() => undefined);
};

export const resetAuthToken = () => {
    Keychain.resetGenericPassword();
};

export const logoutAction = (skipNavigation: boolean = false) => {
    resetStore();
    resetNotifications();
    resetAuthToken();

    if (!skipNavigation) {
        navigationRef.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'SignIn' }]
            })
        );
    }
};
