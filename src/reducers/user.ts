import {
    createAsyncThunk,
    createSlice,
    isRejectedWithValue
} from '@reduxjs/toolkit';
import { getFirstInstallTime } from 'react-native-device-info';
import { useSelector } from 'react-redux';
import { PURGE } from 'redux-persist';

import * as api from '@/services/api';
import { RootState } from '@/store';
import {
    CoachInfo,
    Group,
    SearchUserList,
    UserChatProfile,
    UserInfo,
    UserProfile
} from '@/types/user';
import { logoutAction } from '@/utils/auth';
import { COMMON } from '@/utils/common';

export interface AuthState {
    loading: boolean;
    userInfo: UserInfo | null;
    userProfile: UserProfile | null;
    chatProfile: UserChatProfile | null;
    searchUserDataResult: SearchUserList[];
    searchText: string | null;
    coach: CoachInfo | null;
    hasCoachChat: boolean | null;
    group: Group | null;
}

const initialState: AuthState = {
    loading: false,
    userInfo: null,
    userProfile: null,
    chatProfile: null,
    searchUserDataResult: [],
    searchText: null,
    coach: null,
    hasCoachChat: null,
    group: null
};

export const userLogin = createAsyncThunk(
    'user/login',
    async (
        options: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            return await api.login(options.email, options.password);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const firstChangePassword = createAsyncThunk(
    'user/first-change-password',
    async (
        options: { email: string; old_password: string; new_password: string },
        { rejectWithValue }
    ) => {
        try {
            return await api.firstChangePassword(
                options.email,
                options.old_password,
                options.new_password
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const changePassword = createAsyncThunk(
    'user/change-password',
    async (
        options: { old_password: string; new_password: string },
        { rejectWithValue }
    ) => {
        try {
            return await api.changePassword(
                options.old_password,
                options.new_password
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);
export const resetPassword = createAsyncThunk(
    '/user/reset/request',
    async (options: { email: string; client: string }, { rejectWithValue }) => {
        try {
            return await api.resetPassword(options.email, options.client);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const resetPasswordVerify = createAsyncThunk(
    'user/reset/verify',
    async (options: { code: string }, { rejectWithValue }) => {
        try {
            return await api.resetPasswordVerify(options.code);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const resetPasswordConfirm = createAsyncThunk(
    '/user/reset/confirm',
    async (
        options: { code: string | null; password: string },
        { rejectWithValue }
    ) => {
        try {
            return await api.resetPasswordConfirm(
                options.code,
                options.password
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const deleteAccount = createAsyncThunk(
    'user/deleteAccount',
    async (options: { password: string }, { rejectWithValue }) => {
        try {
            return await api.deleteAccount(options.password);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const getProfile = createAsyncThunk(
    'user/getProfile',
    async (_options: {}, { rejectWithValue }) => {
        try {
            return await api.getProfile();
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);
export const refreshProfileSession = createAsyncThunk(
    'user/refreshProfileSession',
    async (options: { fcmToken?: string }, { rejectWithValue }) => {
        try {
            // use first install time to identify the device so we don't use
            // ids that can identify the device and require any special terms
            // to use
            const deviceId = await getFirstInstallTime();
            const deviceType = COMMON.isIos ? 'ios' : 'android';

            // calculate local timezone offset from utc in hours. multiply by
            // -1 since the offset is negated - if we are at UTC+2 the value
            // would be -120. divide by 60 since the value is in minutes
            const utcTimeDiffHours = (new Date().getTimezoneOffset() * -1) / 60;

            return await api.refreshProfileSession(
                options.fcmToken,
                deviceId.toString(),
                deviceType,
                utcTimeDiffHours
            );
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);
export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (options: { image: string }, { rejectWithValue }) => {
        try {
            return await api.updateProfile(options.image);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const getCoach = createAsyncThunk(
    'user/getCoach',
    async (options, { rejectWithValue }) => {
        try {
            return await api.getCoach();
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);
interface SearchFilterDataPayload {
    readonly payload: SearchUserList;
}
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        searchFilterAction(state, action) {
            state.searchText = action.payload;
        },

        addSearchFilterData(state, { payload }: SearchFilterDataPayload) {
            if (payload) {
                state.searchUserDataResult.push(payload);
            }
        },

        clearSearchText(state) {
            state.searchText = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(userLogin.fulfilled, (state, action) => {
            state.userInfo = action.payload;
            state.loading = false;
        });
        builder.addCase(userLogin.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(firstChangePassword.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(firstChangePassword.fulfilled, (state, action) => {
            state.userInfo = action.payload;
            state.loading = false;
        });
        builder.addCase(firstChangePassword.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(changePassword.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(changePassword.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(changePassword.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(resetPassword.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(resetPassword.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(resetPassword.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(resetPasswordVerify.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(resetPasswordVerify.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(resetPasswordVerify.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(resetPasswordConfirm.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(resetPasswordConfirm.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(resetPasswordConfirm.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteAccount.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteAccount.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(deleteAccount.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(getProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.userProfile = action.payload;
        });
        builder.addCase(getProfile.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(refreshProfileSession.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(refreshProfileSession.fulfilled, (state, action) => {
            state.loading = false;
            state.chatProfile = action.payload;
        });
        builder.addCase(refreshProfileSession.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(updateProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false;

            if (state.userProfile) {
                state.userProfile.image = action.meta.arg.image;
            }
        });
        builder.addCase(updateProfile.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(getCoach.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getCoach.fulfilled, (state, action) => {
            state.loading = false;
            state.hasCoachChat = action.payload.hasCoachChat;
            state.coach = action.payload.coach;
            state.group = action.payload.group;
        });
        builder.addCase(getCoach.rejected, (state) => {
            state.loading = false;
            state.coach = null;
        });

        // when purging reset back to the initial state
        builder.addCase(PURGE, () => initialState);

        // matcher which matches any rejected (with value) action to catch
        // unauthorized errors and trigger a logout
        builder.addMatcher(isRejectedWithValue(), (state, action: any) => {
            // if a user is logged in and the action payload has a status
            // which is 401 (unauthorized), trigger a logout
            if (
                state.userInfo !== null &&
                action.payload &&
                action.payload.status &&
                action.payload.status === 401
            ) {
                // useImmediate so that the logout logic is not triggered
                // from within the reducer (which will disable us from
                // using getState, something we need to do when purging)
                setImmediate(logoutAction);
            }
        });
    }
});

export const { searchFilterAction, addSearchFilterData, clearSearchText } =
    userSlice.actions;
export default userSlice.reducer;

interface UserSelectorsType {
    loading: boolean;
    userInfo: UserInfo | null;
    userProfile: UserProfile | null;
    chatProfile: UserChatProfile | null;
    searchUserDataResult: SearchUserList[] | [];
    searchText: string | null;
    coach: CoachInfo | null;
    hasCoachChat: boolean | null;
    group: Group | null;
}

export const UserSelectors = (): UserSelectorsType => {
    const loading = useSelector((state: RootState) => state.user.loading);

    const userInfo = useSelector((state: RootState) => state.user.userInfo);

    const userProfile = useSelector(
        (state: RootState) => state.user.userProfile
    );
    const chatProfile = useSelector(
        (state: RootState) => state.user.chatProfile
    );

    const searchUserDataResult = useSelector(
        (state: RootState) => state.user.searchUserDataResult
    );

    const searchText = useSelector((state: RootState) => state.user.searchText);

    const coach = useSelector((state: RootState) => state.user.coach);

    const hasCoachChat = useSelector(
        (state: RootState) => state.user.hasCoachChat
    );

    const group = useSelector((state: RootState) => state.user.group);

    return {
        loading,
        userInfo,
        userProfile,
        chatProfile,
        searchUserDataResult,
        searchText,
        coach,
        hasCoachChat,
        group
    };
};
