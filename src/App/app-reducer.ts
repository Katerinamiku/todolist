import { AppThunkType } from "../reducers/store";
import { authAPI } from "../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/errorUtils";
import axios from "axios";
import { setIsLoggedInAC } from "../reducers/login-reducer";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type ErrorType = string | null;
export type AppStateType = {
  status: RequestStatusType;
  error: ErrorType;
  isInitialized: boolean;
};
export type AppReducerActionsType =
  | ReturnType<typeof setAppStatusAC>
  | ReturnType<typeof setAppErrorAC>
  | ReturnType<typeof setIsInitializedAC>;

const initialState: AppStateType = {
  status: "idle",
  error: null,
  isInitialized: false,
};

export const appReducer = (
  state: AppStateType = initialState,
  action: AppReducerActionsType
): AppStateType => {
  switch (action.type) {
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    case "APP/SET-ERROR":
      return { ...state, error: action.error };
    case "APP/SET-INITIALIZED":
      return { ...state, isInitialized: action.value };
    default:
      return state;
  }
};
//--------------------AC----------------------
export const setAppStatusAC = (status: RequestStatusType) => {
  return {
    type: "APP/SET-STATUS",
    status,
  } as const;
};
export const setAppErrorAC = (error: ErrorType) => {
  return {
    type: "APP/SET-ERROR",
    error,
  } as const;
};
export const setIsInitializedAC = (value: boolean) => {
  return {
    type: "APP/SET-INITIALIZED",
    value,
  } as const;
};
//--------------THUNK---------------------------
export const initializeAppTC = (): AppThunkType => async (dispatch) => {
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true));
    } else {
      handleServerAppError(res.data, dispatch);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleServerNetworkError(error, dispatch);
    }
  } finally {
    dispatch(setIsInitializedAC(true));
  }
};
