import { TasksActionType, tasksReducer } from "./tasks-reducer";
import { TodolistsActionType, todolistsReducer } from "./todolist-reducer";
import { combineReducers } from "redux";
import thunkMiddleware, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appReducer, AppReducerActionsType } from "../App/app-reducer";
import { AuthLoginActionsType, authReducer } from "./login-reducer";
import { configureStore } from "@reduxjs/toolkit";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});
console.log(typeof rootReducer);
// непосредственно создаём store
//export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));
//store через toolkit - получает defaultmiddlewareы и к ним доьавляем вначало наш
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(thunkMiddleware),
});

export const useAppDispatch = () => useDispatch<AppDispatch>();

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>;
//все типа actions для вcего app
export type AppActionType =
  | TodolistsActionType
  | TasksActionType
  | AppReducerActionsType
  | AuthLoginActionsType;
//типизация Thunk
export type AppThunkType<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  AppActionType
>;
//типмзация Dispatch
export type AppDispatch = ThunkDispatch<
  AppRootStateType,
  unknown,
  AppActionType
>;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> =
  useSelector;
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
