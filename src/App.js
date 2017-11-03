import React, { Component } from "react";
import "./App.css";
import Character from "./Character";
const Pusher = window.Pusher;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: {
        one: {
          id: "one",
          name: "Phil",
          status: "uncomfortable",
          currentLocation: { x: 10, y: 20 }
        }
      },
      name: "",
      id: "",
      status: ""
    };

    Pusher.logToConsole = true;
    const pusher = new Pusher("b280c5d944f17da55d8b", {
      cluster: "us2",
      encrypted: true
    });

    this.channel = pusher.subscribe("circle-quest");
  }

  channel = null;

  componentDidMount() {
    setTimeout(() => {
      this.changeCharacterLocation(this.state.characters["one"], 500, 300);
    }, 500);
  }

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

  handleSubmit = e => {
    e.preventDefault();
    console.log("handling submit");

    const newCharacter = {
      id: this.state.id,
      name: this.state.name,
      status: this.state.status,
      currentLocation: {
        x: 15,
        y: 15
      }
    };

    console.log(newCharacter);

    const newState = {
      characters: {
        ...this.state.characters,
        [this.state.id]: newCharacter
      }
    };

    console.log(newState);

    this.setState(newState);
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const characterList = Object.keys(this.state.characters).map(key => {
      return <Character key={key} character={this.state.characters[key]} />;
    });

    console.log(characterList);

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
        <form onSubmit={this.handleSubmit}>
          <input name="id" onChange={this.handleChange} value={this.state.id} />
          <br />
          <input
            name="name"
            onChange={this.handleChange}
            value={this.state.name}
          />
          <br />
          <input
            name="status"
            onChange={this.handleChange}
            value={this.state.status}
          />
          <br />
          <button type="submit">Join Game</button>
        </form>

        <div className="App-game">{characterList}</div>
      </div>
    );
  }
}

export default App;
