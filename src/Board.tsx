import * as React from "react";
import { createNeighbourIndex, isRight, isBottom } from "./utils/boardHelpers";

const createBoardStatus = (size: number): Cell[] => new Array(size * size).fill(initCell());

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

const initCell = (): Cell => ({
	id: '',
	live: false,
	neighbours: []
});

const reloadPage = (): void => window.location.reload()

type Cell = {
	id: string,
	live: boolean,
	neighbours: number[],
}

type State = {
	boardStatus: Cell[]
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
      boardStatus: []
		};
		
		this.hasFinished = this.hasFinished.bind(this)
		this.countLivingNeighbours = this.countLivingNeighbours.bind(this)
		this.updateLive = this.updateLive.bind(this)
		this.runLifeCycle = this.runLifeCycle.bind(this)
		this.initBoardStatus = this.initBoardStatus.bind(this)
		this.start = this.start.bind(this)
	}

	hasFinished(): boolean {
		const { boardStatus } = this.state
		return boardStatus.every((cell: Cell) => cell.live === false)
	}

	countLivingNeighbours(neighbourList: number[]): number {
		const { boardStatus } = this.state
		const live = neighbourList.map((num: number): boolean => {
			return boardStatus[num].live
		})

		return live.filter(live => live).length
	}

	updateLive(neighbourList: number[], isLive: boolean): boolean {
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

		const { boardStatus } = this.state
		const nextBoardStatus: Cell[] = boardStatus.map(cell => {
			const live = this.updateLive(cell.neighbours, cell.live)
			return { ...cell, live }
		})

		this.setState({ boardStatus: nextBoardStatus});
	}

  initBoardStatus() {
    //　ボード初期化
		const { spawnRate, boardSize } = this.props;
	
    const newStatus: Cell[] = createBoardStatus(boardSize).map((cell: Cell, index: number) => {
      return {
        ...cell,
        ...setInitCellId(index),
				...setInitCellLive(spawnRate),
				...setInitCellNeighbours(boardSize, index)
      };
    });

    this.setState({
      boardStatus: newStatus
		});
	}

  componentDidMount() {
		this.initBoardStatus();
	}

	start() {
		const { runLifeCycle } = this
		const { time } = this.props
		setInterval(runLifeCycle, time)
	}

  render() {
		const { boardStatus } = this.state
    const { boardSize, cellSize } = this.props;
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
