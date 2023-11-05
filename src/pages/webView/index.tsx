import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { FunctionComponent, useCallback, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, View } from 'react-native';
import Toast from 'react-native-toast-message';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';

import { CrossIcon } from '@/assets/svgs';
import { useAppDispatch } from '@/hooks';
import { RootNavigationProp, RootStackParamList } from '@/navigation';
import { getProfile } from '@/reducers/user';
import { CustomStatusBar, Header } from '@/shared';
import { Colors } from '@/theme/colors';
import { COMMON } from '@/utils/common';

import { webViewStyles } from './style';

type WebViewRouteProp = RouteProp<RootStackParamList, 'WebViewScreen'>;

const WebViewScreen: FunctionComponent = () => {
    const route = useRoute<WebViewRouteProp>();
    const navigation = useNavigation<RootNavigationProp>();

    const dispatch = useAppDispatch();
    const webRef = useRef<WebView>();

    const [loading, setLoading] = useState(true);

    const handleLoad = useCallback(
        (event: WebViewNavigationEvent) => {
            if (event.nativeEvent.url === route.params.url) {
                setLoading(false);
            }
        },
        [setLoading, route.params.url]
    );

    const handleNavigationStateChange = useCallback(
        (newNavigationState: WebViewNavigation) => {
            // detect when the form navigates to its submit url. testing
            // navigationType would be better but works only on ios
            if (newNavigationState.url.indexOf('/submit/') > -1) {
                // the form was submitted. now we wait for the backend to
                // asynchronously get the submission data
                setLoading(true);

                const checkIfReady = () => {
                    return dispatch(getProfile({}))
                        .unwrap()
                        .then((userProfile) => {
                            // the flag which tells us if the data has reached the
                            // backend successfully is the onboarding form url,
                            // which should be empty once the onboarding process is
                            // complete
                            return (
                                userProfile && !userProfile.onboarding_form_url
                            );
                        })
                        .catch(() => false);
                };

                (async () => {
                    // increase in delay after every attempt
                    for (const delay of [500, 500, 1000, 1000, 3000, 4000]) {
                        await COMMON.delay(delay);
                        const success = await checkIfReady();

                        if (success) {
                            // backend is ready, we can go back to the main page
                            navigation.navigate('Main');
                            return;
                        }
                    }

                    // attempts were exhausted, so show a toast message and
                    // navigate back to the main page, which will probably take
                    // the user back here
                    Toast.show({
                        type: 'errorResponse',
                        text1: 'An unknown error has occurred',
                        position: 'bottom'
                    });

                    navigation.navigate('Main');
                })();
            }
        },
        [dispatch, navigation]
    );

    return (
        <View testID="container" style={webViewStyles.wrapper}>
            <SafeAreaView
                style={webViewStyles.container}
                testID="safeAreaContainer"
            >
                <CustomStatusBar />
                <Header
                    leftIcon={CrossIcon}
                    onLeftBtnPress={() => {
                        navigation.goBack();
                    }}
                    styles={webViewStyles.header}
                    leftIconBgColor={Colors.extras.white}
                    isLeftIconShadow={true}
                />

                <View
                    style={webViewStyles.innerContainer}
                    testID="webviewContainer"
                >
                    <WebView
                        onLoad={handleLoad}
                        testID="webView"
                        style={webViewStyles.webViewStyle}
                        source={{ uri: route.params.url }}
                        javaScriptEnabled={true}
                        ref={webRef as any}
                        contentMode="mobile"
                        onNavigationStateChange={handleNavigationStateChange}
                    />
                    {loading && (
                        <View style={webViewStyles.loader} testID="loading">
                            <ActivityIndicator size={'large'} />
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
};

export default WebViewScreen;
