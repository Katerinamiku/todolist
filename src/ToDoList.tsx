import React from "react";

type ToDoListPropsType = {
    title?: string
    task: Array<TaskPropsType>
}

type TaskPropsType={
    id: number
    title: string
    isDone: boolean
}

export const ToDoList = (props:ToDoListPropsType) => {
    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {props.task.map(el=> {
                    return (
                        <li><input type="checkbox" checked={props.task[0].isDone}/> <span>{props.task[0].title}</span></li>
                    )
                })}
                {/*<li><input type="checkbox" checked={props.task[0].isDone}/> <span>{props.task[0].title}</span></li>*/}
                {/*<li><input type="checkbox" checked={props.task[1].isDone}/> <span>{props.task[1].title}</span></li>*/}
                {/*<li><input type="checkbox" checked={props.task[2].isDone}/> <span>{props.task[2].title}</span></li>*/}
            </ul>
            <div>
                <button>All</button>
                <button>Active</button>
                <button>Completed</button>
            </div>
        </div>
    );
}

//создать новый пролект, засунуть в него свой src с этого зантия, полукчить два одлимнгаковыхз проекта. - учимся
// делать src