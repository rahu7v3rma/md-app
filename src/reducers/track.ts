import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { PURGE } from 'redux-persist';

import { registerTriggerNotifications } from '@/services/notification';
import { RootState } from '@/store';
import { Constants } from '@/utils/constants';

interface TrackState {
    loading: boolean;
    trackFastState: '' | 'tracking' | 'tracked' | 'complete';
    trackStartedAt: string;
    trackedTimeInSeconds: number;
    trackTimeLimitInSeconds: number;
    trackStartTimeInSecond: number;
}

const initialState: TrackState = {
    loading: false,
    trackFastState: '',
    trackStartedAt: '',
    trackedTimeInSeconds: 0,
    trackTimeLimitInSeconds: 16 * (60 * 60),
    trackStartTimeInSecond: 16 * (60 * 60)
};

export const trackStart = createAsyncThunk(
    'track/start',
    async (options: { startDateTime: string }, { rejectWithValue }) => {
        try {
            return options;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const trackedTimeUpdateAuto = createAsyncThunk(
    'track/time/update/auto',
    () => true
);

export const trackedTimeUpdateManual = createAsyncThunk(
    'track/time/update/manual',
    async (options: { trackedTimeInSeconds: number }) => {
        return options;
    }
);

export const trackUpdate = createAsyncThunk(
    'track/update',
    async (options?: { timeToUpdate: number }) => {
        return options;
    }
);

export const trackTimeLimitUpdate = createAsyncThunk(
    'track/updateTime',
    async (options: { timeLimitInSeconds: number }) => {
        return options;
    }
);
export const trackStartTime = createAsyncThunk(
    'start/track',
    async (options: { startTimeInSecond: number }) => {
        return options;
    }
);

export const trackStop = createAsyncThunk('track/stop', async () => {
    return true;
});

export const trackReset = createAsyncThunk('track/reset', async () => {
    return true;
});

export const trackComplete = createAsyncThunk('track/complete', async () => {
    const date = moment().add(2, 'second').toString();
    registerTriggerNotifications(
        new Date(date),
        'Fast is completed',
        'Your fast is completed please log your fast.',
        Constants.notificationType.FAST_COMPLETE
    );
    return true;
});

export const timerStartEnd = createAsyncThunk(
    'track/timer/startEnd',
    async (options: { timerStartedAt: string; timerEndAt: string }) => {
        return options;
    }
);

const trackSlice = createSlice({
    name: 'track',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(trackStart.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(trackStart.fulfilled, (state, action) => {
            state.loading = false;
            state.trackFastState = 'tracking';
            state.trackStartedAt = action.payload.startDateTime;
        });
        builder.addCase(trackStart.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(trackedTimeUpdateAuto.fulfilled, (state) => {
            state.loading = false;
            state.trackedTimeInSeconds += 1;
        });
        builder.addCase(trackedTimeUpdateManual.fulfilled, (state, action) => {
            state.loading = false;
            state.trackedTimeInSeconds = action.payload.trackedTimeInSeconds;
        });

        builder.addCase(trackUpdate.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload && action.payload.timeToUpdate) {
                state.trackedTimeInSeconds =
                    state.trackedTimeInSeconds + action.payload.timeToUpdate;
            } else {
                state.trackedTimeInSeconds = state.trackedTimeInSeconds + 1;
            }
        });

        builder.addCase(trackTimeLimitUpdate.fulfilled, (state, action) => {
            state.trackTimeLimitInSeconds =
                action.payload?.timeLimitInSeconds ?? 16 * (60 * 60);
        });
        builder.addCase(trackStartTime.fulfilled, (state, action) => {
            state.trackStartTimeInSecond =
                action.payload?.startTimeInSecond ?? 16 * (60 * 60);
        });

        builder.addCase(trackStop.fulfilled, (state) => {
            state.loading = false;
            state.trackFastState = 'tracked';
        });

        builder.addCase(trackComplete.fulfilled, (state) => {
            state.loading = false;
            state.trackFastState = 'complete';
        });

        builder.addCase(trackReset.fulfilled, (state) => {
            state.loading = false;
            state.trackFastState = '';
            state.trackStartedAt = '';
            state.trackedTimeInSeconds = 0;
            state.trackTimeLimitInSeconds = 16 * (60 * 60);
            state.trackStartTimeInSecond = 16 * (60 * 60);
        });

        // when purging reset back to the initial state
        builder.addCase(PURGE, () => initialState);
    }
});

export default trackSlice.reducer;

interface TrackSelectorsType {
    loading: boolean;
    trackFastState: '' | 'tracking' | 'tracked' | 'complete';
    trackStartedAt: string;
    trackedTimeInSeconds: number;
    trackTimeLimitInSeconds: number;
    trackStartTimeInSecond: number;
}

export const TrackSelectors = (): TrackSelectorsType => {
    const loading = useSelector((state: RootState) => state.track.loading);

    const trackStartedAt = useSelector(
        (state: RootState) => state.track.trackStartedAt
    );
    const trackFastState = useSelector(
        (state: RootState) => state.track.trackFastState
    );

    const trackedTimeInSeconds = useSelector(
        (state: RootState) => state.track.trackedTimeInSeconds
    );

    const trackTimeLimitInSeconds = useSelector(
        (state: RootState) => state.track.trackTimeLimitInSeconds
    );
    const trackStartTimeInSecond = useSelector(
        (state: RootState) => state.track.trackStartTimeInSecond
    );

    return {
        loading,
        trackFastState,
        trackStartedAt,
        trackedTimeInSeconds,
        trackTimeLimitInSeconds,
        trackStartTimeInSecond
    };
};
