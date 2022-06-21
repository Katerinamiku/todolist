import React, {useState, KeyboardEvent, ChangeEvent} from 'react';
import {FilterValuesType} from "./App";
import {Checkbox} from "./Components/Checkbox";
import {Button} from "./Components/Button";

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
    addTask: (title: string, todoListID: string) => void
    removeTask: (taskID: string, todoListID: string) => void
    changeTodoListFilter: (filter: FilterValuesType, todoListID: string) => void
    changeTaskStatus: (taskID: string, isDone: boolean, todoListID: string) => void
    removeTodolist: (todoListID: string) => void
}

const TodoList = (props: TodoListPropsType) => {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<boolean>(false)
    const tasksJSX = props.tasks.length
        ? props.tasks.map(t => {
            const removeTask = () => props.removeTask(t.id, props.id)

            const changeTaskStatus = (tId: string, eventValue: boolean) =>
            props.changeTaskStatus(t.id, eventValue, props.id)
            return (
                <li key={t.id}>
                    <Checkbox isDone={t.isDone}
                              callBack={(eventValue) => changeTaskStatus(t.id, eventValue)}
                    />

                    <span className={t.isDone ? "task isDone" : "task"}>{t.title}</span>
                    <Button name={'X'}
                            callBack={removeTask}/>

                </li>
            )
        })
        : <span>Your taskslist is empty</span>

    const getOnClickHandler = (filter: FilterValuesType) => {
        return () => props.changeTodoListFilter(filter, props.id)
    }
    const onClickHandler = () => props.changeTodoListFilter("all", props.id)

    const addTask = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.addTask(trimmedTitle, props.id)
        } else {
            setError(true)
        }
        setTitle("")
    }
    const onKeyDownAddTask = (e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && addTask()
    const onChangeSetTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        error && setError(false)
    }
    const removeTodolist = () => {
        props.removeTodolist(props.id)
    };
    return (
        <div>
            <h3>
                {props.title}
                <Button name={'Remove'}
                        callBack={removeTodolist}/>
            </h3>
            <div>
                <input
                    value={title}
                    onChange={onChangeSetTitle}
                    onKeyDown={onKeyDownAddTask}
                    className={error ? "error" : ""}
                />
                <Button name={'+'}
                        callBack={addTask}/>
                {error && <div style={{color: "red"}}>Title is required!</div>}
            </div>
            <ul>
                {tasksJSX}
            </ul>
            <div>
                <button
                    className={props.filter === "all" ? "active" : ""}
                    onClick={onClickHandler}
                >All
                </button>
                <button
                    className={props.filter === "active" ? "active" : ""}
                    onClick={getOnClickHandler("active")}
                >Active
                </button>
                <button
                    className={props.filter === "completed" ? "active" : ""}
                    onClick={getOnClickHandler("completed")}
                >Completed
                </button>
            </div>
        </div>
    );
};

export default TodoList;
