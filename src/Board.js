import React from "react";
import { createNeighbourIndex, isRight, isBottom } from "./utils/boardHelpers";

const createBoardStatus = size => new Array(size * size).fill(initCell());

const setCellNeighbours = (size, index) => ({ 
	neighbours: createNeighbourIndex(size, index) 
})

const setCellLive = spawnRate => {
  const rate = () => {
    if (spawnRate < 0) {
      return 0;
    }

    if (spawnRate > 100) {
      return 100;
    }

    return spawnRate;
  };

  return {
    live: rate() > Math.floor(Math.random() * 100)
  };
};

const setCellId = index => ({ 
	id: `id${(index || 0)}` 
});

const initCell = () => ({
  live: false,
});

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: props.time || 1000,
      cellSize: props.cellSize || 8,
      spawnRate: props.spawnRate || 25, // 0〜100
      boardSize: props.boardSize || 8,
      boardStatus: props.boardSize
        ? createBoardStatus(props.boardSize)
        : createBoardStatus(8)
		};
		
		this.hasFinished = this.hasFinished.bind(this)
		this.countLivingNeighbours = this.countLivingNeighbours.bind(this)
		this.updateLive = this.updateLive.bind(this)
		this.runLifeCycle = this.runLifeCycle.bind(this)
		this.initBoardStatus = this.initBoardStatus.bind(this)
		this.start = this.start.bind(this)
		this.reset = this.initBoardStatus.bind(this)
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
        ...setCellId(index),
				...setCellLive(spawnRate),
				...setCellNeighbours(boardSize, index)
      };
    });

    await this.setState({
      boardStatus: newStatus
		});
	}

  componentDidMount() {
		this.initBoardStatus();
	}

	componentWillUnmount() {
    clearInterval(this.lifeCycle);
  }
	
	start() {
		const { runLifeCycle } = this
		const { time } = this.state
		this.lifeCycle = setInterval(runLifeCycle, time)
	}

	reset() {
		clearInterval(this.lifeCycle);
		this.initBoardStatus()
	}

  render() {
    const { boardSize, boardStatus, cellSize } = this.state;
    return (
      <div>
        <h1>life gaming</h1>

        <div style={{ fontSize: 0 }}>
          {boardStatus.map((cell, index) => (
            <span key={cell.id}>
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
