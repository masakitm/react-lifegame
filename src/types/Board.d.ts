type Cell = {
  id: string,
  live: boolean,
  neighbours: number[],
}

type BoardViewProps = {
  boardSize: number,
  cellSize: number,
  boardStatus: Cell[],
  start: () => void,
}
