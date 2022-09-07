import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton, ListItem} from "@material-ui/core";
import {Close, Favorite, FavoriteBorder} from "@material-ui/icons";
import EditableSpan from "../../../../Components/EditableSpan/EditableSpan";
import {TaskStatuses} from "../../../../api/todolists-api";
import {TaskDomainType} from "../../../../reducers/tasks-reducer";


export type TaskPropsType = {
    task: TaskDomainType
    todolistId: string
    changeTaskStatus: (taskID: string, status: TaskStatuses, todolistID: string) => void
    changeTaskTitle: (taskID: string, title: string, todolistID: string) => void
    removeTask: (taskID: string, todolistID: string) => void
}

export const Task = React.memo((props: TaskPropsType) => {

    const removeTask = useCallback(() => props.removeTask(props.task.id, props.todolistId), [props.todolistId, props.task.id]);

    const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newStatusValue = e.currentTarget.checked;
        props.changeTaskStatus(props.task.id, newStatusValue ? TaskStatuses.Completed : TaskStatuses.New, props.todolistId)
    }, [props.task.id, props.todolistId]);

    const changeTaskTitle = useCallback((taskTitle: string) => {
        props.changeTaskTitle(props.task.id, taskTitle, props.todolistId)
    }, [props.changeTaskTitle, props.task.id, props.todolistId]);

    return (
        <ListItem key={props.task.id}
                  className={props.task.status === TaskStatuses.Completed ? "task isDone" : "task"}
                  divider
        >
            <Checkbox icon={<FavoriteBorder/>} checkedIcon={<Favorite/>} color={'primary'}/>
            <Checkbox size={'small'} onChange={changeTaskStatus}
                      checked={props.task.status === TaskStatuses.Completed}/>

            <EditableSpan title={props.task.title}
                          changeTitle={changeTaskTitle}
                          disabled={props.task.entityStatus === 'loading'}/>
            <IconButton size={'small'}
                        onClick={removeTask}
                        disabled={props.task.entityStatus === 'loading'}>
                <Close/></IconButton>
        </ListItem>
    )
});
