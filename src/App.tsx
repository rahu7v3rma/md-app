import BugsnagPluginReact from '@bugsnag/plugin-react';
import BugsnagPluginReactNavigation from '@bugsnag/plugin-react-navigation';
import Bugsnag from '@bugsnag/react-native';
import notifee from '@notifee/react-native';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { useAppInForeground } from '@/hooks';
import { ChatManager } from '@/shared';
import store, { persistor } from '@/store';

import AppNavigation, { navigationRef } from './navigation';
import toastConfig from './utils/CustomToast';

// start bugsnag
Bugsnag.start({
    plugins: [new BugsnagPluginReact(), new BugsnagPluginReactNavigation()]
});

// error boundary allows bugsnag to catch react render errors
const ErrorBoundary = Bugsnag.getPlugin('react')!.createErrorBoundary(React);

// add navigation events to the bugsnag error breadcrumbs
const { createNavigationContainer } = Bugsnag.getPlugin('reactNavigation')!;
const BugsnagNavigationContainer =
    createNavigationContainer(NavigationContainer);

const App = () => {
    useAppInForeground(() => {
        // remove app badge count when the app is launched or returns to the
        // foreground
        notifee.setBadgeCount(0);
    });

    return (
        <ErrorBoundary>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ChatManager>
                        <SafeAreaProvider>
                            <BugsnagNavigationContainer ref={navigationRef}>
                                <AppNavigation />
                            </BugsnagNavigationContainer>
                        </SafeAreaProvider>
                    </ChatManager>
                </PersistGate>
                <Toast config={toastConfig} />
            </Provider>
        </ErrorBoundary>
    );
};

export default App;
