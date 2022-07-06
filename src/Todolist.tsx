import React, {ChangeEvent} from 'react';
import {FilterValuesType} from "./App";

import EditableSpan from "./EditableSpan";
import {Button, Checkbox, IconButton, List, ListItem} from "@material-ui/core";
import {Close, DeleteForever, Favorite, FavoriteBorder} from "@material-ui/icons";
import AddingInput from "./AddingInput";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}


type TodoListPropsType = {
    id: string
    title: string
    tasks: TaskType[]
    filter: FilterValuesType
    addTask: (title: string, todolistID: string) => void
    removeTask: (taskID: string, todolistID: string) => void
    changeTodoListFilter: (filter: FilterValuesType, todolistID: string) => void
    changeTaskStatus: (taskID: string, isDone: boolean, todolistID: string) => void
    changeTaskTitle: (taskID: string, title: string, todolistID: string) => void
    changeTodoListTitle: (title: string, todolistID: string) => void
    removeTodolist: (todolistID: string) => void
}

const TodoList = (props: TodoListPropsType) => {
    const tasksJSX = props.tasks.length
        ? props.tasks.map(t => {
            const removeTask = () => props.removeTask(t.id, props.id)
            const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) =>
                props.changeTaskStatus(t.id, e.currentTarget.checked, props.id)
            const changeTaskTitle = (taskTitle: string) => {
                props.changeTaskTitle(t.id, taskTitle, props.id)
            }
            return (
                <ListItem key={t.id}
                          className={t.isDone ? "task isDone" : "task"}
                          divider
                >
                    <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} color={'primary'}/>
                    <Checkbox size={'small'} onChange={changeTaskStatus} checked={t.isDone} />

                    <EditableSpan title={t.title} changeTitle={changeTaskTitle}/>
                    <IconButton size={'small'} onClick={removeTask}><Close/></IconButton>
                </ListItem>
            )
        })
        : <span>Your taskslist is empty</span>

    const createOnClickHandler = (filter: FilterValuesType): () => void => {
        const onClickHandler = () => props.changeTodoListFilter(filter, props.id)
        return onClickHandler
    }
    const addTask = (title: string) => props.addTask(title, props.id)
    const removeTodolist = () => props.removeTodolist(props.id)
    const changeTodoListTitle = (todoListTitle: string) => props.changeTodoListTitle(todoListTitle, props.id)

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
};

export default TodoList;
