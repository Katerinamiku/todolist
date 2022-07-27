import {TaskStateType, TodoListType} from "../App";
import {AddTodolistAC, RemoveTodolistAC, todolistsReducer} from "./todolist-reducer";
import {tasksReducer} from "./tasks-reducer";

//----------------adding todolist and task for it-----------
test('ids should be equals', () => {
    const startTasksState: TaskStateType = {}; //стартовый сткйт для тасок
    const startTodolistsState: Array<TodoListType> = []; //масиив тудулистов

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
            { id: "1", title: "CSS", isDone: false },
            { id: "2", title: "JS", isDone: true },
            { id: "3", title: "React", isDone: false }
        ],
        "todolistId2": [
            { id: "1", title: "bread", isDone: false },
            { id: "2", title: "milk", isDone: true },
            { id: "3", title: "tea", isDone: false }
        ]
    };

    const action = RemoveTodolistAC("todolistId2");

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});
