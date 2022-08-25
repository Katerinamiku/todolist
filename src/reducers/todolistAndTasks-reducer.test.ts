import {TaskStateType} from "../App";
import {AddTodolistAC, RemoveTodolistAC, TodolistDomainType, todolistsReducer} from "./todolist-reducer";
import {tasksReducer} from "./tasks-reducer";
import {TasksPriorities, TaskStatuses} from "../api/todolists-api";

//----------------adding todolist and task for it-----------
test('ids should be equals', () => {
    const startTasksState: TaskStateType = {}; //стартовый сткйт для тасок
    const startTodolistsState: Array<TodolistDomainType> = []; //масиив тудулистов

    const action = AddTodolistAC("new todolist");
//отправляем экшмн в два редьюсера
    const endTasksState = tasksReducer(startTasksState, action) //фин состояние тасок
    const endTodolistsState = todolistsReducer(startTodolistsState, action) //фин состо тудулистов

    const keys = Object.keys(endTasksState); //метод обьекта: врзвр массив виде строк всех ключей
    const idFromTasks = keys[0]; //должен быть 1 ключ и это ID которая в экшене
    const idFromTodolists = endTodolistsState[0].id; //айдишки долджны быть равны

    expect(idFromTasks).toBe(action.todolistId);
    expect(idFromTodolists).toBe(action.todolistId);
});
//--------------removing todolist and his tasks-----------
test('property with todolistId should be deleted', () => {
    const startState: TaskStateType = {
        "todolistId1": [
            {id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle},
            {id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle},
            {id: "3", title: "JS", status: TaskStatuses.New, todoListId: "todolistId1", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle}
        ],
        "todolistId2": [
            {id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle},
            {id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle},
            {id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle}
        ]
    };

    const action = RemoveTodolistAC("todolistId2");

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});
