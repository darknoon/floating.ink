import React, { Component } from 'react';
// Can't import this directly because es6 transform not applied to node_modules. Should fix that I guess...
// import MdArrowBack from 'react-icons/md/arrow-left'
import MdArrowBack from 'react-icons/lib/md/arrow-back';

import * as Quill from './quill/Quill';
import {Link} from 'react-router';

import API from './api/API'

class QuillController extends Component {
  constructor(props) {
    super(props);
    var id = props.params.workId;
    this.state = {
      work: null,
      quill: null,
    }
    this._id = id;
  }

    // Prevent React exceptions from being swallowed by promise API :/
  _setState(s) {
    var that = this;
    requestAnimationFrame(() => {
      that.setState(s);
    });
  }

  componentDidMount() {

    var id = this._id;

    var that = this;
    var api = new API();
    api.getWork(id).then( (w) => {

      var work = w.data.work;

      // Update our state to include the URL
      that._setState({
        work: work,
        quill: null,
      });

      return Quill.loadFromURL(work.baseURL);
    }).then( q =>{
      that._setState({
        work: this.state.work,
        quill: q,
      });
    });
  }

  render() {
    let quill = this.state.quill;

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
      <p>Loading {this._id}...</p>);
    }
  }
}

export default QuillController;

