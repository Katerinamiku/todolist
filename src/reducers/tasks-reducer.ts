import {AddTodolistAC, RemoveTodolistAC, setTodolistsAC} from "./todolist-reducer";
import {TasksPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../api/todolists-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
//------------------TYPES----------------------
export type TaskStateType = {
    [key: string]: Array<TaskType>
}
export type ActionType = ReturnType<typeof addTaskAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof AddTodolistAC>
    | ReturnType<typeof RemoveTodolistAC>
    | ReturnType<typeof setTodolistsAC>

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string | null
    completed?: boolean
    status?: TaskStatuses
    priority?: TasksPriorities
    startDate?: string | null
    deadline?: string | null
}
//--------------------FUNC---------------------------
const initialState: TaskStateType = {}

export const tasksReducer = (state = initialState, action: ActionType): TaskStateType => {
    switch (action.type) {
        case 'SET_TODOLISTS':
            const stateCopy = {...state}
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        case 'SET_TASKS':
            return {...state, [action.todolistId]: action.tasks}
        case 'REMOVE_TASK':
            return {
                ...state, [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)
            }
        case 'ADD_TASK':
            return {
                ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        case 'UPDATE_TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map((t) => t.id === action.taskId ? {...action.task} : t)
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
//-------------------AC--------------------
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
export const updateTaskAC = (taskId: string, task: TaskType, todolistId: string) => {
    return {
        type: 'UPDATE_TASK',
        taskId,
        task,
        todolistId
    } as const
}
//-----------------THUNK-------------------
export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionType>) => {
        todolistsAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTasksAC(res.data.items, todolistId))
            })
    }
}
export const removeTaskTC = (taskID: string, todolistID: string) => {
    return (dispatch: Dispatch<ActionType>) => {
        todolistsAPI.deleteTask(taskID, todolistID)
            .then(res => {
                dispatch(removeTaskAC(taskID, todolistID));
            })
    }
}
export const addTaskTC = (title: string, todolistID: string) => {
    return (dispatch: Dispatch<ActionType>) => {
        todolistsAPI.createTask(todolistID, title)
            .then(res => {
                dispatch(addTaskAC(res.data.data.item))
            })
    }
}
export const updateTaskModelTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistID: string) => {
    return (dispatch: Dispatch<ActionType>, getState: () => AppRootStateType) => {
        const task = getState().tasks[todolistID].find(t => t.id === taskId);
        if (!task) {
            console.warn('task not fount in the state')
            return
        }
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            completed: task.completed,
            status: task.status,
            priority: task.priority,
            deadline: task.deadline,
            startDate: task.startDate,
            ...domainModel
        }
        todolistsAPI.updateTask(todolistID, taskId, apiModel)
            .then(res => {
                dispatch(updateTaskAC(taskId, res.data.data.item, todolistID))
            })
    }
}

