import React, { Component } from 'react';
// Can't import this directly because es6 transform not applied to node_modules. Should fix that I guess...
// import MdArrowBack from 'react-icons/md/arrow-left'
import MdArrowBack from 'react-icons/lib/md/arrow-back';

import * as Quill from './quill/Quill';
import {Link} from 'react-router';

import { workById } from './test-data';

class QuillController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quill: null,
    }
    var id = props.params.workId;
    var work = this._work = workById(id);
    this._url = work.baseURL;
  }

  componentDidMount() {
    var that = this;
    Quill.loadFromURL(this._url).then( (q) =>{
      // Prevent exceptions from being swallowed by promise API :/
      requestAnimationFrame(() => {
        that.setState({
          quill: q,
        })
      })
    });
  }

  render() {
    var quill = this.state.quill, name = this._work.name;

    if (quill) {
      return (
      <div>
        <div id='rendererControls'>
          <Link to='/'>
            <button className='iconButton'>
              <MdArrowBack size={24} color='white'/>
            </button>
          </Link>
        </div>
        <Quill.Renderer quill={quill} />
      </div>);
    } else {
      return (
      <p>Loading {name}...</p>);
    }
  }
}

export default QuillController;

