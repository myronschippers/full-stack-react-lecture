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
        <div className="col-6" key={i}>
          <div className="alert alert-secondary text-left">
            <h3 className="border-bottom border-secondary">{indvSong.track}</h3>
            <div>
              <div>Artist: {indvSong.artist}</div>
              <div>Rank: {indvSong.rank}</div>
              <div>Published: {indvSong.published}</div>
            </div>

            <button className="btn btn-danger"
              data-id={i}
              data-rank={indvSong.rank}
              onClick={this.deleteSong}
            >
              Delete
            </button>
          </div>
        </div>
      );
    });

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Songs!</h1>
        </header>
        <h3>New Song</h3>

        <div className="container margin-bottom">
          <div className="row">  
            <div className="col-4">
              <input
                className="form-control form-control-lg"
                type="text"
                name="artist"
                placeholder="Artist"
                value={this.state.artist}
                onChange={this.newSongData}
              />
            </div>
            <div className="col-4">
              <input
                className="form-control form-control-lg"
                type="text"
                name="track"
                placeholder="Track"
                value={this.state.track}
                onChange={this.newSongData}
              />
            </div>
            <div className="col-4">
              <input
                className="form-control form-control-lg"
                type="text"
                name="published"
                placeholder="Published"
                value={this.state.published}
                onChange={this.newSongData}
              />
            </div>
            <div className="col-4">
              <input
                className="form-control form-control-lg"
                type="text"
                name="rank"
                placeholder="Rank"
                value={this.state.rank}
                onChange={this.newSongData}
              />
            </div>
          </div>
          <button onClick={this.saveNewSong} className="btn btn-primary">Add New Song</button>
        </div>
        
        <div className="container">
          <div className="row">
            {htmlSongs}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
