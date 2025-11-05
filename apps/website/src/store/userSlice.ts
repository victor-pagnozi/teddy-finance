import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
  name: string;
};

function loadInitialName(): string {
  try {
    const stored = localStorage.getItem('userName');
    return stored ?? '';
  } catch {
    return '';
  }
}

const initialState: UserState = {
  name: loadInitialName(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
      try {
        localStorage.setItem('userName', state.name);
      } catch {}
    },
  },
});

export const { setName } = userSlice.actions;
export default userSlice.reducer;
