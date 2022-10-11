import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {CssBaseline} from "@material-ui/core";
import App from "./App/App";
import {Provider} from "react-redux";
import {store} from "./reducers/store";
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <CssBaseline/>
            <App/>
        </Provider>
    </BrowserRouter>,
    document.getElementById('root'));

serviceWorker.unregister();


