import { createNavigationContainerRef } from '@react-navigation/native';
import {
    CardStyleInterpolators,
    createStackNavigator,
    StackNavigationProp
} from '@react-navigation/stack';
import React, {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import {
    EmitterSubscription,
    Linking,
    NativeEventSubscription,
    Platform
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { useAppDispatch } from '@/hooks';
import LogMenu from '@/navigation/logMenu';
import {
    AppSettings,
    ChangePassword,
    ChatChannel,
    ChatChannelDetails,
    ChatSearch,
    Content,
    CriticalUpdate,
    DeleteAccount,
    DeleteAccountSuccess,
    LogActivity,
    LogBlood,
    LogFast,
    Login,
    LogInsulin,
    LogMeal,
    LogMedication,
    LogWaterIntake,
    LogWeight,
    Onboarding,
    Profile,
    ResetPassword,
    ResetPasswordChange,
    TrackFast,
    UnitSettings,
    WebViewScreen
} from '@/pages';
import Block from '@/pages/block';
import Notifications from '@/pages/notifications';
import {
    ClientConfigSelectors,
    getClientConfig
} from '@/reducers/clientConfig';
import { trackedTimeUpdateAuto } from '@/reducers/track';
import {
    checkInitialFirebaseNotification,
    checkInitialNotification,
    initNotifications,
    registerFirebaseNotificationOpenedApp,
    registerForegroundNotificationsListener
} from '@/services/notification';
import { UserBlock } from '@/types/content';
import {
    EditLogActivity,
    EditLogBlood,
    EditLogDrink,
    EditLogFast,
    EditLogFood,
    EditLogInsulin,
    EditLogMedication,
    EditLogWeight
} from '@/types/log';
import { getAuthToken } from '@/utils/auth';

import MainTabNavigation from './mainTabNavigation';

export type TrackFastTimerProps = {
    startTrackFastTimerInterval: () => void;
    stopTrackFastTimerInterval: () => void;
    trackFastTimerListener: NativeEventSubscription | undefined;
    setTrackFastTimerListener: Dispatch<
        SetStateAction<NativeEventSubscription | undefined>
    >;
};

export type RootStackParamList = {
    Onboarding: undefined;
    SignIn: undefined;
    SignUp: undefined;
    ChangePassword: { email?: string };
    Main: undefined;
    'Main.Home': { lessonId?: number };
    'Main.Chat': undefined;
    'Main.Journey': undefined;
    'Main.Profile': undefined;
    Me: undefined;
    Plus: undefined;
    Notifications: undefined;
    AppSettings: undefined;
    LessonContent: {
        lessonId: number;
        lessonName: string;
        type?: string;
        navigationKey?: string;
    };
    Block: { data?: UserBlock; navigationId?: string };
    UnitSettings: undefined;
    WebViewScreen: { url: string };
    ResetPassword: undefined;
    ChatChannel: { channelId: string; messageId?: string };
    ChatChannelDetails: { channelId: string };
    ResetPasswordChange: { code: string };
    LogMeal: EditLogFood | undefined;
    LogActivity: EditLogActivity | undefined;
    LogWaterIntake: EditLogDrink | undefined;
    LogBlood: EditLogBlood | undefined;
    LogInsulin: EditLogInsulin | undefined;
    LogMedication: EditLogMedication | undefined;
    LogFast: EditLogFast | undefined;
    TrackFast: undefined;
    LogWeight: EditLogWeight | undefined;
    DeleteAccount: undefined;
    DeleteAccountSuccess: undefined;
    CriticalUpdate: {
        linkUrl: string;
    };
};

type LinkParams = {
    url: string;
};

export type RootNavigationProp = StackNavigationProp<RootStackParamList>;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// this function should only be used when no component context is available.
// otherwise the useNavigation hook should always be used
export function navigateScreen<RouteName extends keyof RootStackParamList>(
    screen: RouteName,
    params: RootStackParamList[RouteName]
) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(screen, params);
    }
}

const Stack = createStackNavigator();

type Props = Record<string, never>;

const AppNavigation: FunctionComponent<Props> = ({}: Props) => {
    const dispatch = useAppDispatch();

    const { gotMinimalVersion, storeUrl } = ClientConfigSelectors();

    const [ready, setReady] = useState<boolean>(false);
    const [initialRouteName, setInitialRouteName] = useState<string>('SignIn');

    const linkEventListner = useRef<EmitterSubscription | null>(null);

    const navigate = useCallback((url: string | null) => {
        try {
            if (url) {
                const route = url.replace(/.*?:\/\//g, '');
                const code = route.match(/\/([^]+)\/?$/)![1];
                const routeName = route.split('/')[0];
                if (routeName === 'reset' && code) {
                    navigateScreen('ResetPasswordChange', { code });
                }
            }
        } catch (error) {}
    }, []);

    const handleOpenURL = useCallback(
        (event: LinkParams) => {
            navigate(event.url);
        },
        [navigate]
    );

    useEffect(() => {
        if (Platform.OS === 'android') {
            Linking.getInitialURL().then((url) => {
                if (url !== null) {
                    // add a short wait so navigation is ready
                    setTimeout(() => {
                        handleOpenURL({ url });
                    }, 50);
                }
            });
        }

        linkEventListner.current = Linking.addEventListener(
            'url',
            handleOpenURL
        );

        return () => {
            if (linkEventListner.current) {
                linkEventListner.current.remove();
            }
        };
    }, [navigate, handleOpenURL]);

    useEffect(() => {
        // check if user is already logged in, and if so go to main screen
        getAuthToken()
            .then(async (token) => {
                if (token !== null) {
                    setInitialRouteName('Main');
                }
            })
            .finally(() => {
                // get client config after figuring out where to navigate to
                dispatch(getClientConfig({}));

                setReady(true);

                // hide splash screen now that we are ready to display app
                // screens
                SplashScreen.hide();
            });
    }, [dispatch]);

    useEffect(() => {
        // if we don't have the minimal version navigate to the critical update
        // page
        if (gotMinimalVersion === false && storeUrl) {
            navigateScreen('CriticalUpdate', { linkUrl: storeUrl });
        }
    }, [gotMinimalVersion, storeUrl]);

    useEffect(() => {
        let unsubscribeForgroundNotifications: () => void | undefined;
        let unsubscribeFirebaseNotificationOpenedApp: () => void | undefined;

        if (ready) {
            // init notifications - create channels for android
            initNotifications();

            // register a listener for foreground notifications
            unsubscribeForgroundNotifications =
                registerForegroundNotificationsListener();

            // check for initial notifications that caused the app to open
            checkInitialNotification();
            checkInitialFirebaseNotification();

            // register a listener for firebase notifications that open the app
            // (so that notifications opened while the app is in the background
            // on android can open the correct screen)
            unsubscribeFirebaseNotificationOpenedApp =
                registerFirebaseNotificationOpenedApp();
        }

        return () => {
            unsubscribeForgroundNotifications?.();
            unsubscribeFirebaseNotificationOpenedApp?.();
        };
    }, [ready]);

    const trackFastTimerInterval = useRef<NodeJS.Timer | undefined>();
    const startTrackFastTimerInterval = () => {
        trackFastTimerInterval.current = setInterval(() => {
            dispatch(trackedTimeUpdateAuto());
        }, 1000);
    };
    const stopTrackFastTimerInterval = () => {
        clearInterval(trackFastTimerInterval.current);
    };
    const [trackFastTimerListener, setTrackFastTimerListener] = useState<
        NativeEventSubscription | undefined
    >();
    const trackFastTimerProps = {
        startTrackFastTimerInterval,
        stopTrackFastTimerInterval,
        trackFastTimerListener,
        setTrackFastTimerListener
    };

    if (!ready) {
        return null;
    }

    return (
        <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="SignIn" component={Login} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
            <Stack.Screen name="UnitSettings" component={UnitSettings} />
            <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
            <Stack.Screen name="Main">
                {(props) => (
                    <MainTabNavigation {...props} {...trackFastTimerProps} />
                )}
            </Stack.Screen>
            <Stack.Screen
                name="Plus"
                component={LogMenu}
                options={{
                    gestureEnabled: true,
                    gestureDirection: 'vertical',
                    // this is the maximal distance from an edge the gesture
                    // should work. we want it to work on all the screen
                    gestureResponseDistance: 100000,
                    cardStyleInterpolator:
                        CardStyleInterpolators.forRevealFromBottomAndroid
                }}
            />
            <Stack.Screen name="LessonContent" component={Content} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen
                name="ResetPasswordChange"
                component={ResetPasswordChange}
            />
            <Stack.Screen name="ChatChannel" component={ChatChannel} />
            <Stack.Screen name="Block" component={Block} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen
                name="ChatChannelDetails"
                component={ChatChannelDetails}
            />
            <Stack.Screen name="ChatSearch" component={ChatSearch} />
            <Stack.Screen name="LogMeal" component={LogMeal} />
            <Stack.Screen name="LogActivity" component={LogActivity} />
            <Stack.Screen name="LogWaterIntake" component={LogWaterIntake} />
            <Stack.Screen name="LogBlood" component={LogBlood} />
            <Stack.Screen name="LogInsulin" component={LogInsulin} />
            <Stack.Screen name="LogMedication" component={LogMedication} />
            <Stack.Screen name="LogFast" component={LogFast} />
            <Stack.Screen name="TrackFast">
                {(props) => <TrackFast {...props} {...trackFastTimerProps} />}
            </Stack.Screen>
            <Stack.Screen name="LogWeight" component={LogWeight} />
            <Stack.Screen name="Main.Profile" component={Profile} />
            <Stack.Screen name="AppSettings" component={AppSettings} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
            <Stack.Screen
                name="DeleteAccountSuccess"
                component={DeleteAccountSuccess}
                options={{ animationEnabled: false }}
            />
            <Stack.Screen name="CriticalUpdate" component={CriticalUpdate} />
        </Stack.Navigator>
    );
};

export default AppNavigation;
