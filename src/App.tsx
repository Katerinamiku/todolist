import React, {useState} from 'react';
import './App.css';
import TodoList from "./Todolist";
import {v1} from "uuid";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import AddingInput from "./Components/AddingInput";
import {TasksPriorities, TaskStatuses, TaskType} from "./api/todolists-api";
import {FilterValuesType, TodolistDomainType} from "./reducers/todolist-reducer";


export type TaskStateType = {
    [todolistID: string]: Array<TaskType>
}

function App() {
    //BLL:
    const todolistID_1 = v1()
    const todolistID_2 = v1()
    const [todolists, setTodolists] = useState<Array<TodolistDomainType>>([
        {id: todolistID_1, title: "What to learn", filter: "all", addedDate: '', order: 0},
        {id: todolistID_2, title: "What to buy", filter: "all", addedDate: '', order: 1},
    ])
    const [tasks, setTasks] = useState<TaskStateType>({
        [todolistID_1]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: todolistID_1, description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle},
            {id: v1(), title: "JS", status: TaskStatuses.InProgress, todoListId: todolistID_1, description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle}
        ],
        [todolistID_2]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.InProgress, todoListId: todolistID_2, description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle},
            {id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: todolistID_2, description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle}
        ],
    })
//--------------------------------Functions------------------------
    //----------------Tasks----------------
    const removeTask = (taskID: string, todolistID: string) => {
        setTasks({...tasks, [todolistID]: tasks[todolistID].filter(t => t.id !== taskID)})
    }
    const addTask = (title: string, todolistID: string) => {
        const newTask: TaskType = {id: v1(), title: title, status: TaskStatuses.New, todoListId: todolistID, description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Low}
        setTasks({...tasks, [todolistID]: [newTask, ...tasks[todolistID]]})
    }
    const changeTaskStatus = (taskID: string, status: TaskStatuses, todolistID: string) => {
        setTasks({...tasks, [todolistID]: tasks[todolistID].map(t => t.id === taskID ? {...t, status: status} : t)
        })
    }
    const changeTaskTitle = (taskID: string, title: string, todolistID: string) => {
        setTasks({...tasks, [todolistID]: tasks[todolistID].map(t => t.id === taskID ? {...t, title: title} : t)
        })
    }
    //------------------TDLists--------------------
    const changeTodoListFilter = (todolistID: string, filter: FilterValuesType) => {
        setTodolists(todolists.map(tl => tl.id === todolistID ? {...tl, filter: filter} : tl))
    }
    const changeTodoListTitle = (title: string, todolistID: string) => {
        setTodolists(todolists.map(tl => tl.id === todolistID ? {...tl, title: title} : tl))
    }
    const removeTodolist = (todolistID: string) => {
        setTodolists(todolists.filter(tl => tl.id !== todolistID))
        delete tasks[todolistID]
    }
    const addTodoList = (title: string) => {
        const newTodoListID = v1()
        setTodolists([{id: newTodoListID, title: title, filter: "all", addedDate: '', order: 0}, ...todolists])
        setTasks({...tasks, [newTodoListID]: []})
    }
    // -----------------------UI---------------------------------
    const todolistsComponents = todolists.map(tl => {
        let tasksForRender;
        switch (tl.filter) {
            case "active":
                tasksForRender = tasks[tl.id].filter(t => t.status === TaskStatuses.New)
                break
            case "completed":
                tasksForRender = tasks[tl.id].filter(t => t.status === TaskStatuses.Completed)
                break
            default:
                tasksForRender = tasks[tl.id]
        }
        return (
            <Grid item key={tl.id}>
                <Paper elevation={6} style={{padding: "20px"}}>
                    <TodoList
                        id={tl.id}
                        title={tl.title}
                        filter={tl.filter}
                        tasks={tasksForRender}

                        addTask={addTask}
                        removeTask={removeTask}
                        changeTaskTitle={changeTaskTitle}
                        changeTaskStatus={changeTaskStatus}
                        removeTodolist={removeTodolist}
                        changeTodoListTitle={changeTodoListTitle}
                        changeTodoListFilter={changeTodoListFilter}
                    />
                </Paper>
            </Grid>
        )
    })
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <div><Button color="inherit" variant={"outlined"} style={{margin: '5px'}}>Login</Button>
                        <Button color="inherit" variant={"outlined"} style={{margin: '5px'}}>Sign in</Button>
                    </div>

                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px 0"}}> <AddingInput addItem={addTodoList}/></Grid>
                <Grid container spacing={4}>{todolistsComponents}</Grid>
            </Container>
        </div>
    );
}

export default App;
