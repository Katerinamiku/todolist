import React, {useCallback, useEffect} from 'react';
import EditableSpan from "../../../Components/EditableSpan/EditableSpan";
import {Button, IconButton, List} from "@material-ui/core";
import {DeleteForever} from "@material-ui/icons";
import AddingInput from "../../../Components/AddingInput/AddingInput";
import {Task} from "./Task/Task";
import {TaskStatuses} from "../../../api/todolists-api";
import {FilterValuesType, TodolistDomainType} from "../../../reducers/todolist-reducer";
import {fetchTasksTC, TaskDomainType} from "../../../reducers/tasks-reducer";
import {useAppDispatch} from "../../../reducers/store";

type TodoListPropsType = {
    todolist: TodolistDomainType
    tasks: TaskDomainType[]
    addTask: (title: string, todolistID: string) => void
    removeTask: (taskID: string, todolistID: string) => void
    changeTodoListFilter: (todolistID: string, filter: FilterValuesType) => void
    changeTaskStatus: (taskID: string, status: TaskStatuses, todolistID: string) => void
    changeTaskTitle: (taskID: string, title: string, todolistID: string) => void
    changeTodoListTitle: (title: string, todolistID: string) => void
    removeTodolist: (todolistID: string) => void
    demo?: boolean
}

const TodoList = React.memo(function ({demo = false, ...props}: TodoListPropsType) {
       const dispatch = useAppDispatch();

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(fetchTasksTC(props.todolist.id))
    }, [])
    //сделаем фльтотрыуию внутри тудулиста.
    let tasksForTodolist = props.tasks;
    if (props.todolist.filter === "active") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (props.todolist.filter === "completed") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    const tasksJSX = tasksForTodolist.length
        ? tasksForTodolist.map(t => <Task key={t.id}
                                          task={t}
                                          changeTaskStatus={props.changeTaskStatus}
                                          changeTaskTitle={props.changeTaskTitle}
                                          removeTask={props.removeTask}
                                          todolistId={props.todolist.id}
                                          />)
        : <span>Your task list is empty</span>

    const createOnClickHandler = (filter: FilterValuesType): () => void => {
        const onClickHandler = () => props.changeTodoListFilter(props.todolist.id, filter)
        return onClickHandler
    }
    const removeTodolist = useCallback(() => {
        props.removeTodolist(props.todolist.id)
    }, [props.removeTodolist, props.todolist.id]);
    const changeTodoListTitle = useCallback((todoListTitle: string) => props.changeTodoListTitle(todoListTitle, props.todolist.id), [props.changeTodoListTitle, props.todolist.id]);
    //оборачиваем в usecallback, чтобы не переисовался Input при каких то жкйствиях внутри тудулиста, если дело
    // касается не самого Inputa
    const addTask = useCallback((title: string) => {
        props.addTask(title, props.todolist.id)
    }, [props.addTask, props.todolist.id]);

    return (
        <div>
            <h3>
                <EditableSpan title={props.todolist.title} changeTitle={changeTodoListTitle}
                              disabled={props.todolist.entityStatus === 'loading'}/>
                <IconButton onClick={removeTodolist}
                            disabled={props.todolist.entityStatus === 'loading'}><DeleteForever/></IconButton>
            </h3>
            <AddingInput addItem={addTask}
                         disabled={props.todolist.entityStatus === 'loading'}/>
            <List>
                {tasksJSX}
            </List>
            <div>
                <Button size={'small'}
                        variant={'contained'}
                        color={props.todolist.filter === 'all' ? 'secondary' : 'primary'}
                        disableElevation
                        className={props.todolist.filter === "all" ? "active" : ""}
                        onClick={createOnClickHandler("all")}
                        style={{margin: '10px'}}
                >All
                </Button>
                <Button size={'small'}
                        variant={'contained'}
                        color={props.todolist.filter === 'active' ? 'secondary' : 'primary'}
                        disableElevation
                        className={props.todolist.filter === "active" ? "active" : ""}
                        onClick={createOnClickHandler("active")}
                        style={{margin: '10px'}}
                >Active
                </Button>
                <Button size={'small'}
                        variant={'contained'}
                        color={props.todolist.filter === 'completed' ? 'secondary' : 'primary'}
                        disableElevation
                        className={props.todolist.filter === "completed" ? "active" : ""}
                        onClick={createOnClickHandler("completed")}
                        style={{margin: '10px'}}
                >Completed
                </Button>
            </div>
        </div>
    );
})
export default TodoList;


