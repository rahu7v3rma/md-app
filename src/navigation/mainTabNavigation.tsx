import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { FunctionComponent } from 'react';

import { Block, ChatChannelList, Home, Journey, Me } from '@/pages';
import { MainTabBar } from '@/shared';

import { TrackFastTimerProps } from '.';

const Tab = createBottomTabNavigator();
const JourneyStack = createStackNavigator();
const UserStack = createStackNavigator();

const JourneyStackScreen = () => {
    return (
        <JourneyStack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <JourneyStack.Screen name="Journey" component={Journey} />
            <JourneyStack.Screen name="Block" component={Block} />
        </JourneyStack.Navigator>
    );
};

function UserStackScreen() {
    return (
        <UserStack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <UserStack.Screen name="Main.Me" component={Me} />
        </UserStack.Navigator>
    );
}

const EmptyComponent = () => null;

type Props = {
    route: RouteProp<any>;
    navigation: NavigationProp<any>;
} & TrackFastTimerProps;

const MainTabNavigation: FunctionComponent<Props> = (props) => {
    const {
        startTrackFastTimerInterval,
        stopTrackFastTimerInterval,
        trackFastTimerListener,
        setTrackFastTimerListener
    } = props;
    const trackFastTimerProps = {
        startTrackFastTimerInterval,
        stopTrackFastTimerInterval,
        trackFastTimerListener,
        setTrackFastTimerListener
    };
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName="Main.Home"
            tabBar={MainTabBar}
        >
            <Tab.Screen
                name="Main.Home"
                options={{
                    title: 'Home'
                }}
            >
                {(_props) => <Home {..._props} {...trackFastTimerProps} />}
            </Tab.Screen>
            <Tab.Screen
                name="Main.Chat"
                component={ChatChannelList}
                options={{
                    title: 'Chat'
                }}
            />
            <Tab.Screen
                name="Main.OpenPlus"
                component={EmptyComponent}
                listeners={({ navigation }) => ({
                    tabPress: (event) => {
                        event.preventDefault();
                        navigation.navigate('Plus');
                    }
                })}
            />
            <Tab.Screen
                name="Main.Journey"
                component={JourneyStackScreen}
                options={{
                    title: 'Journey'
                }}
            />
            <Tab.Screen
                name="Me"
                component={UserStackScreen}
                options={{
                    title: 'Me'
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigation;
