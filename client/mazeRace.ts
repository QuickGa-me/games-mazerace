// tslint:disable:prefer-for-of
// tslint:disable:no-shadowed-variable
// tslint:disable:one-variable-per-declaration

import {MazeGeneration, MazeGenerator} from '@common/mazeGenerator';
import {GEO} from './geo';
import * as VisibilityPolygon from 'visibility-polygon';
import {Position} from 'visibility-polygon';
import {MathUtils} from '@common/mathUtils';

type Player = {userId: string; position: {x: number; y: number}; moveToX?: number; moveToY?: number};

export class MazeClient {
  players: Player[];
  currentPlayerID?: string;
  get currentPlayer() {
    return this.players.find((p) => p.userId === this.currentPlayerID);
  }

  constructor(updateContent: () => void, clientTick: () => void) {
    this.players = [];
    this.currentPlayerID = undefined;

    /*
      var client = this.client = io.connect('198.211.107.235:80');


      client.on('Game.PlayerLeft', function (data) {

      });


      client.on('Game.PlayerWon', function (data1) {
          window.alert('Player ' + data1 + ' Won!');
          client = null;
      });*/
    const updates = {};
    /*    client.on('Game.UpdatePosition', function (data) {
          for (var i = 0; i < data.length; i++) {
              if (!updates[data[i].tick]) {
                  updates[data[i].tick] = [];
              }
              updates[data[i].tick].push(data[i]);
          }
      });*/

    /*let tickInterval =*/ setInterval(ticker, 1000 / 10);

    let tick = 0;
    /*    client.on('Game.UpdateTick', function (data) {
          console.log('ticked from', tick, 'to',data.tick, (new Date()).getTime());
          if(tick==data.tick)
              return;

          tick=data.tick;
          if(tickInterval!==undefined) {
              clearInterval(tickInterval);
          }
          serverTick();
          tickInterval=setInterval(ticker, 1000/10);
      });*/

    /*client.on('Game.Started', function(data){
          startGame(data);
          tickInterval=setInterval(ticker, 1000/10);
      });*/

    function ticker() {
      // console.log('tick', tick, new Date().getTime());
      tick++;
      clientTick();
      // serverTick();
    }

    /*
      function updatePlayers(update) {
          for (var j = 0; j < update.length; j++) {
              for (var i = 0; i < this.players.length; i++) {
                  if (this.players[i].userId == update[j].userId) {
                      this.players[i].moveToX = update[j].x;
                      this.players[i].moveToY = update[j].y;
                  }
              }
          }
      }
  */

    function serverTick() {
      /*
          for (var m in updates) {
              if (m < tick) {

                  updatePlayers(updates[m]);

                  delete updates[m];
              }

          }

          var _update = updates[tick];
          if (_update) {
              updatePlayers(_update);
              delete updates[tick];

              updateContent();
          }

  */
    }

    /*   client.on('Game.MazeData', function (mazeData) {
       ui. setupGame(players, currentPlayer, mazeData);
       });*/
    /*client.on('Game.PlayerInfo', function (data) {
          for (var $t1 = 0; $t1 < data.length; $t1++) {

              if (data[$t1].userId === this.currentPlayerID) {
                  this.currentPlayer = data[$t1];
              }
          }
          this.players = data;
      });
      client.on('Game.PlayerReflect', function (data) {
          this.currentPlayerID = data.userId;
      });
  */
  }
  updatePlayerPosition(x: number, y: number) {
    if (this.currentPlayer) {
      this.currentPlayer.moveToX = x;
      this.currentPlayer.moveToY = y;
      // client.emit('Game.UpdatePosition', {x: x, y: y });
    }
  }

  onUpdate?: (state: {x: number; y: number}) => void;
}

let changed: boolean,
  started = false;

function updateContent() {
  changed = true;
}

/* variables pertaining to maze */
const Maze: {
  solutionlength: number;
  sol: number[][];
  padding: number;
  ysize: number;
  in: number[][];
  prev: number[][][];
  walkable_polys: Position[][];
  xsize: number;
  obstacle_polys: Position[][];
  wall: number[][][];
  segments: Position[][];
} = {
  xsize: 2,
  ysize: 2,
  in: [[]],
  prev: [[]],
  wall: [[[]], [[]], [[]]], // up, leftup, leftdown
  sol: [[]],
  obstacle_polys: [],
  walkable_polys: [],
  segments: [],
  padding: 1,

  solutionlength: 0, // not the same as solution_polys.length since each cell in solution may have more than one polygon.
};

export class MazeGame {
  mazeClient: MazeClient;

  width: number = 0;
  height: number = 0;
  observerX: number = 0;
  observerY: number = 0;
  v!: Position[];

  mousex = 0;
  mousey = 0;

  setMouseX = 0;
  setMouseY = 0;

  constructor() {
    this.mazeClient = new MazeClient(updateContent, () => {
      this.gameTick();
    });

    const canvas = document.getElementById('playersCanvas') as HTMLCanvasElement;
    canvas.onmousemove = (evt) => {
      if (evt.offsetX) {
        this.setMouseX = evt.offsetX - this.window.x;
        this.setMouseY = evt.offsetY - this.window.y;
      }
      this.mousex = this.setMouseX / GEO.ss;
      this.mousey = this.setMouseY / GEO.ss;
      // console.log(mousex, mousey);
    };
  }

  gameTick() {
    // console.log('clientTick');
    if (
      this.setMouseX !== undefined &&
      this.setMouseY !== undefined &&
      (this.mousex !== this.setMouseX || this.mousey !== this.setMouseY)
    ) {
      this.mousex = this.setMouseX / GEO.ss;
      this.mousey = this.setMouseY / GEO.ss;
      if (this.canMove(this.mousex, this.mousey)) {
        this.mazeClient.updatePlayerPosition(this.mousex, this.mousey);
      }
      changed = true;
    }
  }
  resize() {
    const canvases = ['mazecanvas', 'visibilityCanvas', 'playersCanvas'];
    for (const c of canvases) {
      const canv = document.getElementById(c) as HTMLCanvasElement;
      canv.height = this.height = window.innerHeight;
      canv.width = this.width = window.innerWidth;
    }

    GEO.setSize(10);
    // GEO.setSize(Math.min(this.width / Maze.xsize / 8.5, this.height / Maze.ysize / (1 + (10 * Math.sqrt(3)) / 2)));
    this.polygonize();
    const canvas = document.getElementById('mazecanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    this.draw_maze(ctx);
    updateContent();
  }

  startGame(data: MazeGeneration) {
    Maze.xsize = data.maze_in.length;
    Maze.ysize = data.maze_in[0].length;
    GEO.setSize(10);
    // GEO.setSize(Math.min(this.width / Maze.xsize / 11, this.height / Maze.ysize / (1 + (10 * Math.sqrt(3)) / 2)));
    Maze.in = JSON.parse(JSON.stringify(data.maze_in));
    Maze.prev = JSON.parse(JSON.stringify(data.maze_prev));
    Maze.wall = JSON.parse(JSON.stringify(data.maze_wall));
    Maze.xsize = Maze.in.length;
    Maze.ysize = Maze.in[0].length;
    for (let x = 0; x < Maze.xsize; x++) {
      Maze.sol[x] = [];
      for (let y = 0; y < Maze.ysize; y++) {
        Maze.sol[x][y] = 0;
      }
    }

    this.resize();

    this.observerX = GEO.dx + GEO.sx + GEO.cx + GEO.ccx / 2;
    this.observerY = GEO.dy + GEO.sy + GEO.cy + (this.observerX % 2) * GEO.cy;

    this.observerX /= GEO.ss;
    this.observerY /= GEO.ss;

    for (let m = 0; m < this.mazeClient.players.length; m++) {
      if (this.mazeClient.players[m] !== this.mazeClient.currentPlayer) {
        this.mazeClient.players[m].position.x = this.observerX;
        this.mazeClient.players[m].position.y = this.observerY;
        this.mazeClient.players[m].moveToX = this.observerX;
        this.mazeClient.players[m].moveToY = this.observerY;
      }
    }
    this.computeVisibility();

    this.update();

    window.onresize = () => {
      this.resize();
    };
    started = true;

    const canvas = document.getElementById('mazecanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    this.draw_maze(ctx);
  }

  draw() {
    this.window.x = this.width / 2 - this.observerX * GEO.ss;
    this.window.y = this.height / 2 - this.observerY * GEO.ss;
    const visibilityCanvas = document.getElementById('visibilityCanvas') as HTMLCanvasElement;
    if (!visibilityCanvas) return;
    const visibilityCtx = visibilityCanvas.getContext('2d')!;
    this.draw_visibility(visibilityCtx);
    const playersCanvas = document.getElementById('playersCanvas') as HTMLCanvasElement;
    const playersCtx = playersCanvas.getContext('2d')!;
    this.drawPlayers(playersCtx);

    const canvas = document.getElementById('mazecanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    this.draw_maze(ctx);
  }

  window = {x: 0, y: 0};

  draw_maze(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, this.width, this.height);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.translate(this.window.x, this.window.y);

    if (!Maze.xsize) return;

    /* illuminate corridor */
    for (let i = 0, j = Maze.walkable_polys.length; i < j; i++) {
      const qqq = Maze.walkable_polys[i];
      ctx.beginPath();
      ctx.moveTo(qqq[0][0], qqq[0][1]);
      for (let k = 1, l = qqq.length; k < l; k++) {
        ctx.lineTo(qqq[k][0], qqq[k][1]);
      }
      ctx.fillStyle = '#444';
      ctx.fill();
    }

    /* display wall */
    // for(var i=1, j=Maze.segments.length; i<j; i++) {
    //   var qqq = Maze.segments[i];
    //   ctx.beginPath();
    //   ctx.moveTo(qqq[0][0], qqq[0][1]);
    //   for(var k=1, l=qqq.length; k<l; k++) {
    //     ctx.lineTo(qqq[k][0], qqq[k][1]);
    //   }
    //   ctx.strokeStyle = '#0ff';
    //   ctx.stroke();
    // }
    ctx.restore();
  }

  draw_visibility(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.translate(this.window.x, this.window.y);
    ctx.beginPath();
    ctx.moveTo(this.v[0][0], this.v[0][1]);
    for (let i = 1, j = this.v.length; i < j; i++) {
      ctx.lineTo(this.v[i][0], this.v[i][1]);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fill();
    ctx.restore();
  }

  drawPlayers(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.translate(this.window.x, this.window.y);
    for (let m = 0; m < this.mazeClient.players.length; m++) {
      if (this.mazeClient.players[m] !== this.mazeClient.currentPlayer) {
        const p = this.mazeClient.players[m];
        if (p.moveToX && p.moveToY) {
          if (Math.abs(p.moveToX - p.position.x) > 0.1 || Math.abs(p.moveToY - p.position.y) > 0.1) {
            const updatedPos = moveTowardsPoint(p.moveToX, p.moveToY, p.position.x, p.position.y, 0.1);
            if (Math.abs(updatedPos.curX - p.position.x) < 0.1) {
              p.position.x = p.moveToX;
            } else {
              p.position.x = updatedPos.curX;
            }
            if (Math.abs(updatedPos.curY - p.position.y) < 0.1) {
              p.position.y = p.moveToY;
            } else {
              p.position.y = updatedPos.curY;
            }
          }
        }
        ctx.save();

        ctx.beginPath();
        ctx.arc(
          this.mazeClient.players[m].position.x * GEO.ss,
          this.mazeClient.players[m].position.y * GEO.ss,
          5,
          0,
          Math.PI * 2,
          true
        );
        ctx.fillStyle = '#f30';
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(this.observerX * GEO.ss, this.observerY * GEO.ss, 5, 0, Math.PI * 2, true);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.restore();
    ctx.restore();
  }

  get windowRange() {
    return 0;
    // return {x:-Maze.xsize*GEO.ss}
  }

  polygonize() {
    // generates obstacle and walkable polygons for rendering

    // initialize first element of obstacles to  bounding rectangle as required by visibility_polygon.js

    Maze.obstacle_polys = [
      [
        [-GEO.dx, -GEO.dy],
        [10000000 + GEO.dx, -GEO.dy],
        [10000000 + GEO.dx, 10000000 + GEO.dy],
        [-GEO.dx, 10000000 + GEO.dy],
      ],
    ];
    Maze.walkable_polys = [];
    for (let x = 0; x < Maze.xsize; x++) {
      for (let y = 0, yy = Maze.ysize - (x % 2); y < yy; y++) {
        for (let w = 0; w < 3; w++) {
          if (Maze.wall[w][x][y] === 1) {
            Maze.obstacle_polys.push(this.plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.wall[w]));
          } else {
            Maze.walkable_polys.push(this.plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.fatwall[w]));
          }
        }
        Maze.obstacle_polys.push(this.plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.corner1));
        Maze.obstacle_polys.push(this.plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.corner2));
        if (
          !Maze.in[x][y] ||
          x < Maze.padding ||
          x >= Maze.xsize - Maze.padding ||
          y < Maze.padding ||
          y >= Maze.ysize - (x % 2) - Maze.padding
        ) {
          Maze.obstacle_polys.push(this.plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.hexagon));
        } else {
          Maze.walkable_polys.push(this.plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.hexagon));
        }
      }
    }

    const segments = VisibilityPolygon.convertToSegments(Maze.obstacle_polys);
    const _segments: {[key: string]: {[key: string]: {count: number; seg: Position[]}}} = {};
    // remove duplicate segments to speed up VisibilityPolygon.
    Maze.segments = [];
    for (let i = 0, ii = segments.length; i < ii; i++) {
      let keyx = segments[i][0][0] + segments[i][1][0],
        keyy = segments[i][0][1] + segments[i][1][1];
      keyx = Math.round(keyx / GEO.ss);
      keyy = Math.round(keyy / GEO.ss);
      if (_segments[keyx] === undefined) {
        _segments[keyx] = {};
      }
      if (_segments[keyx][keyy] === undefined) {
        _segments[keyx][keyy] = {count: 0, seg: segments[i]};
      }
      _segments[keyx][keyy].count++;
    }
    for (const i in _segments) {
      for (const j in _segments[i]) {
        if (_segments[i][j].count === 1) {
          Maze.segments.push(_segments[i][j].seg);
        }
      }
    }
  }

  plus(x: number, y: number, p: number[][]): Position[] {
    const qqq: Position[] = [];
    for (let i = 0, j = p.length; i < j; i++) {
      qqq[i] = [p[i][0] + x, p[i][1] + y] as Position;
    }
    return qqq;
  }

  computeVisibility() {
    this.v = VisibilityPolygon.compute([this.observerX * GEO.ss, this.observerY * GEO.ss], Maze.segments);
  }

  canMove(x: number, y: number) {
    return VisibilityPolygon.inPolygon([x * GEO.ss, y * GEO.ss], this.v);
  }

  chaseMouse() {
    const x = this.observerX;
    const y = this.observerY;

    const distance = MathUtils.distance(x, y, this.mousex, this.mousey) * 5;
    const directionX = (this.mousex - x) / distance;
    const directionY = (this.mousey - y) / distance;

    const newX = x + directionX;
    const newY = y + directionY;

    if (this.canMove(newX, newY)) {
      this.observerX = newX;
      this.observerY = newY;
      this.mazeClient.onUpdate?.({x: this.observerX, y: this.observerY});

      changed = true;
    }
  }

  update() {
    this.chaseMouse();
    if (changed && started) {
      this.computeVisibility();
      this.draw();
      changed = false;
    }
    requestAnimationFrame(() => {
      this.update();
    });
  }

  //  checkKey(e) {
  //     e = e || window.event;
  //     var x = observer_x;
  //     var y = observer_y;
  //     if (e.keyCode == '38') {
  //         y -= GEO.ss;
  //     } else if (e.keyCode == '40') {
  //         y += GEO.ss;
  //     } else if (e.keyCode == '39') {
  //         x += GEO.ss;
  //     } else if (e.keyCode == '37') {
  //         x -= GEO.ss;
  //     }
  //     if (x < 0 || x > width || y < 0 || y > height) return;
  //     if (!canMove(x/GEO.ss, y/GEO.ss)) return;
  //     observer_x = x;
  //     observer_y = y;
  //     changed = true;
  // };
}
function polygonDistance(a: Position, b: Position): number {
  return (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]);
}

function moveTowardsPoint(curX: number, curY: number, toX: number, toY: number, speed: number) {
  const dx = curX - toX;
  const dy = curY - toY;
  const angle = Math.atan2(dy, dx);
  const xVelocity = speed * Math.cos(angle);
  const yVelocity = speed * Math.sin(angle);
  return {
    curX: curX + xVelocity,
    curY: curY + yVelocity,
  };
}
