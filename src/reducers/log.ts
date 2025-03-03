import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { PURGE } from 'redux-persist';

import * as api from '@/services/api';
import { RootState } from '@/store';
import { dailyCompletedLogs, PickerValues, recentLogs } from '@/types/log';

interface LogState {
    loading: boolean;
    pickerValues: PickerValues;
    pickerValuesLastFetched: string | undefined;
    recent: recentLogs;
    dailyTasks: {
        list: Array<string>[];
        lastUpdatedDate: string;
    };
    dailyCompletedLogs: dailyCompletedLogs;
    defaultLogMedicationValues: {
        medication: number;
        drug: any;
        dose: any;
    };
}

const initialState: LogState = {
    loading: false,
    pickerValues: {
        hydration: { units: [] },
        weight: { units: [] },
        glucose: { measurement_types: [], units: [] },
        medication: { drugs: [], doses: [] },
        insulin: { injection_types: [] },
        exercise: { types: [], intensities: [] }
    },
    pickerValuesLastFetched: undefined,
    recent: {
        count: 0,
        nextPage: 1,
        data: []
    },
    dailyTasks: {
        list: [],
        lastUpdatedDate: ''
    },
    dailyCompletedLogs: {
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
            status: false,
            date: null
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
    },
    defaultLogMedicationValues: {
        medication: 1,
        drug: null,
        dose: null
    }
};

export const createLogMeal = createAsyncThunk(
    'log/food',
    async (
        options: { logTime: string; image: string },
        { rejectWithValue }
    ) => {
        try {
            return await api.createLogMeal(options.logTime, options.image);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const updateLogMeal = createAsyncThunk(
    'log/updateMeal',
    async (
        options: {
            id: number | string;
            logTime: string;
            image: string;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.updateLogMeal(
                options.id,
                options.logTime,
                options.image
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const updateLogActivity = createAsyncThunk(
    'log/updateExercise',
    async (
        options: {
            id: number | string;
            duration_minutes: number | string;
            activity_type: string;
            intensity: string | number;
            log_time: string;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.updateLogActivity(
                options.id,
                options.activity_type,
                options.duration_minutes,
                options.intensity,
                options.log_time
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const logActivity = createAsyncThunk(
    'log/exercise',
    async (
        options: {
            duration_minutes: number;
            activity_type: string;
            intensity: string;
            log_time: string;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.logExercise({
                activity_type: options.activity_type,
                duration_minutes: options.duration_minutes,
                intensity: options.intensity,
                log_time: options.log_time
            });
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const getLogPickerValues = createAsyncThunk(
    'log/pickerValues',
    async (_options: {}, { rejectWithValue, getState }) => {
        const { pickerValuesLastFetched } = getState().log;

        // this action is invoked a lot, but should only fetch from backend
        // at most once per day
        if (
            !pickerValuesLastFetched ||
            moment().diff(moment(pickerValuesLastFetched), 'hour') > 24
        ) {
            try {
                return await api.getLogPickerValues();
            } catch (err) {
                return rejectWithValue(err);
            }
        } else {
            return null;
        }
    }
);

export const createLogWeight = createAsyncThunk(
    'log/weight',
    async (
        options: { logTime: string; amount: number; unit: string },
        { rejectWithValue }
    ) => {
        try {
            return await api.createLogWeight(
                options.logTime,
                options.amount,
                options.unit
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const logMedication = createAsyncThunk(
    'log/medication',
    async (
        options: {
            logTime: string;
            amount: number;
            drugName: string;
            dose: string;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.logMedication(
                options.logTime,
                options.amount,
                options.drugName,
                options.dose
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const updateLogMedication = createAsyncThunk(
    'log/updateMedication',
    async (
        options: {
            id: any;
            logTime: string;
            amount: number;
            drugName: string;
            dose: string;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.updateLogMedication(
                options.id,
                options.logTime,
                options.amount,
                options.drugName,
                options.dose
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const deleteLogMedication = createAsyncThunk(
    'log/deleteMedication',
    async (
        options: {
            logId: string;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.deleteLogMedication(options.logId);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const createLogFast = createAsyncThunk(
    'log/fast',
    async (
        options: { logTime: string; durationMinutes: number },
        { rejectWithValue }
    ) => {
        try {
            return await api.createLogFast(
                options.logTime,
                options.durationMinutes
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const updateLogFast = createAsyncThunk(
    'log/updateFast',
    async (
        options: { id: number; logTime: string; durationMinutes: number },
        { rejectWithValue }
    ) => {
        try {
            return await api.updateLogFast(
                options.id,
                options.logTime,
                options.durationMinutes
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const createLogWaterIntake = createAsyncThunk(
    'log/water',
    async (
        options: { log_time: string; amount: number; unit: string },
        { rejectWithValue }
    ) => {
        try {
            return await api.createWaterIntakeLog(
                options.log_time,
                options.amount,
                options.unit
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const updateLogWaterIntake = createAsyncThunk(
    'log/updateWater',
    async (
        options: {
            id: number | string;
            log_time: string;
            amount: number;
            unit: string;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.updateWaterIntakeLog(
                options.id,
                options.log_time,
                options.amount,
                options.unit
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const createLogBlood = createAsyncThunk(
    '/log/glucose',
    async (
        options: {
            logTime: string;
            amount: number;
            unit: string;
            measurementType: string;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.createLogBlood(
                options.logTime,
                options.amount,
                options.unit,
                options.measurementType
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const updateLogBlood = createAsyncThunk(
    'log/updateGlucose',
    async (
        options: {
            id: number | string;
            logTime: string;
            amount: number;
            unit: string;
            measurementType: string;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.updateLogBlood(
                options.id,
                options.logTime,
                options.amount,
                options.unit,
                options.measurementType
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const createLogInsulin = createAsyncThunk(
    '/log/insulin',
    async (
        options: {
            logTime: string;
            units: number;
            injectionType: string;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.createLogInsulin(
                options.logTime,
                options.units,
                options.injectionType
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const updateLogInsulin = createAsyncThunk(
    '/log/updateInsulin',
    async (
        options: {
            id: number | string;
            logTime: string;
            units: number;
            injectionType: string;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.updateLogInsulin(
                options.id,
                options.logTime,
                options.units,
                options.injectionType
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const deleteLogInsulin = createAsyncThunk(
    '/log/deleteInsulin',
    async (
        options: {
            id: number | string;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.deleteLogInsulin(options.id);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const getRecentLogs = createAsyncThunk(
    '/log/recent',
    async (
        options: {
            page: number;
            limit: number;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.getRecentLog(options.page, options.limit);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const updateLogWeight = createAsyncThunk(
    'log/weight/update',
    async (
        options: {
            logTime: string;
            amount: number;
            unit: string;
            logId: number;
        },
        { rejectWithValue }
    ) => {
        try {
            return await api.updateLogWeight(
                options.logTime,
                options.amount,
                options.unit,
                options.logId
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const getDailyTasks = createAsyncThunk(
    'get/daily/tasks',
    async (_options: {}, { rejectWithValue }) => {
        try {
            return await api.getDailyTasks();
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const getDailyCompletedLogs = createAsyncThunk(
    '/log/daily-completed-logs-task',
    async (options: { date: Date }, { rejectWithValue }) => {
        try {
            return await api.getDailyCompletedLogs(options.date);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const deleteActivityLog = createAsyncThunk(
    '/log/delete-activity-log',
    async (_options: { logId: string }, { rejectWithValue }) => {
        try {
            return await api.deleteActivityLog(_options.logId);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const deleteMealLog = createAsyncThunk(
    '/log/delete-meal-log',
    async (_options: { logId: string }, { rejectWithValue }) => {
        try {
            return await api.deleteMealLog(_options.logId);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const deleteWaterInTakeLog = createAsyncThunk(
    '/log/delete-water-in-take-log',
    async (_options: { logId: string }, { rejectWithValue }) => {
        try {
            return await api.deleteWaterInTakeLog(_options.logId);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const deleteBloodLog = createAsyncThunk(
    '/log/delete-blood-log',
    async (_options: { logId: string }, { rejectWithValue }) => {
        try {
            return await api.deleteBloodLog(_options.logId);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const deleteLogFast = createAsyncThunk(
    '/log/delete-fast-log',
    async (_options: { logId: string }, { rejectWithValue }) => {
        try {
            return await api.deleteLogFast(_options.logId);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const deleteLogWeight = createAsyncThunk(
    '/log/delete-log-weight',
    async (_options: { logId: string }, { rejectWithValue }) => {
        try {
            return await api.deleteLogWeight(_options.logId);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const logSlice = createSlice({
    name: 'log',
    initialState,
    reducers: {
        storeDefaultMedicationValues(state, action) {
            state.defaultLogMedicationValues = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createLogMeal.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createLogMeal.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = [
                {
                    ...action.payload,
                    type: 'UserFood'
                },
                ...state.recent.data
            ];

            if (state.dailyCompletedLogs.UserFood) {
                state.dailyCompletedLogs.UserFood.date = moment(
                    action.payload.logTime
                ).format('YYYY-MM-DD');
            }
        });
        builder.addCase(createLogMeal.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(logMedication.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(logMedication.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = [
                {
                    ...action.payload,
                    type: 'UserMedication'
                },
                ...state.recent.data
            ];

            if (state.dailyCompletedLogs.UserMedication) {
                state.dailyCompletedLogs.UserMedication.date = moment(
                    action.payload.logTime
                ).format('YYYY-MM-DD');
            }
        });
        builder.addCase(logMedication.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(updateLogMedication.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateLogMedication.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.map((log) =>
                log.id === action.payload.id && log.type === 'UserMedication'
                    ? {
                          ...action.payload,
                          type: 'UserMedication'
                      }
                    : log
            );
        });
        builder.addCase(updateLogMedication.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteLogMedication.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteLogMedication.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.filter(
                (item) => item.id + '' !== action.meta.arg.logId
            );
        });
        builder.addCase(deleteLogMedication.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(getLogPickerValues.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getLogPickerValues.fulfilled, (state, action) => {
            if (action.payload !== null) {
                state.pickerValues = action.payload;
                state.pickerValuesLastFetched = moment().toISOString();
            }

            state.loading = false;
        });
        builder.addCase(getLogPickerValues.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(createLogFast.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createLogFast.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = [
                {
                    ...action.payload,
                    type: 'UserFast'
                },
                ...state.recent.data
            ];

            if (state.dailyCompletedLogs.UserFast) {
                state.dailyCompletedLogs.UserFast.date = moment(
                    action.payload.logTime
                ).format('YYYY-MM-DD');
            }
        });
        builder.addCase(createLogFast.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(updateLogFast.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateLogFast.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.map((log) =>
                log.id === action.payload.id && log.type === 'UserFast'
                    ? {
                          ...action.payload,
                          type: 'UserFast'
                      }
                    : log
            );
        });
        builder.addCase(updateLogFast.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(getRecentLogs.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getRecentLogs.fulfilled, (state, action) => {
            const {
                count = 0,
                next_page_number = null,
                has_previous,
                list = []
            } = action.payload;
            if (!has_previous) {
                state.recent.data = list;
            } else {
                state.recent.data = [...state.recent.data, ...list];
            }
            state.recent.count = count;
            state.recent.nextPage = next_page_number;
            state.loading = false;
        });
        builder.addCase(getRecentLogs.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(createLogWeight.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createLogWeight.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = [
                {
                    ...action.payload,
                    type: 'UserWeight'
                },
                ...state.recent.data
            ];

            if (state.dailyCompletedLogs.UserWeight) {
                state.dailyCompletedLogs.UserWeight.date = moment(
                    action.payload.logTime
                ).format('YYYY-MM-DD');
            }
        });
        builder.addCase(createLogWeight.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(updateLogWeight.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateLogWeight.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.map((log) =>
                log.id === action.payload.id && log.type === 'UserWeight'
                    ? {
                          ...action.payload,
                          type: 'UserWeight'
                      }
                    : log
            );
        });
        builder.addCase(updateLogWeight.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(createLogBlood.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createLogBlood.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = [
                {
                    ...action.payload,
                    type: 'UserGlucose'
                },
                ...state.recent.data
            ];

            if (state.dailyCompletedLogs.UserGlucose) {
                state.dailyCompletedLogs.UserGlucose.date = moment(
                    action.payload.logTime
                ).format('YYYY-MM-DD');
            }
        });
        builder.addCase(createLogBlood.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(updateLogBlood.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateLogBlood.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.map((log) =>
                log.id === action.payload.id && log.type === 'UserGlucose'
                    ? {
                          ...action.payload,
                          type: 'UserGlucose'
                      }
                    : log
            );
        });
        builder.addCase(updateLogBlood.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(createLogWaterIntake.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createLogWaterIntake.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = [
                {
                    ...action.payload,
                    type: 'UserDrink'
                },
                ...state.recent.data
            ];

            if (state.dailyCompletedLogs.UserDrink) {
                state.dailyCompletedLogs.UserDrink.date = moment(
                    action.payload.logTime
                ).format('YYYY-MM-DD');
            }
        });
        builder.addCase(createLogWaterIntake.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(updateLogWaterIntake.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateLogWaterIntake.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.map((log) =>
                log.id === action.payload.id && log.type === 'UserDrink'
                    ? {
                          ...action.payload,
                          type: 'UserDrink'
                      }
                    : log
            );
        });
        builder.addCase(updateLogWaterIntake.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(updateLogMeal.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateLogMeal.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.map((log) =>
                log.id === action.payload.id && log.type === 'UserFood'
                    ? {
                          ...action.payload,
                          type: 'UserFood'
                      }
                    : log
            );
        });
        builder.addCase(updateLogMeal.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(logActivity.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(logActivity.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = [
                {
                    ...action.payload,
                    type: 'UserExercise'
                },
                ...state.recent.data
            ];

            if (state.dailyCompletedLogs.UserExercise) {
                state.dailyCompletedLogs.UserExercise.date = moment(
                    action.payload.logTime
                ).format('YYYY-MM-DD');
            }
        });
        builder.addCase(logActivity.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(updateLogActivity.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateLogActivity.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.map((log) =>
                log.id === action.payload.id && log.type === 'UserExercise'
                    ? {
                          ...action.payload,
                          type: 'UserExercise'
                      }
                    : log
            );
        });
        builder.addCase(updateLogActivity.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(getDailyTasks.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getDailyTasks.fulfilled, (state, action) => {
            state.loading = false;
            state.dailyTasks.list = action.payload;
            state.dailyTasks.lastUpdatedDate = moment().format('YYYY-MM-DD');
        });
        builder.addCase(getDailyTasks.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(getDailyCompletedLogs.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getDailyCompletedLogs.fulfilled, (state, action) => {
            state.dailyCompletedLogs = action.payload;
            state.loading = false;
        });
        builder.addCase(getDailyCompletedLogs.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteBloodLog.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteBloodLog.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.filter(
                (item) => item.id + '' !== action.meta.arg.logId
            );
        });
        builder.addCase(deleteBloodLog.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteLogFast.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteLogFast.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.filter(
                (item) => item.id + '' !== action.meta.arg.logId
            );
        });
        builder.addCase(deleteLogFast.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteLogWeight.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteLogWeight.fulfilled, (state, action) => {
            state.recent.data = state.recent.data.filter(
                (item) => item.id + '' !== action.meta.arg.logId
            );
            state.loading = false;
        });
        builder.addCase(deleteLogWeight.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteActivityLog.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteActivityLog.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.filter(
                (item) => item.id + '' !== action.meta.arg.logId
            );
        });
        builder.addCase(deleteActivityLog.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(createLogInsulin.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createLogInsulin.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = [
                {
                    ...action.payload,
                    type: 'UserInsulin'
                },
                ...state.recent.data
            ];

            if (state.dailyCompletedLogs.UserInsulin) {
                state.dailyCompletedLogs.UserInsulin.date = moment(
                    action.payload.logTime
                ).format('YYYY-MM-DD');
            }
        });
        builder.addCase(createLogInsulin.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(updateLogInsulin.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateLogInsulin.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.map((log) =>
                log.id === action.payload.id && log.type === 'UserInsulin'
                    ? {
                          ...action.payload,
                          type: 'UserInsulin'
                      }
                    : log
            );
        });
        builder.addCase(updateLogInsulin.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteLogInsulin.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteLogInsulin.fulfilled, (state, action) => {
            state.recent.data = state.recent.data.filter(
                (log) =>
                    !(
                        log.type === 'UserInsulin' &&
                        log.id === action.meta.arg.id
                    )
            );
            state.loading = false;
        });
        builder.addCase(deleteLogInsulin.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteWaterInTakeLog.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteWaterInTakeLog.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.filter(
                (item) => item.id + '' !== action.meta.arg.logId
            );
        });
        builder.addCase(deleteWaterInTakeLog.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteMealLog.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteMealLog.fulfilled, (state, action) => {
            state.loading = false;
            state.recent.data = state.recent.data.filter(
                (item) => item.id + '' !== action.meta.arg.logId
            );
        });
        builder.addCase(deleteMealLog.rejected, (state) => {
            state.loading = false;
        });
        // when purging reset back to the initial state
        builder.addCase(PURGE, () => initialState);
    }
});

export const { storeDefaultMedicationValues } = logSlice.actions;

export default logSlice.reducer;

interface LogSelectorsType {
    loading: boolean;
    pickerValues: PickerValues;
    recent: recentLogs;
    dailyTasks: {
        list: Array<string>[];
        lastUpdatedDate: string;
    };
    dailyCompletedTasks: dailyCompletedLogs;
    defaultLogMedicationValues: {
        medication: number;
        drug: any;
        dose: any;
    };
}

export const LogSelectors = (): LogSelectorsType => {
    const loading = useSelector((state: RootState) => state.log.loading);

    const pickerValues = useSelector(
        (state: RootState) => state.log.pickerValues
    );

    const recent = useSelector((state: RootState) => state.log.recent);

    const dailyTasks = useSelector((state: RootState) => state.log.dailyTasks);

    const dailyCompletedTasks = useSelector(
        (state: RootState) => state.log.dailyCompletedLogs
    );

    const defaultLogMedicationValues = useSelector(
        (state: RootState) => state.log.defaultLogMedicationValues
    );

    return {
        loading,
        pickerValues,
        recent,
        dailyTasks,
        dailyCompletedTasks,
        defaultLogMedicationValues
    };
};
