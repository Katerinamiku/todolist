import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {createTheme, CssBaseline, ThemeProvider} from "@material-ui/core";
import {teal, yellow} from "@material-ui/core/colors";
import App from "./App/App";
import {Provider} from "react-redux";
import {store} from "./reducers/store";
import {BrowserRouter} from "react-router-dom";


const theme = createTheme({
    palette: {
        primary: teal,
        secondary: yellow,
        type: "dark"
    }
})


ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <App/>
            </ThemeProvider>
        </Provider>
    </BrowserRouter>,
    document.getElementById('root'));

serviceWorker.unregister();


