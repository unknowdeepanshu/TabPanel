import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Theme = "dark" | "light" | "system";
interface DarkMode {
  theme: Theme;
}

// Define the initial state using that type
const initialState: DarkMode = {
  theme: "light",
};

export const iframDarkMode = createSlice({
  name: "DarkMod",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = iframDarkMode.actions;

export default iframDarkMode.reducer;
