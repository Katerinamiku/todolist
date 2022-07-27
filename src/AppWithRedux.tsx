import React from 'react';
import './App.css';
import TodoList, {TaskType} from "./Todolist";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import AddingInput from "./AddingInput";
import {AddTodolistAC, ChangeTodoListTitleAC, RemoveTodolistAC} from "./reducers/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./reducers/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./reducers/store";

export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TaskStateType = {
    [todolistID: string]: Array<TaskType>
}
export type FilterValuesType = "all" | "active" | "completed"

function AppWithRedux() {

// Храним данные в redux
    const todolists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)
    const dispatch = useDispatch();
//--------------------------------Functions------------------------
    //----------------Tasks----------------
    const removeTask = (taskID: string, todolistID: string) => {
        dispatch(removeTaskAC(taskID, todolistID));
    }
    const addTask = (title: string, todolistID: string) => {
        dispatch(addTaskAC(title, todolistID));
    }
    const changeTaskStatus = (taskID: string, isDone: boolean, todolistID: string) => {
        dispatch(changeTaskStatusAC(taskID, isDone, todolistID));
    }
    const changeTaskTitle = (taskID: string, title: string, todolistID: string) => {
        dispatch(changeTaskTitleAC(taskID, title, todolistID));
    }
    //------------------TDLists--------------------
    const changeTodoListFilter = (filter: FilterValuesType) => {
        dispatch(AddTodolistAC(filter));
    }
    const changeTodoListTitle = (title: string, todolistID: string) => {
        dispatch(ChangeTodoListTitleAC(title, todolistID));
    }
    const removeTodolist = (todolistID: string) => {
        let action = RemoveTodolistAC(todolistID);
        dispatch(action);
    }
    const addTodoList = (title: string) => {
        let action = AddTodolistAC(title)
        dispatch(action);//помещаем в оба reducerа так как касается обоих
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

export default AppWithRedux;
