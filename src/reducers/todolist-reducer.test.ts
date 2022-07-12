import {FilterValuesType, TodoListType} from "../App";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodoListTitleAC,
    RemoveTodolistAC,
    todolistsReducer
} from "./todolist-reducer";
import {v1} from "uuid";
//-----------------------REMOVE---------------------------
test('correct todolist should be removed', () => {
    // тестовые данные:
    let todolistId1 = v1();
    let todolistId2 = v1();

    const startState: Array<TodoListType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]
    // вызов тестируемой функции:
    const endState = todolistsReducer(startState,RemoveTodolistAC(todolistId2))
    // cверка результата c ожиданием:
    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId1);
});
//-------------------------ADD-----------------------------
test('new todolist should be added', () => {
    // тестовые данные:
    let todolistId1 = v1();
    let todolistId2 = v1();

    const newTodoListTitle = 'NewTodolist';

    const startState: Array<TodoListType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]
    // вызов тестируемой функции:
    const endState = todolistsReducer(startState, AddTodolistAC(newTodoListTitle, v1()))
    // cверка результата c ожиданием:
    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodoListTitle);
});
//-----------------------CHANGE TITLE------------------------
test('correct todolist title should be changed', () => {
    // тестовые данные:
    let todolistId1 = v1();
    let todolistId2 = v1();

    const changedTodoListTitle = 'Changed Todolist Title';

    const startState: Array<TodoListType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]
      // вызов тестируемой функции:
    const endState = todolistsReducer(startState, ChangeTodoListTitleAC(changedTodoListTitle, todolistId2))
    // cверка результата c ожиданием:
    expect(endState.length).toBe(2);
    expect(endState[1].title).toBe(changedTodoListTitle);
    expect(endState[0].title).toBe("What to learn")
});
//----------------------CHANGE FILTER--------------------
test('correct todolist should change filter', () => {
    // тестовые данные:
    let todolistId1 = v1();
    let todolistId2 = v1();

    const newFilterValue: FilterValuesType = 'completed';

    const startState: Array<TodoListType> = [
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ]
    // вызов тестируемой функции:
    const endState = todolistsReducer(startState,ChangeTodolistFilterAC(todolistId2, newFilterValue))
    // cверка результата c ожиданием:
    expect(endState.length).toBe(2);
    expect(endState[1].filter).toBe(newFilterValue);
    expect(endState[0].filter).toBe("all")
    expect(endState[1].id).toBe(todolistId2)
});
