import React, { Component } from "react";
import "./App.css";
import Character from "./Character";
const io = window.io;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: {},
      name: "",
      id: "",
      status: ""
    };
  }

  componentDidMount() {
    this.socket = io("https://secret-hollows-54069.herokuapp.com/circle-quest");
  }
  playerMoved = moveInformation => {
    const { characterId, direction } = moveInformation;
    if (!this.state.characters[characterId]) return;

    const character = this.state.characters[characterId];
    const delta = 15;

    let newX = character.currentLocation.x;
    let newY = character.currentLocation.y;

    if (direction === "left") {
      newX -= delta;
    } else if (direction === "right") {
      newX += delta;
    } else if (direction === "down") {
      newY += delta;
    } else if (direction === "up") {
      newY -= delta;
    }

    this.changeCharacterLocation(character, newX, newY);
  };

  changeCharacterLocation = (character, newX, newY) => {
    const newState = {
      characters: {
        ...this.state.characters,
        [character.id]: {
          ...this.state.characters[character.id],
          currentLocation: { x: newX, y: newY }
        }
      }
    };

    this.setState(newState);
  };

  onCharacterCreated = character => {
    const newState = {
      characters: {
        ...this.state.characters,
        [character.id]: character
      }
    };

    this.setState(newState);
  };

  handleSubmit = e => {
    e.preventDefault();

    const newCharacter = {
      id: this.state.id,
      name: this.state.name,
      status: this.state.status,
      currentLocation: {
        x: 15,
        y: 15
      }
    };

    this.socket.on("player-joined", this.onCharacterCreated);
    this.socket.on("player-moved", this.playerMoved);

    this.socket.emit("join", newCharacter);
  };

  moveMe(direction) {
    this.socket.emit("move", {
      characterId: this.state.id,
      direction
    });
  }

  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const characterList = Object.keys(this.state.characters).map(key => {
      return <Character key={key} character={this.state.characters[key]} />;
    });

    const showForm = characterList.length > 0;
    const displayGame = !showForm ? (
      <p>Please fill out the form to join the game</p>
    ) : (
      <div>
        <div>
          <button
            onClick={e => {
              e.preventDefault();
              this.moveMe("up");
            }}
          >
            Up
          </button>
          <button
            onClick={e => {
              e.preventDefault();
              this.moveMe("down");
            }}
          >
            Down
          </button>
          <button
            onClick={e => {
              e.preventDefault();
              this.moveMe("left");
            }}
          >
            Left
          </button>
          <button
            onClick={e => {
              e.preventDefault();
              this.moveMe("right");
            }}
          >
            Right
          </button>
        </div>
        <div className="App-game">{characterList}</div>
      </div>
    );

    const displayForm = !showForm ? (
      <form onSubmit={this.handleSubmit}>
        <label>
          Id:
          <input name="id" onChange={this.handleChange} value={this.state.id} />
        </label>
        <br />
        <label>
          Name:
          <input
            name="name"
            onChange={this.handleChange}
            value={this.state.name}
          />
        </label>
        <br />
        <label>
          Status:
          <input
            name="status"
            onChange={this.handleChange}
            value={this.state.status}
          />
        </label>
        <br />
        <button type="submit">Join Game</button>
      </form>
    ) : null;

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Circle Quest!</h1>
        </header>
        <p className="App-intro">
          The Kingdom of Unpreparedness for Lecture has been plagued by an evil
          warlock that has changed everyone into a circle! Please buy my DLC and
          pay for my student loans, thanks guys.
        </p>

        {displayForm}
        {displayGame}
      </div>
    );
  }
}

export default App;
