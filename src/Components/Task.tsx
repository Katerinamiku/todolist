import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton, ListItem} from "@material-ui/core";
import {Close, Favorite, FavoriteBorder} from "@material-ui/icons";
import EditableSpan from "./EditableSpan";
import {TaskType} from "../Todolist";

export type TaskPropsType = {
    task: TaskType
    todolistId: string
    changeTaskStatus: (taskID: string, isDone: boolean, todolistID: string) => void
    changeTaskTitle: (taskID: string, title: string, todolistID: string) => void
    removeTask: (taskID: string, todolistID: string) => void
}

export const Task = React.memo((props: TaskPropsType) => {
    const removeTask = () => props.removeTask(props.task.id, props.todolistId)
    const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) =>
        props.changeTaskStatus(props.task.id, e.currentTarget.checked, props.todolistId)
    const changeTaskTitle = useCallback((taskTitle: string) => {
        props.changeTaskTitle(props.task.id, taskTitle, props.todolistId)
    }, [props.changeTaskTitle, props.task.id, props.todolistId]);
    return (
        <ListItem key={props.task.id}
                  className={props.task.isDone ? "task isDone" : "task"}
                  divider
        >
            <Checkbox icon={<FavoriteBorder/>} checkedIcon={<Favorite/>} color={'primary'}/>
            <Checkbox size={'small'} onChange={changeTaskStatus} checked={props.task.isDone}/>

            <EditableSpan title={props.task.title} changeTitle={changeTaskTitle}/>
            <IconButton size={'small'} onClick={removeTask}><Close/></IconButton>
        </ListItem>
    )
});
