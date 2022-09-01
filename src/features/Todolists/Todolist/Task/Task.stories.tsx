import React from 'react';
import {action} from "@storybook/addon-actions";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Task} from "./Task";
import {v1} from "uuid";
import {TasksPriorities, TaskStatuses} from "../../../../api/todolists-api";


export default {
    title: 'Todolist/Task stories',
    component: Task,
} as ComponentMeta<typeof Task>;

const changeTaskStatusCallback = action('Task status is changed')
const changeTaskTitleCallback = action('Task title changed')
const removeTaskCallback = action('Task is removed')

const baseArgs = {
    changeTaskStatus: changeTaskStatusCallback,
    changeTaskTitle: changeTaskTitleCallback,
    removeTask: removeTaskCallback
}
const Template: ComponentStory<typeof Task> = (args) => <Task {...args}/>


export const TaskExample = Template.bind({});
TaskExample.args = {
   ...baseArgs,
    task: {id: v1(), title: 'CSS', status: TaskStatuses.Completed, todoListId: 'todolistId1', description: '', completed: false, startDate: '', deadline: '', addedDate: '', order: 0, priority: TasksPriorities.Middle},
    todolistId: 'todolistId1'
}
