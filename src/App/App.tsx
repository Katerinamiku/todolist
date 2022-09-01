import React from 'react';
import './App.css';
import {AppBar, Button, Container, IconButton, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {TodolistsList} from "../features/Todolists/TodolistsList";

function App() {
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <div><Button color="inherit" variant={"outlined"} style={{margin: '5px'}}>Login</Button>
                        <Button color="inherit" variant={"outlined"} style={{margin: '5px'}}>Sign in</Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <TodolistsList />
            </Container>
        </div>
    );
}

export default App;


