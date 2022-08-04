import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createTheme, CssBaseline, ThemeProvider} from "@material-ui/core";
import {teal, yellow} from "@material-ui/core/colors";
import AppWithReducer from "./AppWithReducer";
import AppWithRedux from "./AppWithRedux";
import {Provider} from "react-redux";
import {store} from "./reducers/store";


const theme = createTheme({
    palette: {
        primary: teal,
        secondary: yellow,
        type: "dark"
    }
})


ReactDOM.render(
    <Provider store={store}>
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        {/*<App/>*/}
        {/*<AppWithReducer/>*/}
        <AppWithRedux/>
    </ThemeProvider>
    </Provider>,
    document.getElementById('root'));

serviceWorker.unregister();
