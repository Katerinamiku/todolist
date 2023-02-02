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
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const slice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    setTasksAC(
      state,
      action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>
    ) {
      state[action.payload.todolistId] = action.payload.tasks.map((task) => ({
        ...task,
        entityStatus: "idle",
      }));
    },
    removeTaskAC(
      state,
      action: PayloadAction<{ taskId: string; todolistId: string }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        tasks.splice(index, 1);
      }
    },
    addTaskAC(
      state,
      action: PayloadAction<{ task: TaskType; todolistId: string }>
    ) {
      state[action.payload.todolistId].unshift({
        ...action.payload.task,
        entityStatus: "idle",
      });
    },
    updateTaskAC(
      state,
      action: PayloadAction<{
        taskId: string;
        task: TaskType;
        todolistId: string;
      }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.task };
      }
    },
    setTaskStatusAC(
      state,
      action: PayloadAction<{
        taskId: string;
        status: RequestStatusType;
        todolistId: string;
      }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index > -1) {
        tasks[index].entityStatus = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach((tl: any) => {
        state[tl.id] = [];
      });
    });
    builder.addCase(AddTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = [];
    });
    builder.addCase(RemoveTodolistAC, (state, action) => {
      delete state[action.payload.id];
    });
  },
});

export const tasksReducer = slice.reducer;
export const {
  setTaskStatusAC,
  updateTaskAC,
  addTaskAC,
  removeTaskAC,
  setTasksAC,
} = slice.actions;

//-----------------THUNK-------------------
export const fetchTasksTC = (todolistId: string): AppThunkType => {
  return (dispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    todolistsAPI
      .getTasks(todolistId)
      .then((res) => {
        dispatch(setTasksAC({ tasks: res.data.items, todolistId: todolistId }));
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
    dispatch(
      setTaskStatusAC({
        taskId: taskID,
        status: "loading",
        todolistId: todolistID,
      })
    );
    todolistsAPI
      .deleteTask(taskID, todolistID)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(removeTaskAC({ taskId: taskID, todolistId: todolistID }));
          dispatch(setAppStatusAC({ status: "succeeded" }));
          dispatch(
            setTaskStatusAC({
              taskId: taskID,
              status: "succeeded",
              todolistId: todolistID,
            })
          );
        } else {
          handleServerAppError(res.data, dispatch);
          dispatch(
            setTaskStatusAC({
              taskId: taskID,
              status: "failed",
              todolistId: todolistID,
            })
          );
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
          dispatch(
            addTaskAC({ task: res.data.data.item, todolistId: todolistID })
          );
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
    dispatch(
      setTaskStatusAC({
        taskId: taskId,
        status: "loading",
        todolistId: todolistID,
      })
    );
    todolistsAPI
      .updateTask(todolistID, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(
            updateTaskAC({
              taskId: taskId,
              task: res.data.data.item,
              todolistId: todolistID,
            })
          );
          dispatch(setAppStatusAC({ status: "succeeded" }));
          dispatch(
            setTaskStatusAC({
              taskId: taskId,
              status: "succeeded",
              todolistId: todolistID,
            })
          );
        } else {
          handleServerAppError(res.data, dispatch);
          dispatch(
            setTaskStatusAC({
              taskId: taskId,
              status: "failed",
              todolistId: todolistID,
            })
          );
        }
      })
      .catch((error) => handleServerNetworkError(error, dispatch));
  };
};
