import React, { Component } from 'react';
import './App.css';
import * as Quill from './quill/Quill'
// import MdArrowBack from 'react-icons/md/arrow-left'
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import { users, works } from './test-data';

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
    } = this.props.work;
    return <div className='work'>
      <a href='' onClick={ (e) => {this.props.pickURL(baseURL); e.preventDefault();} }
      style={ {
        backgroundColor: bgColor,
        backgroundImage: `url("${previewURL}")`,
      } }>
        <h2>{name}</h2>
      </a>
    </div>
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      quill: null,
      loadingQuill: null,
    }
  }

  pickURL = (url) => {
      this.setState({
        quill: null,
        loadingQuill: url,
      })

      var that = this;
      Quill.loadFromURL(url).then( (q) =>{
        // Prevent exceptions from being swallowed by promise
        requestAnimationFrame(() => {
          that.setState({
            quill: q,
            loadingQuill: null,
          })
        })
      });
  }

  clearURL = () => {
    this.setState({
      quill: null,
      loadingQuill: null,
    })
  }

  render() {
    const {
      loadingQuill,
      quill
    } = this.state;

    if (loadingQuill) {
      return <div>Loading quill {loadingQuill}...</div>;
    } else if (quill) {
      return (
        <div>
          <div id='rendererControls'>
            <button className='iconButton' onClick={ this.clearURL }>
              <MdArrowBack size={24} color='white'/>
            </button>
          </div>
          <Quill.Renderer quill={quill} />
        </div>
      );
    } else {
      return (
        <div className='App'>
          <div id='initialHeader'>
            <h1>FLOATING.INK</h1>
            <p>view virtual paintings in your browser</p>
            <button id='uploadButton'>upload</button>
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
}

export default App;
