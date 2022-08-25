import React, {ChangeEvent} from 'react';
import {TaskStatuses} from "../api/todolists-api";

type CheckboxType = {
    status: TaskStatuses
    callBack: (eventValue: boolean) => void
} //тип чекбокса

export const Checkbox = (props: CheckboxType) => {
    const changeCheckboxHandler = (event: ChangeEvent<HTMLInputElement>) => {
        props.callBack(event.currentTarget.checked)
    } //функция по клику на чекбокс передает ткущее состояние checked в callback
    return (
        <input type="checkbox" checked={props.status === TaskStatuses.Completed}
               onChange={changeCheckboxHandler}/>
    )
} // по умолчанию имеет статус как приходит в props, по изменению запускает функцию изменения
