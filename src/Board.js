import React from "react";
import { createNeighbourIndex, isRight, isBottom } from "./utils/boardHelpers";

const createBoardStatus = size => new Array(size * size).fill(initCell());

const setInitCellNeighbours = (size, index) => ({ 
	neighbours: createNeighbourIndex(size, index) 
})

const setInitCellLive = spawnRate => {
  return {
    live: spawnRate > Math.floor(Math.random() * 100)
  };
};

const setInitCellId = index => ({ 
	id: `id${(index || 0)}` 
});

const initCell = () => ({
  live: false,
});

const initState = () => ({
	time: 1000,
	cellSize: 8,
	spawnRate: 25,
	boardSize: 8,
	boardStatus: createBoardStatus(8)
})

const createDefaultState = props => ({
	time: props.time || initState().time,
	cellSize: props.cellSize > 0 ? props.cellSize : initState().cellSize,
	spawnRate: props.spawnRate > 0 && props.spawnRate <= 100 ? props.spawnRate : initState().spawnRate, // 0〜100
	boardSize: props.boardSize > 0 ? props.boardSize : initState().boardSize,
	boardStatus: props.boardSize
		? createBoardStatus(props.boardSize)
		: initState().boardSize
})

const reloadPage = () => window.location.reload()

class Board extends React.Component {
  constructor(props) {
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
		return boardStatus.every(cell => cell.live === false)
	}

	countLivingNeighbours(neighbourList) {
		const { boardStatus } = this.state
		const live = neighbourList.map(num => {
			return boardStatus[num].live
		})

		return live.filter(live => live).length
	}

	updateLive(neighbourList, isLive) {
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
			clearInterval(this.start)
			return 
		}

		const { boardStatus } = this.state
		const nextBoardStatus = boardStatus.map(cell => {
			const live = this.updateLive(cell.neighbours, cell.live)
			return { ...cell, live }
		})

		this.setState({ boardStatus: nextBoardStatus});
	}

  async initBoardStatus() {
    //　ボード初期化
    const { boardStatus, spawnRate, boardSize } = this.state;
    const newStatus = boardStatus.map((cell, index) => {
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
		this.lifeCycle = setInterval(runLifeCycle, time)
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
          {boardStatus.map((cell, index) => (	
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

const generateStyle = (cellSize, live, boardSize, index) => {
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
