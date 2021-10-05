//core
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom"
import {Provider} from "react-redux";
//components
import App from "@/App";

//config
import store from "@/store/store";
import * as serviceWorker from '@/serviceWorker';

//styles
import "./index.scss"

const application = (
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(application, document.getElementById('root'));

serviceWorker.register({});