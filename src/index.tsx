import './index.css';
import { configureStore } from './redux';
import { Provider } from 'react-redux';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

const store = configureStore({ enableLogger: true });

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root') as HTMLElement
);
