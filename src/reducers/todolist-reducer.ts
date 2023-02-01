import { todolistsAPI, TodolistType } from "../api/todolists-api";
import { AppThunkType } from "./store";
import { RequestStatusType, setAppStatusAC } from "../App/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/errorUtils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//------------------TYPES----------------------
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
export type TodolistsActionType =
  | ReturnType<typeof RemoveTodolistAC>
  | ReturnType<typeof AddTodolistAC>
  | ReturnType<typeof ChangeTodoListTitleAC>
  | ReturnType<typeof ChangeTodolistFilterAC>
  | ReturnType<typeof setTodolistsAC>
  | ReturnType<typeof ChangeTodolistEntityStatusAC>;
//------------------FUNC---------------------------
const initialState: Array<TodolistDomainType> = [];

const slice = createSlice({
  name: "todolists",
  initialState: initialState,
  reducers: {
    setTodolistsAC(
      state,
      action: PayloadAction<{ todolists: Array<TodolistType> }>
    ) {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }));
    },
    RemoveTodolistAC(state, action: PayloadAction<{ id: string }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index > -1) {
        state.splice(index, 1);
      }
    },
    AddTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({
        ...action.payload.todolist,
        filter: "all",
        entityStatus: "idle",
      });
    },
    ChangeTodoListTitleAC(
      state,
      action: PayloadAction<{ title: string; id: string }>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].title = action.payload.title;
    },
    ChangeTodolistFilterAC(
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].filter = action.payload.filter;
    },
    ChangeTodolistEntityStatusAC(
      state,
      action: PayloadAction<{ id: string; status: RequestStatusType }>
    ) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      state[index].entityStatus = action.payload.status;
    },
  },
});

export const todolistsReducer = slice.reducer;
export const {
  setTodolistsAC,
  RemoveTodolistAC,
  AddTodolistAC,
  ChangeTodoListTitleAC,
  ChangeTodolistFilterAC,
  ChangeTodolistEntityStatusAC,
} = slice.actions;

//---------------THUNK------------------
export const fetchTodolistsTC = (): AppThunkType => async (dispatch) => {
  dispatch(setAppStatusAC({ status: "loading" }));
  const res = await todolistsAPI.getTodolists();
  dispatch(setTodolistsAC({ todolists: res.data }));
  dispatch(setAppStatusAC({ status: "succeeded" }));
};
export const removeTodolistTC =
  (todolistID: string): AppThunkType =>
  (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    dispatch(
      ChangeTodolistEntityStatusAC({ id: todolistID, status: "loading" })
    );
    todolistsAPI
      .deleteTodolists(todolistID)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(RemoveTodolistAC({ id: todolistID }));
          dispatch(setAppStatusAC({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
        dispatch(
          ChangeTodolistEntityStatusAC({ id: todolistID, status: "failed" })
        );
      });
  };
export const addTodolistTC =
  (title: string): AppThunkType =>
  (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    todolistsAPI
      .createTodolists(title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(AddTodolistAC({ todolist: res.data.data.item }));
          dispatch(setAppStatusAC({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => handleServerNetworkError(error, dispatch));
  };
export const changeTodolistTitleTC =
  (title: string, todolistID: string): AppThunkType =>
  (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    dispatch(
      ChangeTodolistEntityStatusAC({ id: todolistID, status: "loading" })
    );
    todolistsAPI
      .updateTodolists(title, todolistID)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(ChangeTodoListTitleAC({ title: title, id: todolistID }));
          dispatch(setAppStatusAC({ status: "succeeded" }));
          dispatch(
            ChangeTodolistEntityStatusAC({
              id: todolistID,
              status: "succeeded",
            })
          );
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
        dispatch(
          ChangeTodolistEntityStatusAC({ id: todolistID, status: "failed" })
        );
      });
  };
