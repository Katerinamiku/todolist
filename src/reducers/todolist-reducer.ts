import {FilterValuesType, TodoListType} from "../App";
import {v1} from "uuid";
//------------------TYPES----------------------
export type RemoveTodolistAT = {
    type: 'REMOVE_TODOLIST'
    id: string
}
export type AddTodolistAT = {
    type: 'ADD_TODOLIST'
    title: string
    todolistId: string
}
export type ChangeTodoListTitleAT = {
    type: 'CHANGE_TODOLIST_TITLE'
    title: string
    id: string
}
export type ChangeTodolistFilterAT = {
    type: 'CHANGE_TODOLIST_FILTER'
    id: string
    filter: FilterValuesType
}

const initialState: Array<TodoListType> = []

export type ActionType = RemoveTodolistAT | AddTodolistAT | ChangeTodoListTitleAT | ChangeTodolistFilterAT
//----Можно через Return type когда типы сложно определить---------
// export type ActionType =
//     ReturnType<typeof RemoveTodolistAT> |
//     ReturnType<typeof AddTodolistAT> |
//     ReturnType<typeof ChangeTodoListTitleAT> |
//     ReturnType<typeof ChangeTodolistFilterAT>

//--------------------FUNC---------------------------
export const todolistsReducer = (state = initialState, action: ActionType): Array<TodoListType> => {
    switch (action.type) {
        case 'REMOVE_TODOLIST':
            return state.filter(tl => tl.id !== action.id)
        case 'ADD_TODOLIST':
            return [ {id: action.todolistId, title: action.title, filter: "all"}, ...state]
        case 'CHANGE_TODOLIST_TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE_TODOLIST_FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        default:
            return state
    }
}
//-----------------------AC------------------------------
export const RemoveTodolistAC = (id: string): RemoveTodolistAT => {
    return {
        type: 'REMOVE_TODOLIST',
        id
    }
}
export const AddTodolistAC = (title: string): AddTodolistAT => {
    return {
        type: 'ADD_TODOLIST',
        title,
        todolistId: v1()
    }
}
//создали id  в эксш креэйторе так как нужно чтобы он попал в оба рудьюсера
export const ChangeTodoListTitleAC = (title: string, id: string): ChangeTodoListTitleAT => {
    return {
        type: 'CHANGE_TODOLIST_TITLE',
        title,
        id
    }
}
export const ChangeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterAT => {
    return {
        type: 'CHANGE_TODOLIST_FILTER',
        id,
        filter
    }
}
