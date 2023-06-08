import React, { useState, useEffect } from "react";
// import { Router, Route} from 'react-router-dom';
import "./App.css";

import BusComponent from "./BusComponent";

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000"); // Replace '/api/data' with your backend API endpoint
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Bus Information</h1>
      {Object.entries(data).map(([routeName, students]) => (
        <BusComponent
          key={routeName}
          // routeName={routeName}
          // students={students as string[]}
        />
      ))}
    </div>
  );
}

export default App;
