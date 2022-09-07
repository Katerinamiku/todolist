import React, {ChangeEvent, FC, KeyboardEvent, useState} from 'react';
import {TextField} from "@material-ui/core";

type EditableSpanPropsType = {
    title: string
    changeTitle: (editedTitle: string) => void
    disabled?: boolean
}

const EditableSpan: FC<EditableSpanPropsType> = React.memo(function({title, changeTitle, disabled}) {
    console.log('EditSpan called')
    const [text, setText] = useState<string>(title)
    const [editMode, setEditMode] = useState<boolean>(false)

    const onChangeSetText = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.currentTarget.value)
    }
    const onKeyDownChangeTitle = (e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && activateViewMode();

    const activateEditMode = () => {
        if (disabled) {
            return;
        } else {
            setEditMode(true);
        }
    }
    const activateViewMode = () => {
        setEditMode(false)
        changeTitle(text)
    }

    return (
        editMode
            ?
            <TextField value={text}
                       onChange={onChangeSetText}
                       onKeyDown={onKeyDownChangeTitle}
                       onBlur={activateViewMode}
                       disabled={disabled}
                       autoFocus/>

            : <span onDoubleClick={activateEditMode}>{title}</span>
    )
        ;
});

export default EditableSpan;
