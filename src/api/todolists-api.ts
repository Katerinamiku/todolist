import axios from "axios";
//-------------API & Settings-----------
const settings = {
  withCredentials: true,
  headers: {
    "API-KEY": "f27eec27-3207-4d58-92ee-5102237ee07d",
  },
};
const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  ...settings,
});
//----------------auth----------------------
export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<ResponseType<{ userId: number }>>("/auth/login", data);
  },
  logout() {
    return instance.delete<ResponseType>("/auth/login");
  },
  me() {
    return instance.get<ResponseType<AuthMeType>>("/auth/me");
  },
};
//-----------------todolist-----------------
export const todolistsAPI = {
  getTodolists() {
    return instance.get<Array<TodolistType>>("todo-lists");
  },
  createTodolists(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", {
      title: title,
    });
  },
  deleteTodolists(todolistId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}`);
  },
  updateTodolists(title: string, todolistId: string) {
    return instance.put<ResponseType>(`todo-lists/${todolistId}`, {
      title: title,
    });
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponseType>(`todo-lists/${todolistId}/tasks`);
  },
  createTask(todolistId: string, title: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(
      `todo-lists/${todolistId}/tasks`,
      { title: title }
    );
  },
  deleteTask(taskId: string, todolistId: string) {
    return instance.delete<ResponseType>(
      `todo-lists/${todolistId}/tasks/${taskId}`
    );
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};
//---------------TYPES-----------------
export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};
export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}
export enum TasksPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}
export type TaskType = {
  description: string;
  title: string;
  completed: boolean;
  status: TaskStatuses;
  priority: TasksPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
type GetTasksResponseType = {
  error: string | null;
  totalCount: number;
  items: Array<TaskType>;
};
export type ResponseType<D = {}> = {
  resultCode: number;
  messages: Array<string>;
  fieldsErrors: Array<FieldsErrorsType>;
  data: D;
};
export type UpdateTaskModelType = {
  title: string;
  description: string | null;
  completed: boolean;
  status: TaskStatuses;
  priority: TasksPriorities;
  startDate: string | null;
  deadline: string | null;
};
export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe?: boolean;
  captcha?: string;
};
export type AuthMeType = {
  id: number;
  email: string;
  login: string;
};

export type FieldsErrorsType = { field: string; error: string };
export enum resultCodes {
  success = 0,
  error = 1,
  captcha = 10,
}
