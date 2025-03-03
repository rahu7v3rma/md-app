import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getVersion } from 'react-native-device-info';
import { useSelector } from 'react-redux';
import { PURGE } from 'redux-persist';
import semverCoerce from 'semver/functions/coerce';
import semverGte from 'semver/functions/gte';
import semverValid from 'semver/functions/valid';

import * as api from '@/services/api';
import { RootState } from '@/store';
import { COMMON } from '@/utils/common';

interface ClientConfigState {
    loading: boolean;
    gotLatestVersion: boolean | undefined;
    gotMinimalVersion: boolean | undefined;
    storeUrl: string | undefined;
}

const initialState: ClientConfigState = {
    loading: false,
    gotLatestVersion: undefined,
    gotMinimalVersion: undefined,
    storeUrl: undefined
};

export const getClientConfig = createAsyncThunk(
    'clientConfig/getClientConfig',
    async (_options: {}, { rejectWithValue }) => {
        try {
            const platform = COMMON.isIos ? 'ios' : 'android';
            const version = getVersion();

            return await api.getClientConfig(platform, version);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const clientConfigSlice = createSlice({
    name: 'clientConfig',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getClientConfig.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getClientConfig.fulfilled, (state, action) => {
            const latestVersion = semverValid(
                semverCoerce(action.payload.latest_version)
            );
            const minimalVersion = semverValid(
                semverCoerce(action.payload.minimal_version)
            );

            const currentVersion = semverValid(semverCoerce(getVersion()));

            // any of the versions can be null if a non-standard version string
            // was provided to semver
            if (currentVersion) {
                if (latestVersion) {
                    state.gotLatestVersion = semverGte(
                        currentVersion,
                        latestVersion
                    );
                }
                if (minimalVersion) {
                    state.gotMinimalVersion = semverGte(
                        currentVersion,
                        minimalVersion
                    );
                }
            }

            state.storeUrl = action.payload.store_url;
            state.loading = false;
        });
        builder.addCase(getClientConfig.rejected, (state) => {
            state.loading = false;
        });
        // when purging reset back to the initial state
        builder.addCase(PURGE, () => initialState);
    }
});

export default clientConfigSlice.reducer;

interface ClientConfigSelectorsType {
    loading: boolean;
    gotLatestVersion: boolean | undefined;
    gotMinimalVersion: boolean | undefined;
    storeUrl: string | undefined;
}

export const ClientConfigSelectors = (): ClientConfigSelectorsType => {
    const loading = useSelector(
        (state: RootState) => state.clientConfig.loading
    );

    const gotLatestVersion = useSelector(
        (state: RootState) => state.clientConfig.gotLatestVersion
    );

    const gotMinimalVersion = useSelector(
        (state: RootState) => state.clientConfig.gotMinimalVersion
    );

    const storeUrl = useSelector(
        (state: RootState) => state.clientConfig.storeUrl
    );

    return {
        loading,
        gotLatestVersion,
        gotMinimalVersion,
        storeUrl
    };
};
