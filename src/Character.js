import React from "react";
import "./Character.css";

function Character({ character }) {
  const { name, currentLocation, status } = character;

  const style = {
    transform: `translate(${currentLocation.x}px, ${currentLocation.y}px`
  };

  return (
    <div className="character" style={style}>
      <h3>{name}</h3>
      <span className="circle" />
      <p className="status">
        {name} is {status}
      </p>
    </div>
  );
}

export default Character;
