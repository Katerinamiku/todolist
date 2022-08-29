import React, {useCallback, useEffect} from 'react';
import './App.css';
import TodoList from "./Todolist";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import AddingInput from "./Components/AddingInput";
import {
    addTodolistTC,
    ChangeTodolistFilterAC,
    ChangeTodoListTitleAC, changeTodolistTitleTC, fetchTodolistsTC, FilterValuesType,
    removeTodolistTC, TodolistDomainType
} from "./reducers/todolist-reducer";
import {
    addTaskTC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskTC
} from "./reducers/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./reducers/store";
import {TaskStatuses, TaskType} from "./api/todolists-api";

export type TaskStateType = {
    [key: string]: Array<TaskType>
}


function AppWithRedux() {

// Храним данные в redux
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTodolistsTC() as any)
    }, [])

//--------------------------------Functions------------------------
    //----------------Tasks----------------
    //обернем в use Callback, чтобы резт запомниосяи не передавался новый  каждый раз
    const removeTask = useCallback(function(taskID: string, todolistID: string) {
            dispatch(removeTaskTC(taskID, todolistID) as any)
    }, []);

    const addTask = useCallback((title: string, todolistID: string) => {
        dispatch(addTaskTC(title, todolistID) as any);
    }, []);

    const changeTaskStatus = useCallback((taskID: string, status: TaskStatuses, todolistID: string) => {
        dispatch(changeTaskStatusAC(taskID, status, todolistID));
    }, []);
    const changeTaskTitle = useCallback((taskID: string, title: string, todolistID: string) => {
        dispatch(changeTaskTitleAC(taskID, title, todolistID));
    }, []);
    //------------TDLists--------------------
    const changeTodoListFilter = useCallback((id: string, filter: FilterValuesType) => {
        dispatch(ChangeTodolistFilterAC(id, filter));
    }, []);
    const changeTodoListTitle = useCallback((title: string, todolistID: string) => {
        dispatch(changeTodolistTitleTC(title, todolistID) as any);
    }, []);

    const removeTodolist = useCallback((todolistID: string) => {
        dispatch(removeTodolistTC(todolistID) as any);
    }, []);

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title) as any);
        //помещаем в оба reducerа так как касается обоих
    }, []);
// -----------------------UI---------------------
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
                <Grid container spacing={4}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];
                            let tasksForTodolist = allTodolistTasks;


                            return (
                                <Grid item key={tl.id}>
                                    <Paper elevation={6} style={{padding: "20px"}}>
                                        <TodoList
                                            id={tl.id}
                                            title={tl.title}
                                            filter={tl.filter}
                                            tasks={tasksForTodolist}

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
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
