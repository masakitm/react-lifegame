import React from 'react';
import './App.css';
import Board from './Board';

const App: React.FC = () => {
	return <Board time={1000} boardSize={20} spawnRate={25} cellSize={16} />;
}

export default App;