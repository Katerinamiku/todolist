import React, {ChangeEvent} from 'react';

type CheckboxType = {
    checked: boolean
    callBack: (eventValue: boolean) => void
}

export const Checkbox = (props: CheckboxType) => {
    const changeCheckboxHandler = (event: ChangeEvent<HTMLInputElement>) => {
        props.callBack(event.currentTarget.checked)
    }
    return (
        <input type="checkbox" checked={props.checked}
               onChange={changeCheckboxHandler}/>
    )
}
