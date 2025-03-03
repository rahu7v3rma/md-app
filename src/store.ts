import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    createMigrate,
    FLUSH,
    PAUSE,
    PERSIST,
    PersistedState,
    persistReducer,
    persistStore,
    PURGE,
    REGISTER,
    REHYDRATE
} from 'redux-persist';

import clientConfigReducer from '@/reducers/clientConfig';
import contentReducer from '@/reducers/content';
import logReducer from '@/reducers/log';
import notificationReducer from '@/reducers/notification';
import trackReducer from '@/reducers/track';
import userReducer from '@/reducers/user';

const rootReducer = combineReducers({
    clientConfig: clientConfigReducer,
    content: contentReducer,
    user: userReducer,
    log: logReducer,
    track: trackReducer,
    notification: notificationReducer
});

const migrations = {
    2: (state: PersistedState): PersistedState => {
        // add initial pickerValues - convert to `any` because of an issue with
        // redux-persist's typings -
        // https://github.com/rt2zz/redux-persist/issues/1065
        (state as any).log.pickerValues = {
            hydration: { units: [] },
            weight: { units: [] },
            glucose: { measurement_types: [], units: [] },
            medication: { drugs: [], doses: [] },
            insulin: { injection_types: [] },
            exercise: { types: [], intensities: [] }
        };

        return state;
    }
};

const persistConfig = {
    key: 'root',
    version: 2,
    storage: AsyncStorage,
    blacklist: ['clientConfig'],
    migrate: createMigrate(migrations, { debug: false })
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // disable the serializable check for redux-persist's actions
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                    REHYDRATE
                ]
            }
        })
});

export default store;

export const persistor = persistStore(store);

// infer the `RootState` type from the store
export type RootState = ReturnType<typeof store.getState>;

// infer the `AppDispatch` type from the store so thunk actions can return promises
export type AppDispatch = typeof store.dispatch;

// reset persisted store when a user logs out
export const resetStore = () => {
    persistor.purge().then(() => persistor.flush());
};
