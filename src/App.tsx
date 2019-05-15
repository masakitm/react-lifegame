import React from 'react';
import Board from './Board';

const App: React.FC = () => <Board time={1000} boardSize={20} spawnRate={25} cellSize={16} />;

export default App;
