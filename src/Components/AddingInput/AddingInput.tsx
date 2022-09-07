import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Button, TextField} from "@material-ui/core";
import {AddCircleOutline} from "@material-ui/icons";



export type AddingInputPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddingInput = React.memo((props: AddingInputPropsType) => {
    console.log('input is called !')
    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
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
                   disabled={props.disabled}
        />

        <Button size={'small'}
                color={'secondary'}
                variant={'contained'}
                disabled={props.disabled}
                onClick={addItem}
                style={{margin: '10px'}}
                startIcon={<AddCircleOutline/>}
        >Add</Button>
    </div>
})

export default AddingInput;
