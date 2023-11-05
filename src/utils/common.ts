import { once } from 'lodash';
import { PixelRatio, Platform } from 'react-native';

import { API_BASE_URL } from './config';

const warnLocalBackend = once(() =>
    console.warn('Working with a local backend')
);

export const COMMON = {
    get isIos() {
        return Platform.OS === 'ios';
    },
    get apiBaseUrl() {
        if (API_BASE_URL) {
            return API_BASE_URL;
        } else {
            warnLocalBackend();

            return this.isIos
                ? 'http://127.0.0.1:8000/'
                : 'http://10.0.2.2:8000/';
        }
    },
    responsiveSize(value: number) {
        return PixelRatio.getPixelSizeForLayoutSize(value) * 0.35;
    },
    stringFormat(s: string, ...args: any[]) {
        return s.replace(/{([0-9]+)}/g, (match, index) =>
            typeof args[index] === 'undefined' ? match : args[index]
        );
    },
    delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    retryOperation(
        operation: () => Promise<any>,
        delayMs: number,
        retries: number
    ) {
        return new Promise<any>((resolve, reject) => {
            return operation()
                .then(resolve)
                .catch((reason) => {
                    if (retries > 0) {
                        return COMMON.delay(delayMs)
                            .then(
                                COMMON.retryOperation.bind(
                                    null,
                                    operation,
                                    delayMs,
                                    retries - 1
                                )
                            )
                            .then(resolve)
                            .catch(reject);
                    }

                    return reject(reason);
                });
        });
    }
};
