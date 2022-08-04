import React, {useCallback} from 'react';
import './App.css';
import TodoList, {TaskType} from "./Todolist";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import AddingInput from "./Components/AddingInput";
import {
    AddTodolistAC,
    ChangeTodolistFilterAC,
    ChangeTodoListTitleAC,
    RemoveTodolistAC
} from "./reducers/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./reducers/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./reducers/store";


export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TaskStateType = {
    [key: string]: Array<TaskType>
}
export type FilterValuesType = "all" | "active" | "completed"

function AppWithRedux() {
    console.log('app is called')
// Храним данные в redux
    const todolists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)
    const dispatch = useDispatch();
//--------------------------------Functions------------------------
    //----------------Tasks----------------
    const removeTask = useCallback((taskID: string, todolistID: string) => {
        dispatch(removeTaskAC(taskID, todolistID));
    }, [dispatch]);
    const addTask = useCallback((title: string, todolistID: string) => {
        dispatch(addTaskAC(title, todolistID));
    }, [dispatch]);
    const changeTaskStatus = useCallback((taskID: string, isDone: boolean, todolistID: string) => {
        dispatch(changeTaskStatusAC(taskID, isDone, todolistID));
    }, [dispatch]);
    const changeTaskTitle = useCallback((taskID: string, title: string, todolistID: string) => {
        dispatch(changeTaskTitleAC(taskID, title, todolistID));
    }, [dispatch]);
    //------------TDLists--------------------
    const changeTodoListFilter = useCallback((id: string, filter: FilterValuesType) => {
        dispatch(ChangeTodolistFilterAC(id, filter));
    }, [dispatch]);
    const changeTodoListTitle = useCallback((title: string, todolistID: string) => {
        dispatch(ChangeTodoListTitleAC(title, todolistID));
    }, [dispatch]);
    const removeTodolist = useCallback((todolistID: string) => {
        let action = RemoveTodolistAC(todolistID);
        dispatch(action);
    }, [dispatch]);
    //обернем в use Callback, чтобы резт запомниосяи не передавался новый  каждый раз
    const addTodoList = useCallback((title: string) => {
        let action = AddTodolistAC(title);
        dispatch(action);//помещаем в оба reducerа так как касается обоих
    }, [dispatch]);
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
                        )})
                }
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
