import React, { Component } from 'react';
import './App.css';

// import * as ti from './testink';

import * as Quill from './quill/Quill'

// import QuillViewer from './quill/renderquill'

var quillURLs = [
  '/data/bg_black_1white_1grey_1pink'
]

class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: quillURLs[0],
    };
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = (event) => {
    this.props.pickURL(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div id="controls">
        <form onSubmit={this.handleSubmit}>
          <label>
            Quill URL:
            <input id="urlPicker" type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
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

  render() {
    const {
      loadingQuill,
      quill
    } = this.state;

    if (loadingQuill) {
      return <div>Loading quill {loadingQuill}...</div>;
    } else if (quill) {
      return (
        <Quill.Renderer quill={quill} />
      );
    } else {
      return (
        <div className="App">
          <h1> Floating Ink</h1>
          <Controls pickURL={this.pickURL} />
        </div>
      );
    }
  }
}

export default App;
