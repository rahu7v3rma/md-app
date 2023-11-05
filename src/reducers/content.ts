import {
    createAsyncThunk,
    createSelector,
    createSlice
} from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { PURGE } from 'redux-persist';

import * as api from '@/services/api';
import { RootState } from '@/store';
import { UserBlock, UserLesson } from '@/types/content';

interface ContentState {
    loading: boolean;
    journey: UserBlock[];
    navigationKey: string;
}

const initialState: ContentState = {
    loading: false,
    journey: [],
    navigationKey: ''
};

export const loadJourney = createAsyncThunk(
    'content/loadJourney',
    async (_options: Record<string, never>, { rejectWithValue }) => {
        try {
            return await api.getUserJourney();
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const loadLesson = createAsyncThunk(
    'content/loadLesson',
    async (options: { lessonId: number }, { rejectWithValue }) => {
        try {
            return await api.getLesson(options.lessonId);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

export const completeLesson = createAsyncThunk(
    'content/completeLesson',
    async (options: { lessonId: number }, { rejectWithValue }) => {
        try {
            return await api.completeLesson(options.lessonId);
        } catch (err) {
            return rejectWithValue(err);
        }
    }
);

const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {
        navigation: (state, action) => {
            state.navigationKey = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loadJourney.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(loadJourney.fulfilled, (state, action) => {
            state.loading = false;
            state.journey = action.payload;
        });
        builder.addCase(loadJourney.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(loadLesson.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(loadLesson.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(loadLesson.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(completeLesson.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(completeLesson.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(completeLesson.rejected, (state) => {
            state.loading = false;
        });
        // when purging reset back to the initial state
        builder.addCase(PURGE, () => initialState);
    }
});

export default contentSlice.reducer;

export const getNavigationKey = contentSlice.actions;

const getActiveBlock = createSelector(
    [(state: RootState) => state.content.journey],
    (journey: UserBlock[]) => {
        // find the first incomplete user block (if one exists)
        const incompleteBlocks = journey.filter(
            (userBlock: UserBlock) =>
                !userBlock.is_completed && !userBlock.block.locked
        );
        incompleteBlocks.sort(
            (a: UserBlock, b: UserBlock) => a.order - b.order
        );

        if (incompleteBlocks.length > 0) {
            return incompleteBlocks[0];
        } else {
            return null;
        }
    }
);
export const getActiveLesson = createSelector(
    [getActiveBlock],
    (activeBlock: UserBlock | null) => {
        if (activeBlock !== null) {
            // find the first incomplete active block's user lesson (if one
            // exists)
            const incompleteLessons = activeBlock.user_lessons.filter(
                (userLesson) => !userLesson.is_completed
            );
            incompleteLessons.sort(
                (a: UserLesson, b: UserLesson) => a.order - b.order
            );

            if (incompleteLessons.length > 0) {
                return incompleteLessons[0];
            }
        }

        return null;
    }
);

interface ContentSelectorsType {
    loading: boolean;
    journey: UserBlock[];
    navigationKey: string;
    activeBlock: UserBlock | null;
    activeLesson: UserLesson | null;
}

export const ContentSelectors = (): ContentSelectorsType => {
    const loading = useSelector((state: RootState) => state.content.loading);

    const journey = useSelector((state: RootState) => state.content.journey);

    const navigationKey = useSelector(
        (state: RootState) => state.content.navigationKey
    );

    const activeBlock = useSelector(getActiveBlock);

    const activeLesson = useSelector(getActiveLesson);

    return {
        loading,
        journey,
        navigationKey,
        activeBlock,
        activeLesson
    };
};
