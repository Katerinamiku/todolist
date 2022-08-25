import {TaskStateType} from "../App";
import {v1} from "uuid";
import {AddTodolistAT, RemoveTodolistAT} from "./todolist-reducer";
import {TasksPriorities, TaskStatuses, TaskType} from "../api/todolists-api";

//------------------TYPES----------------------
type RemoveTaskAT = {
    type: 'REMOVE_TASK'
    taskId: string
    todolistId: string
}
type AddTaskAT = {
    type: 'ADD_TASK'
    title: string
    todolistId: string
}

type ChangeTaskStatusAT = {
    type: 'CHANGE_TASK_STATUS'
    taskId: string
    status: TaskStatuses
    todolistId: string
}

type ChangeTaskTitleAT = {
    type: 'CHANGE_TASK_TITLE'
    taskId: string
    title: string
    todolistId: string
}

const initialState: TaskStateType = {}


export type ActionType = RemoveTaskAT | AddTaskAT | ChangeTaskStatusAT | ChangeTaskTitleAT | AddTodolistAT | RemoveTodolistAT

//--------------------FUNC---------------------------
export const tasksReducer = (state = initialState, action: ActionType): TaskStateType => {
    switch (action.type) {
        case 'REMOVE_TASK':
            return {
                ...state, [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)
            }
        case 'ADD_TASK':
            const newTask: TaskType = {id: v1(), title: action.title, status: TaskStatuses.New, todoListId: action.todolistId, description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle}
            return {
                ...state, [action.todolistId]: [newTask, ...state[action.todolistId]]
            }
        case 'CHANGE_TASK_STATUS':
            return {
                ...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, status: action.status} : t)
            }
        case 'CHANGE_TASK_TITLE':
            return {
                ...state, [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, title: action.title} : t)
            }
        case 'ADD_TODOLIST': //из todolistReducer
            return {
                ...state, [action.todolistId]: []
            }
        case 'REMOVE_TODOLIST': //из todolistReducer
            let copyState = {...state};
            delete copyState[action.id];
            return copyState

        default:
            return state
    }
}
//-----------------------AC------------------------------
export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskAT => {
    return {
        type: 'REMOVE_TASK',
        taskId,
        todolistId
    }
}
export const addTaskAC = (title: string, todolistId: string): AddTaskAT => {
    return {
        type: 'ADD_TASK',
        title,
        todolistId
    }
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusAT => {
    return {
        type: 'CHANGE_TASK_STATUS',
        taskId,
        status,
        todolistId
    }
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleAT => {
    return {
        type: 'CHANGE_TASK_TITLE',
        taskId,
        title,
        todolistId
    }
}


//используем actionCreatorы из TodolistReducer потому что они общие и изначально действие совершается с todolist
