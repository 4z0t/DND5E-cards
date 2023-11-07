import logo from "./logo.svg";
import "./App.css";
import Cards from "./Components/cards";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Cards url="cards.json" pollInterval={5000} type="Бард" />
      </header>
    </div>
  );
}

export default App;
