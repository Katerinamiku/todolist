import React, {useReducer, useState} from 'react';
import './App.css';
import TodoList, {TaskType} from "./Todolist";
import {v1} from "uuid";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import AddingInput from "./Components/AddingInput";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodoListTitleAC,
    RemoveTodolistAC,
    todolistsReducer
} from "./reducers/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./reducers/tasks-reducer";


export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TaskStateType = {
    [todolistID: string]: Array<TaskType>
}
export type FilterValuesType = "all" | "active" | "completed"

function AppWithReducer() {
    //BLL:
    const todolistID_1 = v1()
    const todolistID_2 = v1()

    let [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todolistID_1, title: "What to learn", filter: "all"},
        {id: todolistID_2, title: "What to buy", filter: "all"},
    ])
    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistID_1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS/TS", isDone: true},
            {id: v1(), title: "React", isDone: false},
        ],
        [todolistID_2]: [
            {id: v1(), title: "Milk", isDone: false},
            {id: v1(), title: "Bread", isDone: false},
            {id: v1(), title: "Meat", isDone: true},
        ],
    })
//--------------------------------Functions------------------------
    //----------------Tasks----------------
    const removeTask = (taskID: string, todolistID: string) => {
        dispatchToTasks(removeTaskAC(taskID, todolistID));
    }
    const addTask = (title: string, todolistID: string) => {
        dispatchToTasks(addTaskAC(title, todolistID));
    }
    const changeTaskStatus = (taskID: string, isDone: boolean, todolistID: string) => {
        dispatchToTasks(changeTaskStatusAC(taskID, isDone, todolistID));
    }
    const changeTaskTitle = (taskID: string, title: string, todolistID: string) => {
        dispatchToTasks(changeTaskTitleAC(taskID, title, todolistID));
    }
    //------------------TDLists--------------------
    const changeTodoListFilter = (id: string, filter: FilterValuesType) => {
        dispatchToTodolists(ChangeTodolistFilterAC(id, filter));
    }
    const changeTodoListTitle = (title: string, todolistID: string) => {
        dispatchToTodolists(ChangeTodoListTitleAC(title, todolistID));
    }
    const removeTodolist = (todolistID: string) => {
        let action = RemoveTodolistAC(todolistID);
        dispatchToTodolists(action);
        dispatchToTasks(action);
    }
    const addTodoList = (title: string) => {
        let action = AddTodolistAC(title)
        dispatchToTodolists(action);
        dispatchToTasks(action);//помещаем в оба reducerа так как касается обоих
    }
    // -----------------------UI---------------------------------
    const todolistsComponents = todolists.map(tl => {
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

export default AppWithReducer;
