import React from 'react';
import {action} from "@storybook/addon-actions";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import EditableSpan from "./EditableSpan";


export default {
    title: 'Todolist/Span stories',
    component: EditableSpan,
    argTypes: {
        changeTitle: {
            description: 'Title is changed'
        },
        title: {
            defaultTitle: 'HTML',
            description: 'Start title of the Span'
        }
    }
} as ComponentMeta<typeof EditableSpan>;


const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args}/>


export const SpanExample = Template.bind({});
SpanExample.args = {
    changeTitle: action('Title is changed'),
    title: 'Start title'
}
