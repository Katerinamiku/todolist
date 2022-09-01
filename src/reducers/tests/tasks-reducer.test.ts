import {addTaskAC, updateTaskAC, removeTaskAC, tasksReducer, TaskStateType} from "../tasks-reducer";
import {AddTodolistAC} from "../todolist-reducer";
import {TasksPriorities, TaskStatuses} from "../../api/todolists-api";


let startState: TaskStateType;

beforeEach(()=>{
     startState = {
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
})

//-----------------------REMOVE---------------------------
test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC("2", "todolistId2");
    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            {id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle},
            {id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle},
            {id: "3", title: "JS", status: TaskStatuses.New, todoListId: "todolistId1", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle}
        ],
        "todolistId2": [
            {id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle},
            {id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle}
        ]
    });
});

//-------------------------ADD-----------------------------
test('correct task should be added to correct array', () => {

    const action = addTaskAC({
        id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle
    });

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe('juce');
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})

//--------------------Change task Title----------------
test('title of specified task should be changed', () => {

    const action = updateTaskAC("2", {id: "2", title: "cookies", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle}, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe('cookies');
    expect(endState["todolistId1"][1].title).toBe("JS");
});
//-------------Add new tasks property for new Todolist-------------
test('new array should be added when new todolist is added', () => {

    const action = AddTodolistAC( {id: 'lnln', title: "new todo", addedDate: '', order: 0}
    );

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);//метод обьекта: врзвр массив виде строк всех ключей
    const newKey = keys.find(k => k !== "todolistId1" && k !== "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    } // ищем в массиве ключей НЕ старый ключ,а  новый

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]); //не toBe аотому что два массива не могуьбыть равные друг другу
});

