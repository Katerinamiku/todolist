import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {AppThunkType} from "./store";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../App/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/errorUtils";

//------------------TYPES----------------------
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
export type TodolistsActionType = ReturnType<typeof RemoveTodolistAC>
    | ReturnType<typeof AddTodolistAC>
    | ReturnType<typeof ChangeTodoListTitleAC>
    | ReturnType<typeof ChangeTodolistFilterAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof ChangeTodolistEntityStatusAC>
//------------------FUNC---------------------------
const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state = initialState, action: TodolistsActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET_TODOLISTS':
            return action.todolists.map(tl => ({
                ...tl, filter: 'all', entityStatus: 'idle'
            }))
        case 'REMOVE_TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD_TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'CHANGE_TODOLIST_TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE_TODOLIST_FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'CHANGE_TODOLIST_ENTITY_STATUS':
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        default:
            return state
    }
}
//-----------------------AC------------------------------
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({
    type: 'SET_TODOLISTS',
    todolists
} as const)
export const RemoveTodolistAC = (id: string) => ({
    type: 'REMOVE_TODOLIST',
    id
} as const)
export const AddTodolistAC = (todolist: TodolistType) => ({
    type: 'ADD_TODOLIST',
    todolist
} as const)
export const ChangeTodoListTitleAC = (title: string, id: string) => ({
    type: 'CHANGE_TODOLIST_TITLE',
    title,
    id
} as const)
export const ChangeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE_TODOLIST_FILTER',
    id,
    filter
} as const)
export const ChangeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
    type: 'CHANGE_TODOLIST_ENTITY_STATUS',
    id,
    status
} as const)
//---------------THUNK------------------
export const fetchTodolistsTC = (): AppThunkType => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    const res = await todolistsAPI.getTodolists()
    dispatch(setTodolistsAC(res.data))
    dispatch(setAppStatusAC('succeeded'))
}
export const removeTodolistTC = (todolistID: string): AppThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(ChangeTodolistEntityStatusAC(todolistID, 'loading'))
    todolistsAPI.deleteTodolists(todolistID)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(RemoveTodolistAC(todolistID));
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
            dispatch(ChangeTodolistEntityStatusAC(todolistID, 'failed'))
        })
}
export const addTodolistTC = (title: string): AppThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTodolists(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(AddTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => handleServerNetworkError(error, dispatch))
}
export const changeTodolistTitleTC = (title: string, todolistID: string): AppThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(ChangeTodolistEntityStatusAC(todolistID, 'loading'))
    todolistsAPI.updateTodolists(title, todolistID)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(ChangeTodoListTitleAC(title, todolistID))
                dispatch(setAppStatusAC('succeeded'))
                dispatch(ChangeTodolistEntityStatusAC(todolistID, 'succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
            dispatch(ChangeTodolistEntityStatusAC(todolistID, 'failed'))
        })
}
