import { NavigationContainer } from '@react-navigation/native';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { Provider } from 'react-redux';
import renderer, { act } from 'react-test-renderer';

import { mockNavigate } from '@/jestSetup';
import Me from '@/pages/me';
import logReducer from '@/reducers/log';
import { mockLogMeData } from '@/utils/mockData';

jest.unmock('@/hooks');

jest.unmock('@/reducers/log');

jest.mock('@/services/api', () => ({
    getRecentLog: jest.fn() // Mock the getRecentLog function
}));

const mockReducer = combineReducers({
    log: logReducer
});

const mockStore = configureStore({
    reducer: mockReducer,
    preloadedState: {
        log: mockLogMeData
    }
});
it('renders correctly', () => {
    const tree = renderer
        .create(
            <Provider store={mockStore}>
                <Me />
            </Provider>
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('redirects to logActivity page when clicking on logActivity logbookItem', async () => {
    const tree = renderer.create(
        <NavigationContainer>
            <Provider store={mockStore}>
                <Me />
            </Provider>
        </NavigationContainer>
    );
    const items = [
        {
            name: 'Activity0',
            type: 'LogActivity',
            item: {
                activity_type: 'walking',
                duration_minutes: '123',
                id: 1,
                intensity: '3',
                log_time: '2023-03-08T12:12:12Z',
                type: 'UserExercise'
            }
        },
        {
            name: 'Weight1',
            type: 'LogWeight',
            item: {
                amount: '111',
                id: 2,
                log_time: '2023-01-12T09:00:00Z',
                type: 'UserWeight',
                unit: 'kg'
            }
        },
        {
            name: 'Fast2',
            type: 'LogFast',
            item: {
                duration_minutes: '123',
                id: 3,
                log_time: '2012-12-12T12:12:12Z',
                type: 'UserFast'
            }
        },
        {
            name: 'Insulin3',
            type: 'LogInsulin',
            item: {
                id: 4,
                injection_type: 'cc',
                log_time: '2012-12-12T12:12:12Z',
                type: 'UserInsulin',
                units: '111'
            }
        },
        {
            name: 'Glucose4',
            type: 'LogBlood',
            item: {
                amount: 7.2,
                id: 5,
                log_time: '2012-12-12T12:12:12Z',
                measurement_type: 'Pre Meal',
                type: 'UserGlucose',
                unit: 'ml'
            }
        },
        {
            name: 'Drink5',
            type: 'LogWaterIntake',
            item: {
                amount: '12',
                id: 6,
                log_time: '2012-12-12T12:12:12Z',
                type: 'UserDrink',
                unit: 'oz'
            }
        },
        {
            name: 'Medication6',
            type: 'LogMedication',
            item: {
                amount: '21',
                dose: '0.25 mg',
                drug_name: 'Ibuprofen 100',
                id: 7,
                log_time: '2012-12-12T12:12:12Z',
                type: 'UserMedication',
                unit: 'cc'
            }
        },
        {
            name: 'Food',
            type: 'LogMeal',
            item: {
                id: 8,
                image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                log_time: '2012-12-12T12:12:12Z',
                type: 'UserFood'
            }
        }
    ];

    items.forEach(async (item) => {
        const logActivityItem = tree.root.findByProps({
            testID: item.name
        }).props;
        await act(() => logActivityItem.onPress());
        expect(mockNavigate).toBeCalledWith(item.type, { params: item.item });
    });
});
