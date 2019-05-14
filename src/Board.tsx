import * as React from "react";
import { createNeighbourIndex, isRight, isBottom } from "./utils/boardHelpers";

const createBoardStatus = (size: number) => new Array(size * size).fill(initCell());

type CellNeighbours = { neighbours: number[] }
const setInitCellNeighbours = (size: number, index: number): CellNeighbours => ({ 
	neighbours: createNeighbourIndex(size, index) 
})

type CellLive = { live: boolean }
const setInitCellLive = (spawnRate: number): CellLive => {
  return {
    live: spawnRate > Math.floor(Math.random() * 100)
  };
};

type CellId = { id: string }
const setInitCellId = (index: number): CellId => ({ 
	id: `id${(index || 0)}` 
});

type InitCell = { live: boolean }
const initCell = (): InitCell => ({
  live: false,
});

const initState = (): State => ({
	time: 1000,
	cellSize: 8,
	spawnRate: 25,
	boardSize: 8,
	boardStatus: createBoardStatus(8)
})

const createDefaultState = (props: Props) => ({
	time: props.time || initState().time,
	cellSize: props.cellSize > 0 ? props.cellSize : initState().cellSize,
	spawnRate: props.spawnRate > 0 && props.spawnRate <= 100 ? props.spawnRate : initState().spawnRate, // 0〜100
	boardSize: props.boardSize > 0 ? props.boardSize : initState().boardSize,
	boardStatus: props.boardSize
		? createBoardStatus(props.boardSize)
		: initState().boardSize
})

const reloadPage = () => window.location.reload()

type Cell = {
	id: string,
	live: boolean,
	neighbours: number[],
}

type State = {
	time: number,
	cellSize: number,
	spawnRate: number,
	boardSize: number,
	boardStatus: number[] | any
}

type Props = {
	time: number,
	cellSize: number,
	spawnRate: number,
	boardSize: number
}

class Board extends React.Component<Props, State> {
  constructor(props: Props) {
		super(props);
		
    this.state = {
      ...createDefaultState(props)
		};
		
		this.hasFinished = this.hasFinished.bind(this)
		this.countLivingNeighbours = this.countLivingNeighbours.bind(this)
		this.updateLive = this.updateLive.bind(this)
		this.runLifeCycle = this.runLifeCycle.bind(this)
		this.initBoardStatus = this.initBoardStatus.bind(this)
		this.start = this.start.bind(this)
	}

	hasFinished() {
		const { boardStatus } = this.state
		return boardStatus.every((cell: Cell) => cell.live === false)
	}

	countLivingNeighbours(neighbourList: number[]) {
		const { boardStatus } = this.state
		const live = neighbourList.map((num: number) => {
			return boardStatus[num].live
		})

		return live.filter(live => live).length
	}

	updateLive(neighbourList: number[], isLive: boolean) {
		const liveCount = this.countLivingNeighbours(neighbourList)
		
		if (liveCount >= 4 || liveCount <= 1) {
			return false
		}

		if (liveCount === 3) {
			return true
		}

		if (isLive && liveCount === 2) {
			return true
		}

		return isLive
	}

	runLifeCycle() {
		if (this.hasFinished()) { 
			return 
		}

		const { boardStatus }: { boardStatus: Cell[] } = this.state
		const nextBoardStatus = boardStatus.map(cell => {
			const live = this.updateLive(cell.neighbours, cell.live)
			return { ...cell, live }
		})

		this.setState({ boardStatus: nextBoardStatus});
	}

  async initBoardStatus() {
    //　ボード初期化
    const { boardStatus, spawnRate, boardSize } = this.state;
    const newStatus = boardStatus.map((cell: Cell, index: number) => {
      return {
        ...cell,
        ...setInitCellId(index),
				...setInitCellLive(spawnRate),
				...setInitCellNeighbours(boardSize, index)
      };
    });

    await this.setState({
      boardStatus: newStatus
		});
	}

  componentDidMount() {
		this.initBoardStatus();
	}

	start() {
		const { runLifeCycle } = this
		const { time } = this.state
		setInterval(runLifeCycle, time)
	}

  render() {
    const { boardSize, boardStatus, cellSize } = this.state;
    return (
      <div>
        <h1>life gaming</h1>

				<div>
					<button onClick={this.start}>start</button>
					<button onClick={reloadPage}>reload</button>
				</div>

        <div style={{ fontSize: 0 }}>
          {boardStatus.map((cell: Cell, index: number): React.ReactNode => (	
						<span 
							key={cell.id}
						>
							<i
                style={generateStyle(cellSize, cell.live, boardSize, index)}
              />
              {isRight(boardSize, index) && <br />}
            </span>
          ))}
        </div>
      </div>
    );
  }
}


const generateStyle = (cellSize: number, live: boolean, boardSize: number, index: number): React.CSSProperties => {
  const border = "1px solid #000";
  return {
    display: "inline-block",
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    margin: 0,
    padding: 0,
    lineHeight: 0,
    background: live ? "#000" : "#fff",
    boxSizing: "border-box",
    borderTop: border,
    borderLeft: border,
    borderRight: isRight(boardSize, index) ? border : "none",
    borderBottom: isBottom(boardSize, index) ? border : "none"
  };
};

export default Board;
