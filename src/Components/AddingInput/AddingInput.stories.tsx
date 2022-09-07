import React from 'react';
import AddingInput from "./AddingInput";
import {action} from "@storybook/addon-actions";
import {ComponentMeta, ComponentStory} from "@storybook/react";


export default {
    title: 'Todolist/Input stories',
    component: AddingInput,
    argTypes: {
        addItem: {
            description: 'Button of the form is clicked'
        },
        disabled: {
            description: 'form is disabled'
        }
    }
} as ComponentMeta<typeof AddingInput>;

const Template: ComponentStory<typeof AddingInput> = (args) => <AddingInput {...args}/>


export const InputExample = Template.bind({});
InputExample.args = {
    addItem: action('Button of the form is clicked')
}
export const FormIsDisabledExample = Template.bind({});
FormIsDisabledExample.args = {
    disabled: true
}
