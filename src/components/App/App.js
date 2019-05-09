import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  state = {
    newSong: {
      track: '',
      artist: '',
      published: '',
      rank: '',
    },
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

  postSong(newSong) {
    axios.post('/songs', newSong)
      .then((response) => {
        console.log('response: ', response);
        this.clearInputs();
        this.getSongs();
      })

  }

  clearInputs() {
    this.setState({
      newSong: {
        track: '',
        artist: '',
        published: '',
        rank: '',
      }
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

  newSongData = (event) => {
    let inputValue = event.target.value;
    const propertyKey = event.target.getAttribute('name');

    if (propertyKey == 'rank') {
      inputValue = parseInt(inputValue);
    }

    this.setState({
      newSong: {
        ...this.state.newSong,
        [propertyKey]: inputValue
      }
    });
    console.log('newSong', this.state.newSong);
  }

  saveNewSong = (event) => {
    const newSong = this.state.newSong;
    this.postSong(newSong);
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
        <h3>New Song</h3>
        <input
          type="text"
          name="artist"
          placeholder="Artist"
          value={this.state.artist}
          onChange={this.newSongData}
        />
        <input
          type="text"
          name="track"
          placeholder="Track"
          value={this.state.track}
          onChange={this.newSongData}
        />
        <input
          type="text"
          name="published"
          placeholder="Published"
          value={this.state.published}
          onChange={this.newSongData}
        />
        <input
          type="text"
          name="rank"
          placeholder="Rank"
          value={this.state.rank}
          onChange={this.newSongData}
        />
        <br />
        <button onClick={this.saveNewSong}>Add New Song</button>
        
        <br/>
        {htmlSongs}
      </div>
    );
  }
}

export default App;
