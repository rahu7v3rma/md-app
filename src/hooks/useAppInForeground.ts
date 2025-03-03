import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/* this hooks will run a callback function every time the app returns to the
 * forground, either from the background or from being inactive
 */
const useAppInForeground = (callback: () => void) => {
    const appState = useRef(AppState.currentState);

    // when the hook is just called we should be in the foreground
    callback();

    useEffect(() => {
        const subscription = AppState.addEventListener(
            'change',
            (nextAppState) => {
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === 'active'
                ) {
                    callback();
                }

                appState.current = nextAppState;
            }
        );

        return () => {
            subscription.remove();
        };
    }, [callback]);
};

export default useAppInForeground;
