
import {
    AddTodolistAC,
    RemoveTodolistAC,
    setTodolistsAC,
    TodolistDomainType,
    todolistsReducer
} from "../todolist-reducer";
import {tasksReducer, TaskStateType} from "../tasks-reducer";
import {TasksPriorities, TaskStatuses} from "../../api/todolists-api";


//----------------setting todolists and tasks for it---------
// test('todolists and empty tasks should be set to the state ', () => {
//     const startTasksState: TaskStateType = {}; //стартовый сткйт для тасок
//     const startTodolistsState: Array<TodolistDomainType> = []; //масиив тудулистов
//
//     const action = setTodolistsAC(startTodolistsState)
//     const endState = todolistsReducer([], action)
//
//     expect(endState.length).toBe(2);
//
// });

//----------------adding todolist and task for it-----------
test('ids should be equals', () => {
    const startTasksState: TaskStateType = {}; //стартовый сткйт для тасок
    const startTodolistsState: Array<TodolistDomainType> = []; //масиив тудулистов

    const action = AddTodolistAC({id: 'todolistId1', title: 'newTodoListTitle', addedDate: '', order: 0});
//отправляем экшмн в два редьюсера
    const endTasksState = tasksReducer(startTasksState, action) //фин состояние тасок
    const endTodolistsState = todolistsReducer(startTodolistsState, action) //фин состо тудулистов

    const keys = Object.keys(endTasksState); //метод обьекта: врзвр массив виде строк всех ключей
    const idFromTasks = keys[0]; //должен быть 1 ключ и это ID которая в экшене
    const idFromTodolists = endTodolistsState[0].id; //айдишки долджны быть равны

    expect(idFromTasks).toBe(action.todolist.id);
    expect(idFromTodolists).toBe(action.todolist.id);
});
//--------------removing todolist and his tasks-----------
test('property with todolistId should be deleted', () => {
    const startState: TaskStateType = {
        "todolistId1": [
            {id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle, entityStatus: 'idle'},
            {id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle, entityStatus: 'idle'},
            {id: "3", title: "JS", status: TaskStatuses.New, todoListId: "todolistId1", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle, entityStatus: 'idle'}
        ],
        "todolistId2": [
            {id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle, entityStatus: 'idle'},
            {id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle, entityStatus: 'idle'},
            {id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle, entityStatus: 'idle'}
        ]
    };

    const action = RemoveTodolistAC("todolistId2");

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});
