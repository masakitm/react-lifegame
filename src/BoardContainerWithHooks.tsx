import * as React from 'react';
import { createNeighbourIndex } from './utils/boardHelpers';

const { useState, useEffect } = React;

const initCell = (): Cell => ({
  id: '',
  live: false,
  neighbours: [],
});

const createBoardStatus = (size: number): Cell[] => new Array(size * size).fill(initCell());

type CellNeighbours = { neighbours: number[] }
const setInitCellNeighbours = (size: number, index: number): CellNeighbours => ({
  neighbours: createNeighbourIndex(size, index),
});

type CellLive = { live: boolean }
const setInitCellLive = (spawnRate: number): CellLive => ({
  live: spawnRate > Math.floor(Math.random() * 100),
});

type CellId = { id: string }
const setInitCellId = (index: number): CellId => ({
  id: `id${(index || 0)}`,
});

type BoardContainerProps = {
  time: number,
  cellSize: number,
  spawnRate: number,
  boardSize: number,
  render: (props: BoardViewProps) => JSX.Element,
}


const Board = (props: BoardContainerProps) => {
  const {
    time, spawnRate, boardSize, cellSize, render,
  } = props;

  const [boardStatus, setBoardStatus] = useState<Cell[]>([]);

  const countLivingNeighbours = (neighbourList: number[]): number => {
    const live = neighbourList.map((num: number): boolean => boardStatus[num].live);
    return live.filter(cellLive => cellLive).length;
  };

  const nextLiveStatus = (neighbourList: number[], isLive: boolean): boolean => {
    const liveCount = countLivingNeighbours(neighbourList);

    if (liveCount >= 4 || liveCount <= 1) { return false; }
    if (liveCount === 3) { return true; }
    if (isLive && liveCount === 2) { return true; }
    return isLive;
  };

  const updateBoardStatus = (): void => {
    const nextBoardStatus: Cell[] = boardStatus.map((cell) => {
      const live = nextLiveStatus(cell.neighbours, cell.live);
      return { ...cell, live };
    });

    setBoardStatus(nextBoardStatus);
  };

  const initBoardStatus = (): void => {
    const newBoardStatus: Cell[] = createBoardStatus(boardSize).map(
      (cell: Cell, index: number) => ({
        ...cell,
        ...setInitCellId(index),
        ...setInitCellLive(spawnRate),
        ...setInitCellNeighbours(boardSize, index),
      }),
    );

    setBoardStatus(newBoardStatus);
  };

  const start = (): void => {
    setInterval(updateBoardStatus, time);
  };

  useEffect(() => initBoardStatus(), []);

  return (
    <div>
      {render({
        boardSize, cellSize, boardStatus, start,
      })}
    </div>
  );
};

export default Board;
