import { NavigationProp, RouteProp } from '@react-navigation/native';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import moment from 'moment';
import React from 'react';
import { Provider } from 'react-redux';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';

import { mockNavigate } from '@/jestSetup';
import Home from '@/pages/home';
import clientConfigReducer from '@/reducers/clientConfig';
import contentReducer from '@/reducers/content';
import logReducer from '@/reducers/log';
import notificationReducer from '@/reducers/notification';
import trackReducer from '@/reducers/track';
import userReducer from '@/reducers/user';
import { LogTab } from '@/shared';
import { MockData } from '@/utils/mockData';

const mockToday = moment().format('YYYY-MM-DD');
const rootReducer = combineReducers({
    clientConfig: clientConfigReducer,
    content: contentReducer,
    user: userReducer,
    log: logReducer,
    track: trackReducer,
    notification: notificationReducer
});
jest.mock('@/store', () => null);
const store = configureStore({
    reducer: rootReducer
});
jest.unmock('@/hooks');
jest.unmock('@/reducers/content');
jest.unmock('@/reducers/user');
jest.unmock('@/reducers/log');
jest.unmock('@/reducers/track');
jest.unmock('@/reducers/notification');
jest.mock('@/services/api', () => ({
    getCoach: () =>
        Promise.resolve({
            hasCoachChat: true,
            coach: {
                first_name: 'coach_first_name',
                last_name: 'coach_last_name',
                profile_image: 'coach_profile_image',
                chat_id: 'coach_chat_id'
            },
            group: null
        }),
    getDailyCompletedLogs: () =>
        Promise.resolve({
            UserFast: {
                status: false,
                date: null
            },
            UserWeight: {
                status: false,
                date: null
            },
            UserInsulin: {
                status: false,
                date: null
            },
            UserExercise: {
                status: false,
                date: null
            },
            UserGlucose: {
                status: true,
                date: mockToday
            },
            UserDrink: {
                status: false,
                date: null
            },
            UserMedication: {
                status: false,
                date: null
            },
            UserFood: {
                status: false,
                date: null
            }
        }),
    getNotificationList: () =>
        Promise.resolve({
            count: 4,
            has_next: false,
            has_previous: false,
            next_page_number: null,
            total_unread: 3,
            list: [
                {
                    id: 1,
                    title: 'Did you forget?',
                    description:
                        "It's time to log your glucose. Tap to log now",
                    image: null,
                    date_time: '2023-03-08T12:12:12Z',
                    read_flag: false,
                    action: 'logBlood'
                },
                {
                    id: 2,
                    title: 'Yum yum',
                    description:
                        "You haven't logged your food today. Tap to log a meal now",
                    image: null,
                    date_time: '2023-04-08T12:12:12Z',
                    read_flag: false,
                    action: 'logMeal'
                },
                {
                    id: 3,
                    title: 'Staying active?',
                    description:
                        ' what did you do to stay active today? Take a minute to log it now',
                    image: null,
                    date_time: '2023-06-08T12:12:12Z',
                    read_flag: true,
                    action: 'logActivity'
                },
                {
                    id: 4,
                    title: 'Hydration is everything',
                    description: ' how much water did you drink today?',
                    image: null,
                    date_time: '2023-12-08T12:12:12Z',
                    read_flag: false,
                    action: 'logWaterIntake'
                }
            ]
        }),
    getUserJourney: () => Promise.resolve(MockData.journey),
    refreshProfileSession: jest.fn(),
    getLogPickerValues: jest.fn(),
    getProfile: jest.fn(),
    getDailyTasks: () =>
        Promise.resolve([
            'UserDrink',
            'UserGlucose',
            'UserWeight',
            'UserInsulin',
            'UserExercise'
        ])
}));
jest.mock('@/navigation', () => ({
    RootNavigationProp: jest.fn(),
    RootStackParamList: jest.fn(),
    TrackFastTimerProps: jest.fn()
}));
jest.mock('stream-chat-react-native', () => null);
jest.mock('@/utils/common', () => ({
    COMMON: {
        isIos: false,
        responsiveSize: jest.fn()
    }
}));

let tree: ReactTestRenderer;
const props = {
    startTrackFastTimerInterval: jest.fn(),
    stopTrackFastTimerInterval: jest.fn(),
    trackFastTimerListener: undefined,
    setTrackFastTimerListener: jest.fn(),
    route: {
        key: 'Main.Home-2T-BzAr0j_c82ayQffHiA',
        name: 'Main.Home',
        params: undefined
    } as RouteProp<any>,
    navigation: {
        navigation: {}
    } as unknown as NavigationProp<any>
};
describe('Home', () => {
    beforeAll(async () => {
        await act(() => {
            tree = renderer.create(
                <Provider store={store}>
                    <Home {...props} />
                </Provider>
            );
        });
    });
    it('home snapshot testing', async () => {
        expect(tree).toMatchSnapshot();
    });

    it('next lesson should redirect to the content page', async () => {
        const nextLesson = tree.root.findByProps({
            sublabel: 'Part 1'
        }).props;
        await act(() => nextLesson.onPress());
        expect(mockNavigate).toHaveBeenCalledWith('LessonContent', {
            lessonId: 1,
            lessonName: 'programming',
            type: 'Home'
        });
    });

    it('coach chat item should redirect to the chatChannel page', async () => {
        const chatCoachItem = tree.root.findByProps({
            label: 'Chat with Coach coach_first_name'
        }).props;
        await act(() => chatCoachItem.onPress());
        expect(mockNavigate).toHaveBeenCalledWith('ChatChannel', {
            channelId: 99
        });
    });

    it('more options in the next lesson section should navigate to the active block page.', async () => {
        const nextLessonMore = tree.root.findByProps({
            testID: 'nextLessonMore'
        }).props;
        await act(() => nextLessonMore.onPress());
        expect(mockNavigate).toHaveBeenCalledWith('Block', {
            data: MockData.activeBlock
        });
    });

    it('more options in the daily task section should  open logMenu.', async () => {
        const taskTodayMore = tree.root.findByProps({
            testID: 'taskTodayMore'
        }).props;
        await act(() => taskTodayMore.onPress());
        expect(mockNavigate).toHaveBeenCalledWith('Plus');
    });

    it('daily task section will display a maximum of four log tabs.', async () => {
        const logTabItem = tree.root.findAllByType(LogTab);
        expect(logTabItem.length).toBe(4);
    });

    it('daily un Finished task is properly marked as a tick with a green background in the daily task is hidden', async () => {
        let logHydration = tree.root.findByProps({
            title: 'Log Hydration'
        }).props;
        await act(() => logHydration.onTabPress());
        expect(logHydration.active).toBe(false);
        expect(mockNavigate).toBeCalledWith('LogWaterIntake');
    });

    it('daily Finished task is properly marked as a tick with a green background in the daily task', async () => {
        let logTab = tree.root.findByProps({
            title: 'Log Blood Glucose'
        }).props;
        await act(() => logTab.onTabPress());
        expect(logTab.active).toBe(true);
        expect(mockNavigate).toBeCalledWith('LogBlood');
    });
});
