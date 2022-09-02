import {todolistsAPI, TodolistType} from "../api/todolists-api";
import {AppThunkType} from "./store";

//------------------TYPES----------------------
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
export type TodolistsActionType = ReturnType<typeof RemoveTodolistAC>
    | ReturnType<typeof AddTodolistAC>
    | ReturnType<typeof ChangeTodoListTitleAC>
    | ReturnType<typeof ChangeTodolistFilterAC>
    | ReturnType<typeof setTodolistsAC>
//------------------FUNC---------------------------
const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state = initialState, action: TodolistsActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'SET_TODOLISTS':
            return action.todolists.map(tl => ({
                ...tl, filter: 'all'
            }))
        case 'REMOVE_TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD_TODOLIST':
            return [{...action.todolist, filter: 'all'}, ...state]
        case 'CHANGE_TODOLIST_TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE_TODOLIST_FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
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
//---------------THUNK------------------
export const fetchTodolistsTC = (): AppThunkType => async dispatch => {
    const res = await todolistsAPI.getTodolists()
    dispatch(setTodolistsAC(res.data))
}

export const removeTodolistTC = (todolistID: string): AppThunkType =>  (dispatch) => {
        todolistsAPI.deleteTodolists(todolistID)
            .then(res => {
                dispatch(RemoveTodolistAC(todolistID));
            })
}
export const addTodolistTC = (title: string): AppThunkType => (dispatch) => {
        todolistsAPI.createTodolists(title)
            .then(res => {
                dispatch(AddTodolistAC(res.data.data.item))
            })
    }
export const changeTodolistTitleTC = (title: string, todolistID: string): AppThunkType => (dispatch) => {
        todolistsAPI.updateTodolists(title, todolistID)
            .then(rex => {
                dispatch(ChangeTodoListTitleAC(title, todolistID))
            })
    }
