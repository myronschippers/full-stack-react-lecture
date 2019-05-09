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

  deleteSong = (event) => {
    console.log(event.target);
    const songIndex = event.target.dataset.id;
    const songId = this.state.songs[songIndex].id;
    axios.delete(`/songs/${songId}`)
      .then((response) => {
        this.getSongs();
      }).catch();
  }

  render() {
    const htmlSongs = this.state.songs.map((indvSong, i) => {
      return (
        <p key={i}>
          {indvSong.track} by {indvSong.artist}
          <button data-id={i} data-rank={indvSong.rank} onClick={this.deleteSong}>Delete</button>
        </p>
      );
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
