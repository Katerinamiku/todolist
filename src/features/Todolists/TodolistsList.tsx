import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../reducers/store";
import {
    addTodolistTC,
    ChangeTodolistFilterAC, changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType, removeTodolistTC,
    TodolistDomainType
} from "../../reducers/todolist-reducer";
import {addTaskTC, removeTaskTC, TaskStateType, updateTaskModelTC} from "../../reducers/tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import {Grid, Paper} from "@material-ui/core";
import AddingInput from "../../Components/AddingInput/AddingInput";
import TodoList from "./Todolist/Todolist";

export const TodolistsList: React.FC = (props) => {
// Храним данные в redux
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)
    const dispatch = useDispatch();
//----------------Tasks----------------
    //обернем в use Callback, чтобы резт запомниосяи не передавался новый  каждый раз
    const removeTask = useCallback(function (taskID: string, todolistID: string) {
        dispatch(removeTaskTC(taskID, todolistID) as any)
    }, []);
    const addTask = useCallback((title: string, todolistID: string) => {
        dispatch(addTaskTC(title, todolistID) as any);
    }, []);
    const changeTaskStatus = useCallback((taskID: string, status: TaskStatuses, todolistID: string) => {
        dispatch(updateTaskModelTC(taskID, {status}, todolistID) as any);
    }, []);
    const changeTaskTitle = useCallback((taskID: string, title: string, todolistID: string) => {
        dispatch(updateTaskModelTC(taskID, {title}, todolistID) as any);
    }, []);
//------------TDLists--------------------
    useEffect(() => {
        dispatch(fetchTodolistsTC() as any)
    }, [])
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

    return (
        <> <Grid container style={{padding: "20px 0"}}> <AddingInput addItem={addTodoList}/></Grid>
            <Grid container spacing={4}>
                {
                    todolists.map(tl => {
                        return (
                            <Grid item key={tl.id}>
                                <Paper elevation={6} style={{padding: "20px"}}>
                                    <TodoList
                                        id={tl.id}
                                        title={tl.title}
                                        filter={tl.filter}
                                        tasks={tasks[tl.id]}

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
        </>
    )
}
