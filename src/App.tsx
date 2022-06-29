import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';
import AddItemForm from "./AddingInput";
import AddingInput from "./AddingInput";

export type FilterValuesType = "all" | "active" | "completed";
type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let [todolists, setTodolists] = useState<Array<TodolistType>>([
        {id: todolistId1, title: "What to learn", filter: "all"},
        {id: todolistId2, title: "What to buy", filter: "all"}
    ])

    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true}
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "React Book", isDone: true}
        ]
    });


    function removeTask(id: string, todolistId: string) {
        tasks[todolistId] = tasks[todolistId].filter(t => t.id != id);
        setTasks({...tasks});
    }

    function addTask(title: string, todolistId: string) {
        let newTask: TaskType = {id: v1(), title: title, isDone: false};
        tasks[todolistId] = [newTask, ...tasks[todolistId]];
        setTasks({...tasks});
    }

    function changeStatus(id: string, isDone: boolean, todolistId: string) {
        const updatedTask = tasks[todolistId].map(t => t.id === id ? {...t, isDone: isDone} : t)
        setTasks({...tasks, [todolistId]: updatedTask})
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        const filteredTodolist = todolists.map(tl => tl.id === todolistId ? {...tl, filter: value} : tl)
        setTodolists(filteredTodolist)
    }

    function removeTodolist(id: string) {
        setTodolists(todolists.filter(tl => tl.id != id));
        delete tasks[id];
        setTasks({...tasks});
    }

    function addTodoList(title: string) {
        let Newtodolist: TodolistType = {
            id: v1(),
            filter: 'all',
            title: title
        }
        setTodolists([Newtodolist, ...todolists]);
        setTasks({...tasks, [Newtodolist.id]: []})
    }

    function changeTaskTitle(id: string, title: string, todolistId: string) {
        const updatedTaskTitle = tasks[todolistId].map(t => t.id === id ? {...t, title: title} : t)
        setTasks({...tasks, [todolistId]: updatedTaskTitle})
    }

    function changeTodolistTitle(id: string, newTitle: string) {
        const todolistNewTitle = todolists.map(tl => tl.id === id ?
            {...tl, title: newTitle} : tl)
        setTodolists(todolistNewTitle)
    }

    return (
        <div className="App">
            <AddingInput addItem={addTodoList}/>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id];
                    let tasksForTodolist = allTodolistTasks;

                    if (tl.filter === "active") {
                        tasksForTodolist = allTodolistTasks.filter(t => t.isDone === false);
                    }
                    if (tl.filter === "completed") {
                        tasksForTodolist = allTodolistTasks.filter(t => t.isDone === true);
                    }

                    return <Todolist
                        key={tl.id}
                        id={tl.id}
                        title={tl.title}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeStatus}
                        filter={tl.filter}
                        removeTodolist={removeTodolist}
                        changeTaskTitle={changeTaskTitle}
                        changeTodolistTitle={changeTodolistTitle}
                    />
                })
            }

        </div>
    );
}

export default App;
