import { getBoard, processBoard } from "./board";

(async () => {
  const { board, pouringPoint } = getBoard();
  let restedSand = await processBoard(board, pouringPoint, true);

  console.log(restedSand);
})();
