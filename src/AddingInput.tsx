import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button, TextField} from "@material-ui/core";
import {AddCircleOutline} from "@material-ui/icons";
import s from './Todolist.module.css';

type AddingInputPropsType = {
    addItem: (title: string) => void

}

function AddingInput(props: AddingInputPropsType) {

    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (e.key === 'Enter') {
            addItem();
        }
    }
    const addItem = () => {
        let newTitle = title.trim();
        if (newTitle !== "") {
            props.addItem(newTitle);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }
    return <div>
        <TextField value={title}
                   onChange={onChangeHandler}
                   onKeyDown={onKeyPressHandler}
                   hiddenLabel
                   defaultValue="Small"
                   variant="outlined"
                   size="small"
                   error={!!error}
                   label="Enter name"
                   helperText={error}
        />

        <Button size={'small'}
                color={'secondary'}
                variant={'contained'}
                disableElevation
                onClick={addItem}
                style={{margin: '10px'}}
                startIcon={<AddCircleOutline/>}
        >Add</Button>
    </div>
}

export default AddingInput;
