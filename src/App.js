import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [appName, setAppName] = useState();
  useEffect(() => {
    const content = document.getElementById("app-name")?.["content"];
    if (!content) return;
    const stringified = content.replaceAll("'", '"');
    const envVarDictionary = JSON.parse(stringified);
    if (envVarDictionary.REACT_APP_NAME)
      setAppName(envVarDictionary.REACT_APP_NAME);
  }, []);
  console.log(process.env.REACT_APP_NAME)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{appName || "NO NAME"}</p>
      </header>
    </div>
  );
}

export default App;
