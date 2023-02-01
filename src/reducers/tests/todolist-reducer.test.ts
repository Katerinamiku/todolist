import {
  AddTodolistAC,
  ChangeTodolistEntityStatusAC,
  ChangeTodolistFilterAC,
  ChangeTodoListTitleAC,
  FilterValuesType,
  RemoveTodolistAC,
  setTodolistsAC,
  TodolistDomainType,
  todolistsReducer,
} from "../todolist-reducer";
import { v1 } from "uuid";

// тестовые данные:
let todolistId1: string;
let todolistId2: string;

let startState: Array<TodolistDomainType>;

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();

  startState = [
    {
      id: todolistId1,
      title: "What to learn",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
    {
      id: todolistId2,
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 1,
      entityStatus: "idle",
    },
  ];
});

//-----------------------REMOVE---------------------------
test("correct todolist should be removed", () => {
  // вызов тестируемой функции:
  const endState = todolistsReducer(
    startState,
    RemoveTodolistAC({ id: todolistId2 })
  );
  // cверка результата c ожиданием:
  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId1);
});
//-------------------------ADD-----------------------------
test("new todolist should be added", () => {
  // тестовые данные:
  const newTodoListTitle = "NewTodolist";

  const startState: Array<TodolistDomainType> = [
    {
      id: todolistId1,
      title: "What to learn",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
    {
      id: todolistId2,
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 1,
      entityStatus: "idle",
    },
  ];
  // вызов тестируемой функции:
  const newtodolist = {
    id: todolistId1,
    title: newTodoListTitle,
    addedDate: "",
    order: 0,
  };
  const endState = todolistsReducer(
    startState,
    AddTodolistAC({ todolist: newtodolist })
  );
  // cверка результата c ожиданием:
  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodoListTitle);
});
//-----------------------CHANGE TITLE------------------------
test("correct todolist title should be changed", () => {
  // тестовые данные:
  const changedTodoListTitle = "Changed Todolist Title";

  const startState: Array<TodolistDomainType> = [
    {
      id: todolistId1,
      title: "What to learn",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
    {
      id: todolistId2,
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 1,
      entityStatus: "idle",
    },
  ];
  // вызов тестируемой функции:
  const endState = todolistsReducer(
    startState,
    ChangeTodoListTitleAC({ title: changedTodoListTitle, id: todolistId2 })
  );
  // cверка результата c ожиданием:
  expect(endState.length).toBe(2);
  expect(endState[1].title).toBe(changedTodoListTitle);
  expect(endState[0].title).toBe("What to learn");
});
//----------------------CHANGE FILTER--------------------
test("correct todolist should change filter", () => {
  // тестовые данные:
  const newFilterValue: FilterValuesType = "completed";

  const startState: Array<TodolistDomainType> = [
    {
      id: todolistId1,
      title: "What to learn",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
    {
      id: todolistId2,
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 1,
      entityStatus: "idle",
    },
  ];
  // вызов тестируемой функции:
  const endState = todolistsReducer(
    startState,
    ChangeTodolistFilterAC({ id: todolistId2, filter: newFilterValue })
  );
  // cверка результата c ожиданием:
  expect(endState.length).toBe(2);
  expect(endState[1].filter).toBe(newFilterValue);
  expect(endState[0].filter).toBe("all");
  expect(endState[1].id).toBe(todolistId2);
});
//--------------------STATUS-------------------
test("correct entity status of todolist should be changed", () => {
  const startState: Array<TodolistDomainType> = [
    {
      id: todolistId1,
      title: "What to learn",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
    {
      id: todolistId2,
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 1,
      entityStatus: "idle",
    },
  ];
  const endState = todolistsReducer(
    startState,
    ChangeTodolistEntityStatusAC({ id: todolistId1, status: "loading" })
  );

  expect(endState[0].entityStatus).toBe("loading");
  expect(endState[1].entityStatus).toBe("idle");
});
