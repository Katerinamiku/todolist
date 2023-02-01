import { setAppErrorAC, setAppStatusAC } from "../App/app-reducer";
import { AppThunkType } from "./store";
import {
  authAPI,
  FieldsErrorsType,
  LoginParamsType,
  resultCodes,
} from "../api/todolists-api";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/errorUtils";
import { AxiosError } from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value;
    },
  },
});

export const authReducer = slice.reducer;
export const { setIsLoggedInAC } = slice.actions;
// -----------------actions---------------
// export const setIsLoggedInAC = (value: boolean) =>
//   ({ type: "login/SET-IS-LOGGED-IN", value } as const);

//------------------thunks------------------

// export const loginTC =
//   (data: LoginParamsType): AppThunkType =>
//   async (dispatch) => {
//     dispatch(setAppStatusAC("loading"));
//     try {
//       const res = await authAPI.login(data);
//       if (res.data.resultCode === 0) {
//         dispatch(setIsLoggedInAC(true));
//         dispatch(setAppStatusAC("succeeded"));
//       } else {
//         handleServerAppError(res.data, dispatch);
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         handleServerNetworkError(error, dispatch);
//       }
//     }
//   };

export const loginTC = createAsyncThunk<
  undefined,
  LoginParamsType,
  {
    rejectValue: {
      errors: Array<string>;
      fieldsErrors?: Array<FieldsErrorsType>;
    };
  }
>("auth/login", async (param, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(setAppStatusAC({ status: "loading" }));
  try {
    const res = await authAPI.login(param);
    if (res.data.resultCode === resultCodes.success) {
      dispatch(setIsLoggedInAC({ value: true }));
      dispatch(setAppStatusAC({ status: "succeeded" }));
      return;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      });
    }
  } catch (e) {
    let error = e as AxiosError;
    handleServerNetworkError(error, dispatch);
    return rejectWithValue({
      errors: [error.message],
      fieldsErrors: undefined,
    });
  }
});

// export const logoutTC = (): AppThunkType => async (dispatch) => {
//   dispatch(setAppStatusAC("loading"));
//   try {
//     const res = await authAPI.logout();
//     if (res.data.resultCode === 0) {
//       dispatch(setIsLoggedInAC(false));
//       dispatch(setAppStatusAC("succeeded"));
//     } else {
//       handleServerAppError(res.data, dispatch);
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       handleServerNetworkError(error, dispatch);
//     }
//   }
// };
export const logoutTC = createAsyncThunk(
  "auth/logout",
  async (param, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(setAppStatusAC({ status: "loading" }));
    try {
      const res = await authAPI.logout();
      console.log(res);
      if (res.data.resultCode === resultCodes.success) {
        dispatch(setIsLoggedInAC({ value: false }));
        dispatch(setAppStatusAC({ status: "succeeded" }));
        return;
      } else {
        return rejectWithValue(null);
      }
    } catch (e) {
      let error = e as AxiosError;
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);
export type AuthLoginActionsType =
  | ReturnType<typeof setAppStatusAC>
  | ReturnType<typeof setAppErrorAC>
  | ReturnType<typeof setIsLoggedInAC>;
