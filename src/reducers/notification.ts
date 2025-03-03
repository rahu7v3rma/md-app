import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { PURGE } from 'redux-persist';

import * as api from '@/services/api';
import { RootState } from '@/store';
import { DailyLog, Log, NotificationListResponse } from '@/types/notification';

interface NotificationState {
    loading: boolean;
    dailyLog: DailyLog;
    notification: NotificationListResponse;
    totalUnread: number;
}

const initialState: NotificationState = {
    loading: false,
    dailyLog: {},
    notification: {
        count: 0,
        has_next: true,
        has_previous: false,
        list: [],
        next_page_number: 1
    },
    totalUnread: 0
};

export const logNotification = createAsyncThunk(
    'notification/logNotification',
    async (options: { date: string; log: Log }, { rejectWithValue }) => {
        try {
            return options;
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const getNotifications = createAsyncThunk(
    'notification/get-notifications',
    async (options: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            return api.getNotificationList(options.page, options.limit);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const updateNotification = createAsyncThunk(
    'notification/updateNotification',
    async (options: { id: number }, { rejectWithValue }) => {
        try {
            return api.updateNotification(options.id);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(logNotification.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(logNotification.fulfilled, (state, action) => {
            state.loading = false;
            state.dailyLog[action.payload.date] = {
                ...state.dailyLog[action.payload.date],
                ...action.payload.log
            };
        });
        builder.addCase(logNotification.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(getNotifications.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getNotifications.fulfilled, (state, action) => {
            if (state.notification.has_previous) {
                const oldData = state.notification.list;
                action.payload.list = [...oldData, ...action.payload.list];
            }
            state.notification = action.payload;
            state.totalUnread = action.payload.total_unread;
            state.loading = false;
        });
        builder.addCase(getNotifications.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(updateNotification.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateNotification.fulfilled, (state, action) => {
            if ('notification_id' in action.payload) {
                state.notification.list = state.notification.list.map(
                    (notification) => {
                        if (
                            notification.id === action.payload.notification_id
                        ) {
                            notification.read_flag = true;
                        }
                        return notification;
                    }
                );
                state.totalUnread = state.totalUnread - 1;
            }
            state.loading = false;
        });
        builder.addCase(updateNotification.rejected, (state) => {
            state.loading = false;
        });
        // when purging reset back to the initial state
        builder.addCase(PURGE, () => initialState);
    }
});

export default notificationSlice.reducer;

interface NotificationSelectorsType {
    loading: boolean;
    dailyLog: DailyLog;
    notification: NotificationListResponse;
    totalUnread: number;
}

export const NotificationSelectors = (): NotificationSelectorsType => {
    const loading = useSelector(
        (state: RootState) => state.notification.loading
    );

    const dailyLog = useSelector(
        (state: RootState) => state.notification.dailyLog
    );

    const notification = useSelector(
        (state: RootState) => state.notification.notification
    );

    const totalUnread = useSelector(
        (state: RootState) => state.notification.totalUnread
    );

    return {
        loading,
        dailyLog,
        notification,
        totalUnread
    };
};
