import React, { useState } from 'react';
import { Button } from "antd";
import './App.css';
import { PickersGroup } from './view/PickersGroup/pickersGroup';

const App: React.FC = (props) => {
  const [showPickers, setShowPickers] = useState(true)

  const handleClick = (event: React.MouseEvent) => {
    console.log(event)
    setShowPickers(state => !state)
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          hellp
        </p>
        <Button type="primary" onClick={handleClick}>Toggle</Button>
        <PickersGroup className={`${showPickers ? "fade-in": "fade-out"}`} />
        <a
          className={`App-link ${showPickers ? "fade-in": "fade-out"}`}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
