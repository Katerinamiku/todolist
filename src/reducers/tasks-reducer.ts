import {
    AddTodolistAC,
    RemoveTodolistAC,
    setTodolistsAC
} from "./todolist-reducer";
import { TaskStatuses, TaskType, todolistsAPI} from "../api/todolists-api";
import {Dispatch} from "redux";
import {TaskStateType} from "../AppWithRedux";

//------------------TYPES----------------------
const initialState: TaskStateType = {}

export type ActionType =
    ReturnType<typeof addTaskAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof AddTodolistAC>
    | ReturnType<typeof RemoveTodolistAC>
    | ReturnType<typeof setTodolistsAC>

//--------------------FUNC---------------------------
export const tasksReducer = (state = initialState, action: ActionType): TaskStateType => {
    switch (action.type) {
        case 'SET_TODOLISTS':
            const stateCopy = {...state}
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        case 'SET_TASKS':
            const stateTaskCopy = {...state};
            stateTaskCopy[action.todolistId] = action.tasks
            return stateTaskCopy
        case 'REMOVE_TASK':
            return {
                ...state, [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)
            }
        case 'ADD_TASK':
            const newTask: TaskType = action.task
            return {
                ...state, [action.task.todoListId]: [newTask, ...state[action.task.todoListId]]
            }
        case 'CHANGE_TASK_STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    status: action.status
                } : t)
            }
        case 'CHANGE_TASK_TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {
                    ...t,
                    title: action.title
                } : t)
            }
        case 'ADD_TODOLIST': //из todolistReducer
            return {
                ...state, [action.todolist.id]: []
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
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return {
        type: 'SET_TASKS',
        tasks,
        todolistId
    } as const
}
export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: 'REMOVE_TASK',
        taskId,
        todolistId
    } as const
}
export const addTaskAC = (task: TaskType) => {
    return {
        type: 'ADD_TASK',
        task
    } as const
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return {
        type: 'CHANGE_TASK_STATUS',
        taskId,
        status,
        todolistId
    } as const
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string) => {
    return {
        type: 'CHANGE_TASK_TITLE',
        taskId,
        title,
        todolistId
    } as const
}
//--------------THUNK-------------------
export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTasksAC(res.data.items, todolistId))
            })
    }
}
export const removeTaskTC = (taskID: string, todolistID: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.deleteTask(taskID, todolistID)
            .then(res => {
                dispatch(removeTaskAC(taskID, todolistID));
    })
}}

export const addTaskTC = (title: string, todolistID: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.createTask(todolistID, title)
            .then(res => {
                dispatch(addTaskAC(res.data.data.item))
            })
    }
}
//используем actionCreatorы из TodolistReducer потому что они общие и изначально действие совершается с todolist
