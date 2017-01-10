import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router';
import API from './api/API'

class WorkView extends Component {
  render() {
    var {
      bgColor,
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

function WorkList(props) {
  if (!props.works) return null;

  return (
    <div id='initial'>
      <div id='works'>
        {props.works.map((w) =>
          <WorkView work={w} pickURL={props.pickURL} key={w.id} />
        )}
      </div>
    </div>
  );
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {feed: null}
  }

  componentDidMount() {
    this._request = new API().getFeed().then( data => {
      var feed = data.data.feed;
      console.log("Fetched data");
      this.setState({feed})
    }).catch( err => console.log(err) );
  }

  render() {
    return (
      <div className='App'>
        <div id='initialHeader'>
          <h1>FLOATING.INK</h1>
          <p>view virtual paintings in your browser</p>
          {/*<button id='uploadButton'>upload</button>*/}
        </div>
        <WorkList works={this.state.feed} pickURL={this.pickURL} />
      </div>
    );
  }
}

export default App;
