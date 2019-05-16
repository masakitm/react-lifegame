import * as React from 'react';
import { createNeighbourIndex } from './utils/boardHelpers';

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

type BoardState = {
  boardStatus: Cell[]
}

type BoardProps = {
  time: number,
  cellSize: number,
  spawnRate: number,
  boardSize: number,
  render: (props: any) => JSX.Element,
}

class Board extends React.Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props);

    this.state = {
      boardStatus: [],
    };

    this.hasFinished = this.hasFinished.bind(this);
    this.countLivingNeighbours = this.countLivingNeighbours.bind(this);
    this.updateLive = this.updateLive.bind(this);
    this.runLifeCycle = this.runLifeCycle.bind(this);
    this.initBoardStatus = this.initBoardStatus.bind(this);
    this.start = this.start.bind(this);
  }

  componentDidMount(): void {
    console.log(this.props);
    this.initBoardStatus();
  }

  hasFinished(): boolean {
    const { boardStatus } = this.state;
    return boardStatus.every((cell: Cell) => cell.live === false);
  }

  countLivingNeighbours(neighbourList: number[]): number {
    const { boardStatus } = this.state;
    const live = neighbourList.map((num: number): boolean => boardStatus[num].live);

    return live.filter(cellLive => cellLive).length;
  }

  updateLive(neighbourList: number[], isLive: boolean): boolean {
    const liveCount = this.countLivingNeighbours(neighbourList);

    if (liveCount >= 4 || liveCount <= 1) {
      return false;
    }

    if (liveCount === 3) {
      return true;
    }

    if (isLive && liveCount === 2) {
      return true;
    }

    return isLive;
  }

  runLifeCycle() {
    if (this.hasFinished()) {
      return;
    }

    const { boardStatus } = this.state;
    const nextBoardStatus: Cell[] = boardStatus.map((cell) => {
      const live = this.updateLive(cell.neighbours, cell.live);
      return { ...cell, live };
    });

    this.setState({ boardStatus: nextBoardStatus });
  }

  initBoardStatus() {
    const { spawnRate, boardSize } = this.props;

    const newStatus: Cell[] = createBoardStatus(boardSize).map((cell: Cell, index: number) => ({
      ...cell,
      ...setInitCellId(index),
      ...setInitCellLive(spawnRate),
      ...setInitCellNeighbours(boardSize, index),
    }));

    this.setState({
      boardStatus: newStatus,
    });
  }

  start() {
    const { runLifeCycle } = this;
    const { time } = this.props;
    setInterval(runLifeCycle, time);
  }

  render() {
    const { boardSize, cellSize, render } = this.props;
    const { boardStatus } = this.state;

    const childrenProps = {
      boardSize,
      cellSize,
      boardStatus,
      start: this.start,
    };

    return (
      <div>
        {render(childrenProps)}
      </div>
    );
  }
}

export default Board;
