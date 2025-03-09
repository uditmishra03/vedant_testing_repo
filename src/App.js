import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React V3!! Yay 
          <br />
          This soon be get deployed to our cluster...
        </a>
        <p>Image: uditmishra/react-app:2025-03-09_19-22-18
      </header>
    </div>
  );
}

export default App;
