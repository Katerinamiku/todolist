import {Provider} from "react-redux";
import {AppRootStateType} from "../../reducers/store";
import {combineReducers, legacy_createStore} from "redux";
import {tasksReducer} from "../../reducers/tasks-reducer";
import {todolistsReducer} from "../../reducers/todolist-reducer";
import {v1} from "uuid";
import {TasksPriorities, TaskStatuses} from "../../api/todolists-api";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {
    todolists: [
        {id: 'todolistId1', title: "What to learn", filter: "all", addedDate: '', order: 0},
        {id: 'todolistId2', title: "What to buy", filter: "all", addedDate: '', order: 1}
    ],
    tasks: {
        ['todolistId1']: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle},
            {id: v1(), title: "JS", status: TaskStatuses.InProgress, todoListId: 'todolistId1', description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle}
        ],
        ['todolistId2']: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.InProgress, todoListId: 'todolistId2', description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle},
            {id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: 'todolistId2', description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle}
        ]
    }
}

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType)

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}



