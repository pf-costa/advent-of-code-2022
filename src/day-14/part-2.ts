import { getBoard, processBoard } from "./board";

(async () => {
  const { board, pouringPoint } = getBoard(true);
  let restedSand = await processBoard(board, pouringPoint);

  console.log(restedSand);
})();
