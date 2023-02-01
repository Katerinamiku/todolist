import { AppThunkType } from "../reducers/store";
import { authAPI } from "../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/errorUtils";
import axios from "axios";
import { setIsLoggedInAC } from "../reducers/login-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type ErrorType = string | null;
export type AppReducerActionsType =
  | ReturnType<typeof setAppStatusAC>
  | ReturnType<typeof setAppErrorAC>
  | ReturnType<typeof setIsInitializedAC>;

const slice = createSlice({
  name: "app",
  initialState: {
    status: "idle" as RequestStatusType,
    error: null as ErrorType,
    isInitialized: false as boolean,
  },
  reducers: {
    setAppStatusAC(
      state,
      action: PayloadAction<{ status: RequestStatusType }>
    ) {
      state.status = action.payload.status;
    },
    setAppErrorAC(state, action: PayloadAction<{ error: ErrorType }>) {
      state.error = action.payload.error;
    },
    setIsInitializedAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isInitialized = action.payload.value;
    },
  },
});

export const appReducer = slice.reducer;
export const { setAppStatusAC, setAppErrorAC, setIsInitializedAC } =
  slice.actions;

//--------------THUNK---------------------------
export const initializeAppTC = (): AppThunkType => async (dispatch) => {
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({ value: true }));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleServerNetworkError(error, dispatch);
    }
  } finally {
    dispatch(setIsInitializedAC({ value: true }));
  }
};
