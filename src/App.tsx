import React from 'react';
import BoardContainer from './BoardContainer';
import BoardView from './BoardView';

const App: React.FC = () => (
  <BoardContainer
    time={1000}
    boardSize={20}
    spawnRate={25}
    cellSize={16}
    render={
      (props: BoardViewProps) => <BoardView {...props} />
    }
  />
);

export default App;
