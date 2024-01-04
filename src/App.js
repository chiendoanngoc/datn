import './App.css';
import React from 'react';
import BasicTabs from './CustomTabPanel';
import ButtonAppBar from './ButtonAppBar';

function App() {

  return (
    <div className="App">
      <ButtonAppBar />
      <BasicTabs />
    </div>
  );
}

export default App;
