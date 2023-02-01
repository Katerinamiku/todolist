import {
  AddTodolistAC,
  ChangeTodolistEntityStatusAC,
  RemoveTodolistAC,
  setTodolistsAC,
} from "./todolist-reducer";
import {
  TasksPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  UpdateTaskModelType,
} from "../api/todolists-api";
import { AppRootStateType, AppThunkType } from "./store";
import { RequestStatusType, setAppStatusAC } from "../App/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkError,
} from "../utils/errorUtils";
//------------------TYPES----------------------
export type TaskStateType = {
  [key: string]: Array<TaskDomainType>;
};
export type TaskDomainType = TaskType & {
  entityStatus: RequestStatusType;
};
export type TasksActionType =
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof setTasksAC>
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof updateTaskAC>
  | ReturnType<typeof AddTodolistAC>
  | ReturnType<typeof RemoveTodolistAC>
  | ReturnType<typeof setTodolistsAC>
  | ReturnType<typeof setTaskStatusAC>;

export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string | null;
  completed?: boolean;
  status?: TaskStatuses;
  priority?: TasksPriorities;
  startDate?: string | null;
  deadline?: string | null;
};
//--------------------FUNC---------------------------
const initialState: TaskStateType = {};

export const tasksReducer = (
  state = initialState,
  action: any
): TaskStateType => {
  switch (action.type) {
    case setTodolistsAC.type:
      const stateCopy = { ...state };
      action.payload.todolists.forEach((tl: any) => {
        stateCopy[tl.id] = [];
      });
      return stateCopy;
    case "SET_TASKS":
      return {
        ...state,
        [action.todolistId]: action.tasks.map((task: any) => ({
          ...task,
          entityStatus: "idle",
        })),
      };
    case "SET_TASKS_STATUS":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((task) =>
          task.id === action.taskId
            ? { ...task, entityStatus: action.status }
            : task
        ),
      };
    case "REMOVE_TASK":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(
          (task) => task.id !== action.taskId
        ),
      };
    case "ADD_TASK":
      return {
        ...state,
        [action.todolistId]: [
          { ...action.task, entityStatus: "idle" },
          ...state[action.todolistId],
        ],
      };
    case "UPDATE_TASK":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((task) =>
          task.id === action.task.id ? { ...task, ...action.task } : task
        ),
      };
    case AddTodolistAC.type: //из todolistReducer
      return {
        ...state,
        [action.payload.todolist.id]: [],
      };
    case RemoveTodolistAC.type: //из todolistReducer
      let copyState = { ...state };
      delete copyState[action.payload.id];
      return copyState;

    default:
      return state;
  }
};
//-------------------AC--------------------
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
  return {
    type: "SET_TASKS",
    tasks,
    todolistId,
  } as const;
};
export const removeTaskAC = (taskId: string, todolistId: string) => {
  return {
    type: "REMOVE_TASK",
    taskId,
    todolistId,
  } as const;
};
export const addTaskAC = (task: TaskType, todolistId: string) => {
  return {
    type: "ADD_TASK",
    task,
    todolistId,
  } as const;
};
export const updateTaskAC = (
  taskId: string,
  task: TaskType,
  todolistId: string
) => {
  return {
    type: "UPDATE_TASK",
    taskId,
    task,
    todolistId,
  } as const;
};
export const setTaskStatusAC = (
  taskId: string,
  status: RequestStatusType,
  todolistId: string
) => {
  return {
    type: "SET_TASKS_STATUS",
    taskId,
    status,
    todolistId,
  } as const;
};
//-----------------THUNK-------------------
export const fetchTasksTC = (todolistId: string): AppThunkType => {
  return (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    todolistsAPI
      .getTasks(todolistId)
      .then((res) => {
        dispatch(setTasksAC(res.data.items, todolistId));
        dispatch(setAppStatusAC({ status: "succeeded" }));
      })
      .catch((error) => handleServerNetworkError(error, dispatch));
  };
};
export const removeTaskTC = (
  taskID: string,
  todolistID: string
): AppThunkType => {
  return (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    dispatch(setTaskStatusAC(taskID, "loading", todolistID));
    todolistsAPI
      .deleteTask(taskID, todolistID)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(removeTaskAC(taskID, todolistID));
          dispatch(setAppStatusAC({ status: "succeeded" }));
          dispatch(setTaskStatusAC(taskID, "succeeded", todolistID));
        } else {
          handleServerAppError(res.data, dispatch);
          dispatch(setTaskStatusAC(taskID, "failed", todolistID));
        }
      })
      .catch((error) => handleServerNetworkError(error, dispatch));
  };
};
export const addTaskTC = (title: string, todolistID: string): AppThunkType => {
  return (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    dispatch(
      ChangeTodolistEntityStatusAC({ id: todolistID, status: "loading" })
    );
    todolistsAPI
      .createTask(todolistID, title)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(addTaskAC(res.data.data.item, todolistID));
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
      .catch((error) => handleServerNetworkError(error, dispatch));
  };
};
export const updateTaskModelTC = (
  taskId: string,
  domainModel: UpdateDomainTaskModelType,
  todolistID: string
): AppThunkType => {
  return (dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistID].find((t) => t.id === taskId);
    if (!task) {
      console.warn("task not found in the state");
      return;
    }
    const apiModel: UpdateTaskModelType = {
      title: task.title,
      description: task.description,
      completed: task.completed,
      status: task.status,
      priority: task.priority,
      deadline: task.deadline,
      startDate: task.startDate,
      ...domainModel,
    };
    dispatch(setAppStatusAC({ status: "loading" }));
    dispatch(setTaskStatusAC(taskId, "loading", todolistID));
    todolistsAPI
      .updateTask(todolistID, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(updateTaskAC(taskId, res.data.data.item, todolistID));
          dispatch(setAppStatusAC({ status: "succeeded" }));
          dispatch(setTaskStatusAC(taskId, "succeeded", todolistID));
        } else {
          handleServerAppError(res.data, dispatch);
          dispatch(setTaskStatusAC(taskId, "failed", todolistID));
        }
      })
      .catch((error) => handleServerNetworkError(error, dispatch));
  };
};
