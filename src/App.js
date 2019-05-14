import React from 'react';
import Board from './Board'

function App() {
	return <Board time={1000} boardSize={8} spawnRate={25} cellSize={16} />;
}

export default App;
