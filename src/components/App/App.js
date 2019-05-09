import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  state = {
    songs: [],
  }
  componentDidMount() {
    console.log('werd');
    this.getSongs();
  }

  getSongs() {
    axios({
      method: 'GET',
      url: '/songs',
    })
    .then((response) => {
      console.log(response);
      this.setState({
        songs: response.data,
      })
    });
  }

  render() {
    const htmlSongs = this.state.songs.map((indvSong, i) => {
      return <p key={i}>{indvSong.track} by {indvSong.artist}</p>;
    });

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Songs!</h1>
        </header>
        <br/>
        {htmlSongs}
      </div>
    );
  }
}

export default App;
