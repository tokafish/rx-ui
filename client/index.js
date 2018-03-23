import React from 'react';
import ReactDOM from 'react-dom';
import Graph from './graph.js'
import './style/style.scss';


const App = () => {
  return <Graph/>
}

ReactDOM.render(
  <App />,
  document.querySelector('#root')
);
