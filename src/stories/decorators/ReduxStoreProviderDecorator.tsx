import {Provider} from "react-redux";
import {AppRootStateType} from "../../reducers/store";
import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {tasksReducer} from "../../reducers/tasks-reducer";
import {todolistsReducer} from "../../reducers/todolist-reducer";
import {v1} from "uuid";
import {TasksPriorities, TaskStatuses} from "../../api/todolists-api";
import {appReducer} from "../../App/app-reducer";
import thunkMiddleware from "redux-thunk";
import {authReducer} from "../../reducers/login-reducer";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState: AppRootStateType = {
    todolists: [
        {id: 'todolistId1', title: "What to learn", filter: "all", addedDate: '', order: 0,  entityStatus: 'idle'},
        {id: 'todolistId2', title: "What to buy", filter: "all", addedDate: '', order: 1,  entityStatus: 'idle'}
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(),
                title: "HTML&CSS",
                status: TaskStatuses.Completed,
                todoListId: 'todolistId1',
                description: '',
                completed: false,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TasksPriorities.Middle,
                entityStatus: 'idle'
            },
            {
                id: v1(),
                title: "JS",
                status: TaskStatuses.InProgress,
                todoListId: 'todolistId1',
                description: '',
                completed: false,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TasksPriorities.Middle,
                entityStatus: 'idle'
            }
        ],
        ['todolistId2']: [
            {
                id: v1(),
                title: "HTML&CSS",
                status: TaskStatuses.InProgress,
                todoListId: 'todolistId2',
                description: '',
                completed: false,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TasksPriorities.Middle,
                entityStatus: 'idle'
            },
            {
                id: v1(),
                title: "JS",
                status: TaskStatuses.Completed,
                todoListId: 'todolistId2',
                description: '',
                completed: false,
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TasksPriorities.Middle,
                entityStatus: 'idle'
            }
        ]
    },
    app: {
        status: 'idle',
        error: null,
        isInitialized: false
    },
    auth: {
        isLoggedIn: false
    }
}

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState, applyMiddleware(thunkMiddleware))

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}



