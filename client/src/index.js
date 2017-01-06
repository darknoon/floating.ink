import React, {Component} from 'react';
import {render} from 'react-dom';
import App from './App';
import QuillController from './QuillController';
import {Router, Route, hashHistory} from 'react-router';
import './index.css';

class About extends Component {
  render() {
    return <p>Made by <a href="https://github.com/darknoon">Andrew Pouliot</a>.</p>;
  }
}

render(
    <Router history={hashHistory}>
        <Route path="/" component={App}/>
        <Route path="/work/:workId" component={QuillController}/>
        <Route path="/about" component={About}/>
    </Router>,
  document.getElementById('root')
);
