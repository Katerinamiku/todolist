import {FilterValuesType, TodoListType} from "../App";
//------------------TYPES----------------------
type RemoveTodolistAT = {
    type: 'REMOVE_TODOLIST'
    id: string
}
type AddTodolistAT = {
    type: 'ADD_TODOLIST'
    title: string
    id: string
}
type ChangeTodoListTitleAT = {
    type: 'CHANGE_TODOLIST_TITLE'
    title: string
    id: string
}
type ChangeTodolistFilterAT = {
    type: 'CHANGE_TODOLIST_FILTER'
    id: string
    filter: FilterValuesType
}
export type ActionType = RemoveTodolistAT | AddTodolistAT | ChangeTodoListTitleAT | ChangeTodolistFilterAT
//----Можно через Return type когда типы сложно определить---------
// export type ActionType =
//     ReturnType<typeof RemoveTodolistAT> |
//     ReturnType<typeof AddTodolistAT> |
//     ReturnType<typeof ChangeTodoListTitleAT> |
//     ReturnType<typeof ChangeTodolistFilterAT>

//--------------------FUNC---------------------------
export const todolistsReducer = (todolists: Array<TodoListType>, action: ActionType): Array<TodoListType> => {
    switch (action.type) {
        case 'REMOVE_TODOLIST':
            return todolists.filter(tl => tl.id !== action.id)
        case 'ADD_TODOLIST':
            return [{id: action.id, title: action.title, filter: "all"}, ...todolists]
        case 'CHANGE_TODOLIST_TITLE':
            return todolists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE_TODOLIST_FILTER':
            return todolists.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        default:
            return todolists
    }
}
//-----------------------AC------------------------------
export const RemoveTodolistAC = (id: string): RemoveTodolistAT => {
    return {
        type: 'REMOVE_TODOLIST',
        id
    }
}
export const AddTodolistAC = (title: string, id: string): AddTodolistAT => {
    return {
        type: 'ADD_TODOLIST',
        title,
        id
    }
}
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
