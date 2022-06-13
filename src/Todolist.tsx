import React, {ChangeEvent, KeyboardEvent, FocusEvent, useState} from 'react';
import {FilterValuesType} from './App';
import s from './Todolist.module.css'
import {Checkbox} from "./Components/Checkbox";

type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string) => void
    changeFilter: (value: FilterValuesType) => void
    addTask: (title: string) => void
    changeCheckbox: (id: string, value: boolean) => void
    filter: string
}

export function Todolist(props: PropsType) {

    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const addTask = () => {
        if (title.trim() !== '') {
            props.addTask(title);
            setTitle("");
        } else {
            setError('Text is required!')
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null)
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            addTask();
        }
    }
    const onAllClickHandler = () => props.changeFilter("all");
    const onActiveClickHandler = () => props.changeFilter("active");
    const onCompletedClickHandler = () => props.changeFilter("completed");

    const changeCheckboxHandler = (tId: string, eventValue: boolean) => props.changeCheckbox(tId, eventValue)


    const onClickHandler = (tId: string) => props.removeTask(tId)
    const onFocusHandler = (event: FocusEvent<HTMLInputElement>) => {
        setError('')
    }


    return <div>
        <h3>{props.title}</h3>
        <div>

            <input value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   onFocus={onFocusHandler}
                   className={error ? s.error : ''}
            />
            <button onClick={addTask}>+</button>
            {error && <div className={s.errorMessage}>{error}</div>}
        </div>
        <ul>
            {
                props.tasks.map(t => {

                    return <li className={t.isDone ? s.isDone : ''} key={t.id}>
                        <Checkbox checked={t.isDone}
                                  callBack={(eventValue) => changeCheckboxHandler(t.id, eventValue)}/>
                        <span>{t.title}</span>
                        <button onClick={() => onClickHandler(t.id)}>x</button>
                    </li>
                })
            }
        </ul>
        <div>
            <button className={props.filter === 'all' ? s.activeFilter : ''} onClick={onAllClickHandler}>All</button>
            <button className={props.filter === 'active' ? s.activeFilter : ''} onClick={onActiveClickHandler}>Active
            </button>
            <button className={props.filter === 'completed' ? s.activeFilter : ''}
                    onClick={onCompletedClickHandler}>Completed
            </button>
        </div>
    </div>
}
