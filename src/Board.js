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
	id: index || 0 
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

	runLifeCycles() {
		if (this.hasFinished) { 
			clearInterval(this.repeater)
			return 
		}

		console.log(this)

		const { boardStatus } = this.state
		boardStatus.map(cell => {
			return { ...cell, live: this.updateLive(cell.neighbours, cell.live) }
		})
	}

	repeater() {
		setInterval(() => { this.runLifeCycles(); console.log()} , 1000)
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

  async componentDidMount() {
		await this.initBoardStatus();
		this.repeater()
	}

  render() {
    const { boardSize, boardStatus, cellSize } = this.state;
    return (
      <div>
        <h1>life gaming</h1>

        <div style={{ fontSize: 0 }}>
          {boardStatus.map((cell, index) => (
            <span key={cell.id}>
							<span
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
