import React, {useState} from 'react';
import './App.css';
import TodoList, {TaskType} from './Todolist';
import {v1} from "uuid";


type TodoListType = {
    title: string
    id: string
    filter: FilterValuesType
}

type TaskStateType = {
    [todoListID: string]: Array<TaskType>
}

export type FilterValuesType = "all" | "active" | "completed"

function App() {
    //-----------BLL
    const todoListID1 = v1()
    const todoListID2 = v1()
    const [todoLists, setTodoLists] = useState<Array<TodoListType>>([
        {id: todoListID1, title: "What to learn", filter: 'all'},
        {id: todoListID2, title: "What to buy", filter: 'all'},
    ])
    const [tasks, setTasks] = useState<TaskStateType>({
        [todoListID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS/TS", isDone: true},
            {id: v1(), title: "React", isDone: false},
        ],
        [todoListID2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "Book", isDone: true},
            {id: v1(), title: "Flowers", isDone: false},
        ]
    })

    const removeTask = (taskID: string, todoListID: string) => {
        const copyTasks = {...tasks} // делаем копию стейта
        copyTasks[todoListID] = tasks[todoListID].filter(t => t.id !== taskID)
        setTasks(copyTasks)
    }
    const addTask = (title: string, todoListID: string) => {
        const newTask: TaskType = {
            id: v1(),
            title: title,
            isDone: false
        } //создали таску
        const copyTasks = {...tasks} //сделали копию стейта, новый обьект
        copyTasks[todoListID] = [newTask, ...tasks[todoListID]] //в копию полодили новый массив и новую таску вначало списка
        setTasks(copyTasks)
    }
    //еще вариант
    const changeTaskStatus = (taskID: string, isDone: boolean, todoListID: string) => {
        const updatedTask = tasks[todoListID].map(t => t.id === taskID ? {...t, isDone: isDone} : t)
        setTasks({...tasks, [todoListID]:updatedTask})         //сетаем копию обьекта и перезаписываем свойство

        //         const copyTasks = {...tasks}
        //         copyTasks[todoListID] = tasks[todoListID].map(t => t.id === taskID ? {...t, isDone: isDone} : t)
        //         setTasks(copyTasks)//сетаем копию обьекта и перезаписываем свойство
    }

    const changeTodoListFilter = (filter: FilterValuesType, todoListID: string) => {
        const filteredTodolist = todoLists.map(tl => tl.id === todoListID ? {...tl, filter: filter} : tl)
        setTodoLists(filteredTodolist)
    } //промапим массив тудулистов и найдет тот чей айди передан его фильтр поняем на занчение которок пришло, при этом крпируем весь массив и внем перезапишем измененный массив

    const removeTodolist = (todoListID: string) => {
        const removedTodolist = todoLists.filter(tl => tl.id !== todoListID) //удаляем все что пришло по айди
        setTodoLists(removedTodolist)//сетаем обновленный массив
        delete tasks[todoListID] //удаляем таски из тасков
    }

    //--------UI
    const todolistsComponents = todoLists.map(tl => {

        let tasksForRender;
        switch (tl.filter) {
            case "active":
                tasksForRender = tasks[tl.id].filter(t => !t.isDone)
                break
            case "completed":
                tasksForRender = tasks[tl.id].filter(t => t.isDone)
                break
            default:
                tasksForRender = tasks[tl.id]
        }
        return (
            <TodoList
                key={tl.id}

                id={tl.id}
                title={tl.title}
                filter={tl.filter}
                tasks={tasksForRender}

                changeTaskStatus={changeTaskStatus}
                addTask={addTask}
                removeTask={removeTask}
                changeTodoListFilter={changeTodoListFilter}
                removeTodolist={removeTodolist}
            />
        )
    })

    //UI:
    return (
        <div className="App">
            {todolistsComponents}
        </div>
    );
}

export default App;
