import React, {useCallback} from 'react';
import EditableSpan from "./Components/EditableSpan";
import {Button, IconButton, List} from "@material-ui/core";
import {DeleteForever} from "@material-ui/icons";
import AddingInput from "./Components/AddingInput";
import {Task} from "./Components/Task";
import {TaskStatuses, TaskType} from "./api/todolists-api";
import {FilterValuesType} from "./reducers/todolist-reducer";

type TodoListPropsType = {
    id: string
    title: string
    tasks: TaskType[]
    filter: FilterValuesType
    addTask: (title: string, todolistID: string) => void
    removeTask: (taskID: string, todolistID: string) => void
    changeTodoListFilter: (todolistID: string, filter: FilterValuesType) => void
    changeTaskStatus: (taskID: string, status: TaskStatuses, todolistID: string) => void
    changeTaskTitle: (taskID: string, title: string, todolistID: string) => void
    changeTodoListTitle: (title: string, todolistID: string) => void
    removeTodolist: (todolistID: string) => void
}

const TodoList = React.memo(function (props: TodoListPropsType) {
    //сделаем фльтотрыуию внутри тудулиста.
    let tasksForTodolist = props.tasks;
    if (props.filter === "active") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    const tasksJSX = tasksForTodolist.length
        ? tasksForTodolist.map(t => <Task key={t.id}
                                     task={t}
                                     changeTaskStatus={props.changeTaskStatus}
                                     changeTaskTitle={props.changeTaskTitle}
                                     removeTask={props.removeTask}
                                     todolistId={props.id}/>)
        : <span>Your taskslist is empty</span>

    const createOnClickHandler = (filter: FilterValuesType): () => void => {
        const onClickHandler = () => props.changeTodoListFilter(props.id, filter)
        return onClickHandler
    }
    const removeTodolist = useCallback(() => {
        props.removeTodolist(props.id)}, [props.removeTodolist, props.id]);
    const changeTodoListTitle = useCallback((todoListTitle: string) => props.changeTodoListTitle(todoListTitle, props.id), [props.changeTodoListTitle, props.id]);
    //оборачиваем в usecallback, чтобы не переисовался Input при каких то жкйствиях внутри тудулиста, если дело
    // касается не самого Inputa
    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.addTask, props.id]);


    return (
        <div>
            <h3>
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                <IconButton onClick={removeTodolist}><DeleteForever/></IconButton>
            </h3>
            <AddingInput addItem={addTask}/>
            <List>
                {tasksJSX}
            </List>
            <div>
                <Button size={'small'}
                        variant={'contained'}
                        color={props.filter === 'all' ? 'secondary' : 'primary'}
                        disableElevation
                        className={props.filter === "all" ? "active" : ""}
                        onClick={createOnClickHandler("all")}
                        style={{margin: '10px'}}
                >All
                </Button>
                <Button size={'small'}
                        variant={'contained'}
                        color={props.filter === 'active' ? 'secondary' : 'primary'}
                        disableElevation
                        className={props.filter === "active" ? "active" : ""}
                        onClick={createOnClickHandler("active")}
                        style={{margin: '10px'}}
                >Active
                </Button>
                <Button size={'small'}
                        variant={'contained'}
                        color={props.filter === 'completed' ? 'secondary' : 'primary'}
                        disableElevation
                        className={props.filter === "completed" ? "active" : ""}
                        onClick={createOnClickHandler("completed")}
                        style={{margin: '10px'}}
                >Completed
                </Button>
            </div>
        </div>
    );
})
export default TodoList;


