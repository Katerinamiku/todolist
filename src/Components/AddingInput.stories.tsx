import React from 'react';
import AddingInput from "./AddingInput";
import {action} from "@storybook/addon-actions";
import {ComponentMeta, ComponentStory} from "@storybook/react";


export default {
    title: 'Todolist/Input stories',
    component: AddingInput,
    argTypes: {
        onClick: {
            description: 'Button of the form is clicked'
        }
    }
} as ComponentMeta<typeof AddingInput>;

const Template: ComponentStory<typeof AddingInput> = (args) => <AddingInput {...args}/>


export const InputExample = Template.bind({});
InputExample.args = {
    addItem: action('Button of the form is clicked')
}
