import React, {ChangeEvent} from 'react';

type CheckboxType = {
    isDone: boolean
    callBack: (eventValue: boolean) => void
} //тип чекбокса

export const Checkbox = (props: CheckboxType) => {
    const changeCheckboxHandler = (event: ChangeEvent<HTMLInputElement>) => {
        props.callBack(event.currentTarget.checked)
    } //функция по клику на чекбокс передает ткущее состояние checked в callback
    return (
        <input type="checkbox" checked={props.isDone}
               onChange={changeCheckboxHandler}/>
    )
} // по умолчанию имеет статус как приходит в props, по изменению запускает функцию изменения
