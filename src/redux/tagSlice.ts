import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseApi } from '../Firebase';
import { Tag, TagWithId, WithLoadingState } from '../types';
import { AppThunk } from './store';

export interface TagState {
  tags: {
    value: Array<TagWithId> | null,
  } & WithLoadingState;
}

const initialState: TagState = {
  tags: {
    value: null,
    loadState: 'idle',
  },
};

export const asyncGetTags = createAsyncThunk(
  'tag/getTags',
  async (action: { firebaseApi: FirebaseApi }) => {
    return await action.firebaseApi.asyncGetTags();
  }
);

export const userSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    setTags: (state, action: PayloadAction<{
      value: Array<TagWithId>,
    } & WithLoadingState>) => {
      state.tags.value = action.payload.value;
      state.tags.loadState = action.payload.loadState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetTags.pending, (state) => {
        state.tags.value = null;
        state.tags.loadState = 'loading';
      })
      .addCase(asyncGetTags.fulfilled, (state, action) => {
        state.tags.value = action.payload;
        state.tags.loadState = 'idle';
      })
      .addCase(asyncGetTags.rejected, (state, action) => {
        state.tags.value = null;
        state.tags.loadState = 'failed';
      });
  },
});

export const { setTags } = userSlice.actions;

export const handleCreateTag =
  (firebaseApi: FirebaseApi, tag: Tag): AppThunk =>
    async (dispatch, getState) => {
      const existingTags = getState().tag.tags.value;
      if (existingTags === null) {
        // TODO throw exception
        return;
      }
      const newTag = await firebaseApi.asyncCreateTag(tag);
      dispatch(setTags({ value: [...existingTags, newTag], loadState: getState().tag.tags.loadState }));
    };

export const handleDeleteTag =
  (firebaseApi: FirebaseApi, tagId: string): AppThunk =>
    async (dispatch, getState) => {
      await firebaseApi.asyncDeleteTag(tagId);
      dispatch(asyncGetTags({ firebaseApi }));
    };

export default userSlice.reducer;
