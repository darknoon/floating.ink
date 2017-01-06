import React, { Component } from 'react';
import './App.css';
import { getAllWorks } from './test-data';
import { Link } from 'react-router';

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
            {getAllWorks().map((w) =>
              <WorkView work={w} pickURL={this.pickURL} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
