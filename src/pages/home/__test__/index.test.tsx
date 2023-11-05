import {
    NavigationContainer,
    NavigationProp,
    RouteProp
} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import 'react-native';
import { Provider } from 'react-redux';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';

import { mockNavigate } from '@/jestSetup';
import Home from '@/pages/home';
import store from '@/store';
import { MockData } from '@/utils/mockData';

jest.unmock('@/hooks');
jest.unmock('@/services/notification');
jest.mock('@/hooks', () => ({
    useAppDispatch: () =>
        jest.fn().mockImplementation(() => {
            return {
                unwrap: jest.fn().mockImplementation(() => {
                    return Promise.resolve(['UserGlucose']);
                })
            };
        }),
    useCurrentDate: () =>
        jest.fn().mockImplementation(() => {
            return new Date();
        })
}));

jest.mock('@/reducers/log', () => ({
    LogSelectors: jest.fn(),
    getDailyCompletedLogs: jest.fn(),
    getLogPickerValues: jest.fn(),
    createLogMeal: jest.fn(),
    updateLogMeal: jest.fn(),
    updateLogActivity: jest.fn(),
    logActivity: jest.fn(),
    createLogWeight: jest.fn(),
    logMedication: jest.fn(),
    updateLogMedication: jest.fn(),
    deleteLogMedication: jest.fn(),
    getDailyTasks: jest.fn(),
    createLogFast: jest.fn(),
    updateLogFast: jest.fn(),
    createLogWaterIntake: jest.fn(),
    updateLogWaterIntake: jest.fn(),
    createLogBlood: jest.fn(),
    updateLogBlood: jest.fn(),
    createLogInsulin: jest.fn(),
    updateLogInsulin: jest.fn(),
    deleteLogInsulin: jest.fn(),
    getRecentLogs: jest.fn(),
    updateLogWeight: jest.fn(),
    deleteActivityLog: jest.fn(),
    deleteMealLog: jest.fn(),
    deleteWaterInTakeLog: jest.fn(),
    deleteBloodLog: jest.fn(),
    deleteLogFast: jest.fn(),
    deleteLogWeight: jest.fn()
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
        jest.spyOn(console, 'debug').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(
            require('@/reducers/log'),
            'LogSelectors'
        ).mockImplementation(
            () =>
                ({
                    loading: false,
                    logTabData: MockData.logTabData,
                    dailyCompletedTasks: MockData.dailyCompletedTasks,
                    dailyTasks: {},
                    pickerValues: MockData.pickerValues,
                    recent: {},
                    defaultLogMedicationValues: {},
                    dailyCompletedLogsDate: {
                        UserGlucose: moment(new Date()).format('DD-MM-YYYY')
                    }
                } as any)
        );
        await act(async () => {
            tree = renderer.create(
                <NavigationContainer>
                    <Provider store={store}>
                        <Home {...props} />
                    </Provider>
                </NavigationContainer>
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
            label: 'Chat with Coach name'
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
        const logTabItem = tree.root.findAllByProps({
            icon: '<svg> </svg> '
        });
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
