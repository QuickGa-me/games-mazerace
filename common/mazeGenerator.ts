// tslint:disable:no-shadowed-variable

export type MazeGeneration = {maze_wall: number[][][]; maze_prev: [number, number][][]; maze_in: boolean[][]};

export function MazeGenerator(xSizeMaze: number, ySizeMaze: number): MazeGeneration {
  // creates a maze of dimensions xsize_Maze and ysize_maze.
  // notice that the usable area is xsize_maze-2 by ysize_maze-2 since there is a padding of 1 cell.
  // also, even columns are shorter by 1 cell.
  const noDeadEnds = false;
  const mazeIn: boolean[][] = [];
  const mazePrev: [number, number][][] = [];
  const mazeWall: number[][][] = [[], [], []]; // up, leftup, leftdown
  const padding = 1;
  const q = [
    [
      [-1, -1],
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
    ],
    [
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  ];

  for (let x = 0; x < xSizeMaze; x++) {
    mazeIn[x] = [];
    mazePrev[x] = [];
    mazeWall[0][x] = [];
    mazeWall[1][x] = [];
    mazeWall[2][x] = [];
    for (let y = 0, yy = ySizeMaze - (x % 2); y < yy; y++) {
      mazeIn[x][y] = x < padding || x >= xSizeMaze - padding || y < padding || y >= ySizeMaze - (x % 2) - padding;
      mazeWall[0][x][y] = 1;
      mazeWall[1][x][y] = 1;
      mazeWall[2][x][y] = 1;
    }
  }

  function dfs() {
    let xcur = Math.floor(Math.random() * (xSizeMaze - 4)) + 2;
    let ycur = Math.floor(Math.random() * (ySizeMaze - 5)) + 2;
    mazePrev[xcur][ycur] = [xcur, ycur];
    do {
      mazeIn[xcur][ycur] = true;
      let neighbours = [];
      for (let p = 0; p < 6; p++) {
        if (!mazeIn[xcur + q[xcur % 2][p][0]][ycur + q[xcur % 2][p][1]]) {
          neighbours.push(q[xcur % 2][p]);
        }
      }
      if (noDeadEnds && neighbours.length === 0) {
        // remove wall randomly for a dead end.
        const neighbors = [];
        for (let p = 0; p < 6; p++) {
          if (
            mazePrev[xcur + q[xcur % 2][p][0]][ycur + q[xcur % 2][p][1]] !== null &&
            mazePrev[xcur + q[xcur % 2][p][0]][ycur + q[xcur % 2][p][1]] !== undefined
          ) {
            neighbors.push(q[xcur % 2][p]);
          }
        }
        let success = false;
        while (!success) {
          const z = neighbors[Math.floor(Math.random() * neighbors.length)];
          if (z[0] === -1) {
            if (xcur % 2 === 0) {
              if (z[1] === -1) {
                success = mazeWall[1][xcur][ycur] === 1;
                mazeWall[1][xcur][ycur] = 0;
              } else {
                success = mazeWall[2][xcur][ycur] === 1;
                mazeWall[2][xcur][ycur] = 0;
              }
            } else {
              if (z[1] === 0) {
                success = mazeWall[1][xcur][ycur] === 1;
                mazeWall[1][xcur][ycur] = 0;
              } else {
                success = mazeWall[2][xcur][ycur] === 1;
                mazeWall[2][xcur][ycur] = 0;
              }
            }
          } else if (z[0] === 0) {
            if (z[1] === -1) {
              success = mazeWall[0][xcur][ycur] === 1;
              mazeWall[0][xcur][ycur] = 0;
            } else {
              success = mazeWall[0][xcur][ycur + 1] === 1;
              mazeWall[0][xcur][ycur + 1] = 0;
            }
          } else {
            if (xcur % 2 === 0) {
              if (z[1] === -1) {
                success = mazeWall[2][xcur + 1][ycur - 1] === 1;
                mazeWall[2][xcur + 1][ycur - 1] = 0;
              } else {
                success = mazeWall[1][xcur + 1][ycur] === 1;
                mazeWall[1][xcur + 1][ycur] = 0;
              }
            } else {
              if (z[1] === 0) {
                success = mazeWall[2][xcur + 1][ycur] === 1;
                mazeWall[2][xcur + 1][ycur] = 0;
              } else {
                success = mazeWall[1][xcur + 1][ycur + 1] === 1;
                mazeWall[1][xcur + 1][ycur + 1] = 0;
              }
            }
          }
        }
      }
      while (neighbours.length === 0) {
        if (mazePrev[xcur][ycur][0] === xcur && mazePrev[xcur][ycur][1] === ycur) {
          if (noDeadEnds) {
            // remove wall for the seed cell
            const neighbors = [];
            for (let p = 0; p < 6; p++) {
              if (
                mazePrev[xcur + q[xcur % 2][p][0]][ycur + q[xcur % 2][p][1]] !== null &&
                mazePrev[xcur + q[xcur % 2][p][0]][ycur + q[xcur % 2][p][1]] !== undefined
              ) {
                neighbors.push(q[xcur % 2][p]);
              }
            }
            let success = false;
            while (!success) {
              const z = neighbors[Math.floor(Math.random() * neighbors.length)];
              if (z[0] === -1) {
                if (xcur % 2 === 0) {
                  if (z[1] === -1) {
                    success = mazeWall[1][xcur][ycur] === 1;
                    mazeWall[1][xcur][ycur] = 0;
                  } else {
                    success = mazeWall[2][xcur][ycur] === 1;
                    mazeWall[2][xcur][ycur] = 0;
                  }
                } else {
                  if (z[1] === 0) {
                    success = mazeWall[1][xcur][ycur] === 1;
                    mazeWall[1][xcur][ycur] = 0;
                  } else {
                    success = mazeWall[2][xcur][ycur] === 1;
                    mazeWall[2][xcur][ycur] = 0;
                  }
                }
              } else if (z[0] === 0) {
                if (z[1] === -1) {
                  success = mazeWall[0][xcur][ycur] === 1;
                  mazeWall[0][xcur][ycur] = 0;
                } else {
                  success = mazeWall[0][xcur][ycur + 1] === 1;
                  mazeWall[0][xcur][ycur + 1] = 0;
                }
              } else {
                if (xcur % 2 === 0) {
                  if (z[1] === -1) {
                    success = mazeWall[2][xcur + 1][ycur - 1] === 1;
                    mazeWall[2][xcur + 1][ycur - 1] = 0;
                  } else {
                    success = mazeWall[1][xcur + 1][ycur] === 1;
                    mazeWall[1][xcur + 1][ycur] = 0;
                  }
                } else {
                  if (z[1] === 0) {
                    success = mazeWall[2][xcur + 1][ycur] === 1;
                    mazeWall[2][xcur + 1][ycur] = 0;
                  } else {
                    success = mazeWall[1][xcur + 1][ycur + 1] === 1;
                    mazeWall[1][xcur + 1][ycur + 1] = 0;
                  }
                }
              }
            }
          }
          return;
        }
        const _xcur = mazePrev[xcur][ycur][0];
        ycur = mazePrev[xcur][ycur][1];
        xcur = _xcur;
        neighbours = [];
        for (let p = 0; p < 6; p++) {
          if (!mazeIn[xcur + q[xcur % 2][p][0]][ycur + q[xcur % 2][p][1]]) {
            neighbours.push(q[xcur % 2][p]);
          }
        }
      }
      const z = neighbours[Math.floor(Math.random() * neighbours.length)];
      if (z[0] === -1) {
        if (xcur % 2 === 0) {
          if (z[1] === -1) {
            mazeWall[1][xcur][ycur] = 0;
          } else {
            mazeWall[2][xcur][ycur] = 0;
          }
        } else {
          if (z[1] === 0) {
            mazeWall[1][xcur][ycur] = 0;
          } else {
            mazeWall[2][xcur][ycur] = 0;
          }
        }
      } else if (z[0] === 0) {
        if (z[1] === -1) {
          mazeWall[0][xcur][ycur] = 0;
        } else {
          mazeWall[0][xcur][ycur + 1] = 0;
        }
      } else {
        if (xcur % 2 === 0) {
          if (z[1] === -1) {
            mazeWall[2][xcur + 1][ycur - 1] = 0;
          } else {
            mazeWall[1][xcur + 1][ycur] = 0;
          }
        } else {
          if (z[1] === 0) {
            mazeWall[2][xcur + 1][ycur] = 0;
          } else {
            mazeWall[1][xcur + 1][ycur + 1] = 0;
          }
        }
      }
      mazePrev[xcur + z[0]][ycur + z[1]] = [xcur, ycur];
      xcur += z[0];
      ycur += z[1];
    } while (!(mazePrev[xcur][ycur][0] === xcur && mazePrev[xcur][ycur][1] === ycur));
  }

  dfs();

  return {maze_in: mazeIn, maze_wall: mazeWall, maze_prev: mazePrev};
}
