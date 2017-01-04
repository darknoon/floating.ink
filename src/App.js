import React, { Component } from 'react';
import './App.css';
import * as Quill from './quill/Quill'
// import MdArrowBack from 'react-icons/md/arrow-left'
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import { users, works } from '../backend/test-data';
import { Link } from 'react-router';

var quillURLs = [
  '/data/bg_black_1white_1grey_1pink'
]


class WorkView extends Component {
  render() {
    var {
      bgColor,
      baseURL,
      name,
      previewURL,
      id,
    } = this.props.work;
    return <div className='work'>
      <Link to={`work/${id}`}
        style={ {
          backgroundColor: bgColor,
          backgroundImage: `url("${previewURL}")`,
        } }>
        <h2>{name}</h2>
      </Link>
    </div>
  }
}

class App extends Component {

  render() {
    return (
      <div className='App'>
        <div id='initialHeader'>
          <h1>FLOATING.INK</h1>
          <p>view virtual paintings in your browser</p>
          {/*<button id='uploadButton'>upload</button>*/}
        </div>
        <div id='initial'>
          <div id='works'>
            {works.concat(works).concat(works).concat(works).map((w) =>
              <WorkView work={w} pickURL={this.pickURL} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
