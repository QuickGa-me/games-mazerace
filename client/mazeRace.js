import {MazeGenerator} from './mazeGenerator';

function MazeClient(updateContent, clientTick) {
  var self = this;
  self.players = [];
  self.currentPlayerID = null;
  self.currentPlayer = null;
  self.players.push({
    userID: '1',
    position: {x: 30, y: 30},
  });
  self.players.push({
    userID: '2',
    position: {x: 30, y: 30},
  });
  self.players.push({
    userID: '3',
    position: {x: 30, y: 30},
  });
  self.currentPlayer = self.players[1];
  self.currentPlayerID = self.players[1].userID;

  /*
    var client = this.client = io.connect('198.211.107.235:80');


    client.on('Game.PlayerLeft', function (data) {

    });


    client.on('Game.PlayerWon', function (data1) {
        window.alert('Player ' + data1 + ' Won!');
        client = null;
    });*/
  var updates = {};
  /*    client.on('Game.UpdatePosition', function (data) {
        for (var i = 0; i < data.length; i++) {
            if (!updates[data[i].tick]) {
                updates[data[i].tick] = [];
            }
            updates[data[i].tick].push(data[i]);
        }
    });*/
  setTimeout(() => {
    var maze = new MazeGenerator(30, 30);
    startGame(maze);
  }, 10);

  tickInterval = setInterval(ticker, 1000 / 10);

  var tick = 0;
  var tickInterval;
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
    console.log('tick', tick, new Date().getTime());
    tick++;
    clientTick();
    // serverTick();
  }

  /*
    function updatePlayers(update) {
        for (var j = 0; j < update.length; j++) {
            for (var i = 0; i < self.players.length; i++) {
                if (self.players[i].userID == update[j].userID) {
                    self.players[i].moveToX = update[j].x;
                    self.players[i].moveToY = update[j].y;
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

            if (data[$t1].userID === self.currentPlayerID) {
                self.currentPlayer = data[$t1];
            }
        }
        self.players = data;
    });
    client.on('Game.PlayerReflect', function (data) {
        self.currentPlayerID = data.userID;
    });
*/ this.updatePlayerPosition = function (
    x,
    y
  ) {
    self.currentPlayer.moveToX = x;
    self.currentPlayer.moveToY = y;
    // client.emit('Game.UpdatePosition', {x: x, y: y });
  };
}

var changed,
  v,
  started = false;

function updateContent() {
  changed = true;
}

/* GEO
                                  ^ sy   ^  ^
                <------ dx ------>V      |  |
                         /--------\      |  |
                        /          \     |  |
                       /            \   cy  | 
                      /              \   |  |
                     /                \  |  dy
                    /                  \ |  |
                <sx><-cx-><- ccx-><-cx-> V  |
                ^   \                  /    |
                     \                /     |
                      \              /      |
                       \            /       |
                        \----------/        V
*/

function GEO() {}
GEO.setSize = function (ss) {
  GEO.ss = ss; // overall size multiplier
  GEO.sx = GEO.ss; // horizontal spacing between hexagons
  GEO.sy = GEO.sx; // vertical spacing between hexagons
  GEO.cx = 2.5 * GEO.ss; // more cx... <[ ]>; less cx... [ ]
  GEO.ccx = 5 * GEO.ss; // more ccx... <[  ]>; less ccx... <[]>
  GEO.cy = ((5 * Math.sqrt(3)) / 2) * GEO.ss; // height of hexagon
  GEO.f = 2; // f is for fat. Used to generate fatwall, which fixes rendering issues with polygons sharing an edge

  GEO.dx = GEO.sx + GEO.cx + GEO.ccx; // total width of maze cell including space
  GEO.dy = GEO.sy + 2 * GEO.cy; // total height of maze cell including space

  /* polygon definitions */
  GEO.corner1 = [
    // top left corner of of hexagon
    [GEO.cx, GEO.sy / 2],
    [GEO.cx + GEO.sx, 0],
    [GEO.cx + GEO.sx, GEO.sy],
  ];
  GEO.corner2 = [
    // top right corner of hexagon
    [GEO.dx, 0],
    [GEO.dx + GEO.sx, GEO.sy / 2],
    [GEO.dx, GEO.sy],
  ];
  /* top, top left, and bottom left walls respectively*/
  GEO.wall = [
    [
      [GEO.cx + GEO.sx, 0],
      [GEO.dx, 0],
      [GEO.dx, GEO.sy],
      [GEO.cx + GEO.sx, GEO.sy],
    ],
    [
      [0, GEO.cy + GEO.sy / 2],
      [GEO.cx, GEO.sy / 2],
      [GEO.cx + GEO.sx, GEO.sy],
      [GEO.sx, GEO.cy + GEO.sy],
    ],
    [
      [0, GEO.cy + (3 * GEO.sy) / 2],
      [GEO.sx, GEO.cy + GEO.sy],
      [GEO.cx + GEO.sx, GEO.dy],
      [GEO.cx, GEO.dy + GEO.sy / 2],
    ],
  ];
  /* thicker walls */
  GEO.fatwall = [
    [
      [GEO.cx + GEO.sx, -GEO.f],
      [GEO.dx, -GEO.f],
      [GEO.dx, GEO.sy + GEO.f],
      [GEO.cx + GEO.sx, GEO.sy + GEO.f],
    ],
    [
      [-GEO.f, GEO.cy + GEO.sy / 2 - (GEO.f * GEO.sy) / GEO.sx / 2],
      [GEO.cx - GEO.f, GEO.sy / 2 - (GEO.f * GEO.sy) / GEO.sx / 2],
      [GEO.cx + GEO.sx + GEO.f, GEO.sy + (GEO.f * GEO.sy) / GEO.sx / 2],
      [GEO.sx + GEO.f, GEO.cy + GEO.sy + (GEO.f * GEO.sy) / GEO.sx / 2],
    ],
    [
      [-GEO.f, GEO.cy + (3 * GEO.sy) / 2 + (GEO.f * GEO.sy) / GEO.sx / 2],
      [GEO.sx + GEO.f, GEO.cy + GEO.sy - (GEO.f * GEO.sy) / GEO.sx / 2],
      [GEO.cx + GEO.sx + GEO.f, GEO.dy - (GEO.f * GEO.sy) / GEO.sx / 2],
      [GEO.cx - GEO.f, GEO.dy + GEO.sy / 2 + (GEO.f * GEO.sy) / GEO.sx / 2],
    ],
  ];
  /* actual hexagon */
  GEO.hexagon = [
    [GEO.cx + GEO.sx, GEO.sy],
    [GEO.dx, GEO.sy],
    [GEO.dx + GEO.cx, GEO.cy + GEO.sy],
    [GEO.dx, GEO.dy],
    [GEO.cx + GEO.sx, GEO.dy],
    [GEO.sx, GEO.cy + GEO.sy],
  ];
};

/* variables pertaining to maze */
const Maze = {
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

  solution_polys: [],
  solutionlength: 0, // not the same as solution_polys.length since each cell in solution may have more than one polygon.
};

var width, height;
var observer_x, observer_y;

var mousex = 0,
  mousey = 0;
var requestAnimFrame =
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function (callback, element) {
    setTimeout(callback, 1000 / 60);
  };

window.onload = function () {
  setTimeout(() => {
    init();
  }, 1000);
  //document.onkeydown = checkKey;
};

var setMouseX, setMouseY;
function init() {
  window.mazeClient = new MazeClient(updateContent, gameTick);

  var canvas = document.getElementById('playersCanvas');
  canvas.onmousemove = function (evt) {
    if (evt.offsetX) {
      setMouseX = evt.offsetX;
      setMouseY = evt.offsetY;
    } else if (evt.layerX) {
      setMouseX = evt.layerX;
      setMouseY = evt.layerY;
    }
    mousex = setMouseX / GEO.ss;
    mousey = setMouseY / GEO.ss;
    //console.log(mousex, mousey);
  };
}

function gameTick() {
  //console.log('clientTick');
  if (setMouseX !== undefined && setMouseY !== undefined && (mousex !== setMouseX || mousey !== setMouseY)) {
    mousex = setMouseX / GEO.ss;
    mousey = setMouseY / GEO.ss;
    if (canMove(mousex, mousey)) {
      mazeClient.updatePlayerPosition(mousex, mousey);
    }
    changed = true;
  }
}

function resize() {
  var canvases = ['mazecanvas', 'visibilityCanvas', 'playersCanvas', 'solutionCanvas'];
  for (var i = 0; i < canvases.length; i++) {
    var canvas = document.getElementById(canvases[i]);
    canvas.height = height = window.innerHeight;
    canvas.width = width = window.innerWidth;

    var context = canvas.getContext('2d');

    /* for Retina display support */
    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio =
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    var ratio = devicePixelRatio / backingStoreRatio;

    // upscale the canvas if the two ratios don't match
    if (devicePixelRatio !== backingStoreRatio) {
      var oldWidth = canvas.width;
      var oldHeight = canvas.height;

      canvas.width = oldWidth * ratio;
      canvas.height = oldHeight * ratio;

      canvas.style.width = oldWidth + 'px';
      canvas.style.height = oldHeight + 'px';

      context.scale(ratio, ratio);
    }
  }

  GEO.setSize(Math.min(width / Maze.xsize / 8.5, height / Maze.ysize / (1 + (10 * Math.sqrt(3)) / 2)));
  polygonize();
  var canvas = document.getElementById('mazecanvas');
  var ctx = canvas.getContext('2d');
  draw_maze(ctx);
  updateContent();
}

function startGame(data) {
  if (data !== undefined) {
    Maze.xsize = data.maze_in.length;
    Maze.ysize = data.maze_in[0].length;
    GEO.setSize(Math.min(width / Maze.xsize / 11, height / Maze.ysize / (1 + (10 * Math.sqrt(3)) / 2)));
    Maze.in = clone(data.maze_in);
    Maze.prev = clone(data.maze_prev);
    Maze.wall = clone(data.maze_wall);
    Maze.xsize = Maze.in.length;
    Maze.ysize = Maze.in[0].length;
    for (var x = 0; x < Maze.xsize; x++) {
      Maze.sol[x] = [];
      for (var y = 0; y < Maze.ysize; y++) {
        Maze.sol[x][y] = 0;
      }
    }

    resize();

    observer_x = GEO.dx + GEO.sx + GEO.cx + GEO.ccx / 2;
    observer_y = GEO.dy + GEO.sy + GEO.cy + (observer_x % 2) * GEO.cy;

    observer_x /= GEO.ss;
    observer_y /= GEO.ss;

    for (var m = 0; m < mazeClient.players.length; m++) {
      if (mazeClient.players[m] != mazeClient.currentPlayer) {
        mazeClient.players[m].x = observer_x;
        mazeClient.players[m].y = observer_y;
        mazeClient.players[m].moveToX = observer_x;
        mazeClient.players[m].moveToY = observer_y;
      }
    }

    update();

    window.onresize = resize;
    started = true;

    var canvas = document.getElementById('mazecanvas');
    var ctx = canvas.getContext('2d');
    draw_maze(ctx);
  }
  console.log(Maze);
}

function polygonize() {
  // generates obstacle and walkable polygons for rendering

  // initialize first element of obstacles to bounding rectangle as required by visibility_polygon.js
  Maze.obstacle_polys = [
    [
      [-GEO.dx, -GEO.dy],
      [width + GEO.dx, -GEO.dy],
      [width + GEO.dx, height + GEO.dy],
      [-GEO.dx, height + GEO.dy],
    ],
  ];
  Maze.walkable_polys = [];
  for (var x = 0; x < Maze.xsize; x++) {
    for (var y = 0, yy = Maze.ysize - (x % 2); y < yy; y++) {
      for (var w = 0; w < 3; w++) {
        if (Maze.wall[w][x][y] === 1) {
          Maze.obstacle_polys.push(plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.wall[w]));
        } else {
          Maze.walkable_polys.push(plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.fatwall[w]));
        }
      }
      Maze.obstacle_polys.push(plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.corner1));
      Maze.obstacle_polys.push(plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.corner2));
      if (
        !Maze.in[x][y] ||
        x < Maze.padding ||
        x >= Maze.xsize - Maze.padding ||
        y < Maze.padding ||
        y >= Maze.ysize - (x % 2) - Maze.padding
      ) {
        Maze.obstacle_polys.push(plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.hexagon));
      } else {
        Maze.walkable_polys.push(plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.hexagon));
      }
    }
  }

  var segments = VisibilityPolygon.convertToSegments(Maze.obstacle_polys),
    _segments = {};
  // remove duplicate segments to speed up VisibilityPolygon.
  Maze.segments = [];
  for (var i = 0, ii = segments.length; i < ii; i++) {
    var keyx = segments[i][0][0] + segments[i][1][0],
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
  for (var i in _segments) {
    for (var j in _segments[i]) {
      if (_segments[i][j].count === 1) {
        Maze.segments.push(_segments[i][j].seg);
      }
    }
  }
}

function pixels2mazecell_int(a) {
  // converts real pixel coordinates to maze cell coordinates
  // note: this is a retarded implementation that runs in O(xsize*ysize) time instead of O(1);
  var dist = 999999999999;
  var minx, miny;
  for (var x = 0; x < Maze.xsize; x++) {
    for (var y = 0, yy = Maze.ysize - (x % 2); y < yy; y++) {
      var tempx = x * GEO.dx + GEO.cx + GEO.ccx / 2 + GEO.sx;
      var tempy = y * GEO.dy + GEO.cy + GEO.sy + (x % 2) * (GEO.dy / 2);
      if (VisibilityPolygon.distance([tempx, tempy], a) < dist) {
        dist = VisibilityPolygon.distance([tempx, tempy], a);
        minx = x;
        miny = y;
      }
    }
  }
  return [minx, miny];
}

function plus(x, y, p) {
  var qqq = [];
  for (var i = 0, j = p.length; i < j; i++) {
    qqq[i] = [p[i][0] + x, p[i][1] + y];
  }
  return qqq;
}

function solve(x1, y1, x2, y2) {
  Maze.solution_polys = [];
  //console.log(started, Maze.sol, x1, y1, x2, y2);
  if (!Maze.xsize) return;
  if (!Maze.in[x1][y1] || Maze.prev[x1][y1] === null || Maze.prev[x1][y1] === undefined) return;
  if (!Maze.in[x2][y2] || Maze.prev[x2][y2] === null || Maze.prev[x2][y2] === undefined) return;
  if (
    x1 < Maze.padding ||
    x1 >= Maze.xsize - Maze.padding ||
    y1 < Maze.padding ||
    y1 >= Maze.ysize - (x1 % 2) - Maze.padding
  )
    return;
  if (
    x2 < Maze.padding ||
    x2 >= Maze.xsize - Maze.padding ||
    y2 < Maze.padding ||
    y2 >= Maze.ysize - (x2 % 2) - Maze.padding
  )
    return;
  var solutions = [],
    sola = [],
    solb = [];
  for (var x = 0; x < Maze.xsize; x++) {
    for (var y = 0, yy = Maze.ysize - (x % 2); y < yy; y++) {
      Maze.sol[x][y] = 0;
    }
  }
  var overlap = false;
  do {
    sola.unshift([x1, y1]);
    Maze.sol[x1][y1] ^= 1;
    var temp = Maze.prev[x1][y1][0];
    y1 = Maze.prev[x1][y1][1];
    x1 = temp;
  } while (Maze.prev[x1][y1][0] !== x1 || Maze.prev[x1][y1][1] !== y1);
  do {
    if (!overlap && Maze.sol[x2][y2]) {
      overlap = true;
      Maze.sol[x2][y2] = true;
    } else {
      Maze.sol[x2][y2] ^= 1;
    }
    if (Maze.sol[x2][y2]) {
      solb.push([x2, y2]);
    }
    var temp = Maze.prev[x2][y2][0];
    y2 = Maze.prev[x2][y2][1];
    x2 = temp;
  } while (Maze.prev[x2][y2][0] !== x2 || Maze.prev[x2][y2][1] !== y2);
  solutions = solutions.concat(solb, sola);
  for (var i = 0, j = solutions.length; i < j; i++) {
    if (!Maze.sol[solutions[i][0]][solutions[i][1]]) {
      solutions.splice(i, 1);
      i--;
      j--;
    }
  }
  solvepolygonize(solutions);
  Maze.solutionlength = solutions.length;
}

function solvepolygonize(solutions) {
  for (var a = 0, b = solutions.length; a < b; a++) {
    var x = solutions[a][0],
      y = solutions[a][1];
    if (Maze.sol[x][y]) {
      Maze.solution_polys.push({polygon: plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.hexagon), n: a});
      if (!Maze.wall[1][x][y]) {
        if (x % 2 === 1 && Maze.sol[x - 1][y]) {
          Maze.solution_polys.push({
            polygon: plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.fatwall[1]),
            n: a,
          });
        } else if (x % 2 === 0 && Maze.sol[x - 1][y - 1]) {
          Maze.solution_polys.push({
            polygon: plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.fatwall[1]),
            n: a,
          });
        }
      }
      if (!Maze.wall[2][x][y]) {
        if (x % 2 === 1 && Maze.sol[x - 1][y + 1]) {
          Maze.solution_polys.push({
            polygon: plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.fatwall[2]),
            n: a,
          });
        } else if (x % 2 === 0 && Maze.sol[x - 1][y]) {
          Maze.solution_polys.push({
            polygon: plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.fatwall[2]),
            n: a,
          });
        }
      }
      if (!Maze.wall[0][x][y] && Maze.sol[x][y - 1]) {
        Maze.solution_polys.push({
          polygon: plus(x * GEO.dx, y * GEO.dy + ((x % 2) * GEO.dy) / 2, GEO.fatwall[0]),
          n: a,
        });
      }
    }
  }
}

function computeVisibility() {
  v = VisibilityPolygon.compute([observer_x * GEO.ss, observer_y * GEO.ss], Maze.segments);
}

function canMove(x, y) {
  if (x === undefined || y === undefined) return false;
  if (v === undefined) computeVisibility();
  return VisibilityPolygon.inPolygon([x * GEO.ss, y * GEO.ss], v);
}

function chasemouse() {
  if (canMove(mousex, mousey)) {
    var d = VisibilityPolygon.distance([mousex * GEO.ss, mousey * GEO.ss], [observer_x * GEO.ss, observer_y * GEO.ss]);
    d = Math.sqrt(d);
    if (d <= GEO.ss) return;
    var x = observer_x * GEO.ss + ((mousex * GEO.ss - observer_x * GEO.ss) / d) * Math.sqrt(d);
    var y = observer_y * GEO.ss + ((mousey * GEO.ss - observer_y * GEO.ss) / d) * Math.sqrt(d);
    if (x < 0 || x > width || y < 0 || y > height) return;
    if (!canMove(x / GEO.ss, y / GEO.ss)) return;
    observer_x = x / GEO.ss;
    observer_y = y / GEO.ss;

    changed = true;
  }
}

function chaseOtherPlayers() {
  for (var i = 0; i < mazeClient.players.length; i++) {
    if (mazeClient.players[i] == mazeClient.currentPlayer) continue;
    var player = mazeClient.players[i];

    var d = VisibilityPolygon.distance(
      [player.moveToX * GEO.ss, player.moveToY * GEO.ss],
      [player.x * GEO.ss, player.y * GEO.ss]
    );
    d = Math.sqrt(d);
    if (d <= GEO.ss) continue;
    var x = player.x * GEO.ss + ((player.moveToX * GEO.ss - player.x * GEO.ss) / d) * Math.sqrt(d);
    var y = player.y * GEO.ss + ((player.moveToY * GEO.ss - player.y * GEO.ss) / d) * Math.sqrt(d);
    if (x < 0 || x > width || y < 0 || y > height) return;

    player.x = x / GEO.ss;
    player.y = y / GEO.ss;

    changed = true;
  }
}

function update() {
  if (mousex === undefined || mousey === undefined) {
    //bah fix
    requestAnimFrame(update);
    return;
  }

  chasemouse();
  chaseOtherPlayers();
  if (changed && started) {
    computeVisibility();
    var a1 = pixels2mazecell_int([mousex * GEO.ss, mousey * GEO.ss]),
      a2 = pixels2mazecell_int([observer_x * GEO.ss, observer_y * GEO.ss]);
    solve(a1[0], a1[1], a2[0], a2[1]);
    draw();
    changed = false;
  }
  requestAnimFrame(update);
}

// function checkKey(e) {
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

function draw() {
  var visibilityCanvas = document.getElementById('visibilityCanvas');
  var visibilityCtx = visibilityCanvas.getContext('2d');
  draw_visibility(visibilityCtx);
  var solutionCanvas = document.getElementById('solutionCanvas');
  var solutionCtx = solutionCanvas.getContext('2d');
  draw_solution(solutionCtx);
  var playersCanvas = document.getElementById('playersCanvas');
  var playersCtx = playersCanvas.getContext('2d');
  draw_players(playersCtx);
}

function draw_maze(ctx) {
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = '#333';
  ctx.fill();

  if (!Maze.xsize) return;

  /* illuminate corridor */
  for (var i = 0, j = Maze.walkable_polys.length; i < j; i++) {
    var qqq = Maze.walkable_polys[i];
    ctx.beginPath();
    ctx.moveTo(qqq[0][0], qqq[0][1]);
    for (var k = 1, l = qqq.length; k < l; k++) {
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
}

function draw_visibility(ctx) {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.moveTo(v[0][0], v[0][1]);
  for (var i = 1, j = v.length; i < j; i++) {
    ctx.lineTo(v[i][0], v[i][1]);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fill();
}

function draw_solution(ctx) {
  ctx.clearRect(0, 0, width, height);
  for (var i = 0, j = Maze.solution_polys.length; i < j; i++) {
    var qqq = Maze.solution_polys[i].polygon;
    ctx.beginPath();
    ctx.moveTo(qqq[0][0], qqq[0][1]);
    for (var k = 1, l = qqq.length; k < l; k++) {
      ctx.lineTo(qqq[k][0], qqq[k][1]);
    }
    var red = Math.sqrt(Maze.solution_polys[i].n / Maze.solutionlength);
    var green = Math.sqrt(1 - Maze.solution_polys[i].n / Maze.solutionlength);
    ctx.fillStyle = 'rgb(' + Math.floor(red * 100) + ',' + Math.floor(green * 100) + ',0)';
    ctx.fill();
  }
}

function draw_players(ctx) {
  ctx.clearRect(0, 0, width, height);
  if (canMove(mousex, mousey)) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(setMouseX, setMouseY);
    ctx.lineTo(observer_x * GEO.ss, observer_y * GEO.ss);
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    ctx.restore();
  }

  for (var m = 0; m < mazeClient.players.length; m++) {
    if (mazeClient.players[m] != mazeClient.currentPlayer) {
      ctx.save();

      ctx.beginPath();
      ctx.arc(mazeClient.players[m].x * GEO.ss, mazeClient.players[m].y * GEO.ss, 5, 0, Math.PI * 2, true);
      ctx.fillStyle = '#f30';
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(observer_x * GEO.ss, observer_y * GEO.ss, 5, 0, Math.PI * 2, true);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.restore();
}

// stole this function from http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
function clone(obj) {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || 'object' != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    var copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

function VisibilityPolygon() {}
VisibilityPolygon.compute = function (d, c) {
  for (var e = [], f = VisibilityPolygon.sortPoints(d, c), h = Array(c.length), g = 0; g < h.length; ++g) h[g] = -1;
  for (var k = [], l = [d[0] + 1, d[1]], g = 0; g < c.length; ++g) {
    var m = VisibilityPolygon.angle(c[g][0], d),
      n = VisibilityPolygon.angle(c[g][1], d),
      p = !1;
    -180 < m && 0 >= m && 180 >= n && 0 <= n && 180 < n - m && (p = !0);
    -180 < n && 0 >= n && 180 >= m && 0 <= m && 180 < m - n && (p = !0);
    p && VisibilityPolygon.insert(g, k, d, c, l, h);
  }
  for (g = 0; g < f.length; ) {
    var n = (m = !1),
      p = g,
      l = c[f[g][0]][f[g][1]],
      q = k[0];
    do
      if (
        (-1 != h[f[g][0]]
          ? (f[g][0] == q && ((m = !0), (l = c[f[g][0]][f[g][1]])), VisibilityPolygon.remove(h[f[g][0]], k, d, c, l, h))
          : (VisibilityPolygon.insert(f[g][0], k, d, c, l, h), k[0] != q && (n = !0)),
        ++g,
        g == f.length)
      )
        break;
    while (f[g][2] < f[p][2] + VisibilityPolygon.epsilon());
    m
      ? (e.push(l),
        (m = VisibilityPolygon.intersectLines(c[k[0]][0], c[k[0]][1], d, l)),
        VisibilityPolygon.equal(m, l) || e.push(m))
      : n &&
        (e.push(VisibilityPolygon.intersectLines(c[q][0], c[q][1], d, l)),
        e.push(VisibilityPolygon.intersectLines(c[k[0]][0], c[k[0]][1], d, l)));
  }
  return e;
};
VisibilityPolygon.inPolygon = function (d, c) {
  for (var e = 0, f = 0; f < c.length; ++f) (e = Math.min(c[f][0], e)), (e = Math.min(c[f][1], e));
  for (var e = [e - 1, e - 1], h = 0, f = 0; f < c.length; ++f) {
    var g = f + 1;
    g == c.length && (g = 0);
    if (VisibilityPolygon.doLineSegmentsIntersect(e[0], e[1], d[0], d[1], c[f][0], c[f][1], c[g][0], c[g][1])) {
      var k = VisibilityPolygon.intersectLines(e, d, c[f], c[g]);
      if (VisibilityPolygon.equal(d, k)) return !0;
      VisibilityPolygon.equal(k, c[f])
        ? 180 > VisibilityPolygon.angle2(d, e, c[g]) && ++h
        : VisibilityPolygon.equal(k, c[g])
        ? 180 > VisibilityPolygon.angle2(d, e, c[f]) && ++h
        : ++h;
    }
  }
  return 0 != h % 2;
};
VisibilityPolygon.convertToSegments = function (d) {
  for (var c = [], e = 0; e < d.length; ++e)
    for (var f = 0; f < d[e].length; ++f) {
      var h = f + 1;
      h == d[e].length && (h = 0);
      c.push([d[e][f], d[e][h]]);
    }
  return c;
};
VisibilityPolygon.epsilon = function () {
  return 1e-7;
};
VisibilityPolygon.equal = function (d, c) {
  return Math.abs(d[0] - c[0]) < VisibilityPolygon.epsilon() && Math.abs(d[1] - c[1]) < VisibilityPolygon.epsilon()
    ? !0
    : !1;
};
VisibilityPolygon.remove = function (d, c, e, f, h, g) {
  g[c[d]] = -1;
  if (d == c.length - 1) c.pop();
  else {
    c[d] = c.pop();
    g[c[d]] = d;
    var k = VisibilityPolygon.parent(d);
    if (0 != d && VisibilityPolygon.lessThan(c[d], c[k], e, f, h))
      for (; 0 < d; ) {
        k = VisibilityPolygon.parent(d);
        if (!VisibilityPolygon.lessThan(c[d], c[k], e, f, h)) break;
        g[c[k]] = d;
        g[c[d]] = k;
        var l = c[d];
        c[d] = c[k];
        c[k] = l;
        d = k;
      }
    else
      for (;;) {
        var k = VisibilityPolygon.child(d),
          m = k + 1;
        if (
          k < c.length &&
          VisibilityPolygon.lessThan(c[k], c[d], e, f, h) &&
          (m == c.length || VisibilityPolygon.lessThan(c[k], c[m], e, f, h))
        )
          (g[c[k]] = d), (g[c[d]] = k), (l = c[k]), (c[k] = c[d]), (c[d] = l), (d = k);
        else if (m < c.length && VisibilityPolygon.lessThan(c[m], c[d], e, f, h))
          (g[c[m]] = d), (g[c[d]] = m), (l = c[m]), (c[m] = c[d]), (c[d] = l), (d = m);
        else break;
      }
  }
};
VisibilityPolygon.insert = function (d, c, e, f, h, g) {
  if (0 != VisibilityPolygon.intersectLines(f[d][0], f[d][1], e, h).length) {
    var k = c.length;
    c.push(d);
    for (g[d] = k; 0 < k; ) {
      d = VisibilityPolygon.parent(k);
      if (!VisibilityPolygon.lessThan(c[k], c[d], e, f, h)) break;
      g[c[d]] = k;
      g[c[k]] = d;
      var l = c[k];
      c[k] = c[d];
      c[d] = l;
      k = d;
    }
  }
};
VisibilityPolygon.lessThan = function (d, c, e, f, h) {
  var g = VisibilityPolygon.intersectLines(f[d][0], f[d][1], e, h);
  h = VisibilityPolygon.intersectLines(f[c][0], f[c][1], e, h);
  if (!VisibilityPolygon.equal(g, h))
    return (c = VisibilityPolygon.distance(g, e)), (e = VisibilityPolygon.distance(h, e)), c < e;
  var k = 0;
  VisibilityPolygon.equal(g, f[d][0]) && (k = 1);
  var l = 0;
  VisibilityPolygon.equal(h, f[c][0]) && (l = 1);
  d = VisibilityPolygon.angle2(f[d][k], g, e);
  e = VisibilityPolygon.angle2(f[c][l], h, e);
  return 180 > d ? (180 < e ? !0 : e < d) : d < e;
};
VisibilityPolygon.parent = function (d) {
  return Math.floor((d - 1) / 2);
};
VisibilityPolygon.child = function (d) {
  return 2 * d + 1;
};
VisibilityPolygon.angle2 = function (d, c, e) {
  d = VisibilityPolygon.angle(d, c);
  c = VisibilityPolygon.angle(c, e);
  c = d - c;
  0 > c && (c += 360);
  360 < c && (c -= 360);
  return c;
};
VisibilityPolygon.sortPoints = function (d, c) {
  for (var e = Array(2 * c.length), f = 0; f < c.length; ++f)
    for (var h = 0; 2 > h; ++h) {
      var g = VisibilityPolygon.angle(c[f][h], d);
      e[2 * f + h] = [f, h, g];
    }
  e.sort(function (c, d) {
    return c[2] - d[2];
  });
  return e;
};
VisibilityPolygon.angle = function (d, c) {
  return (180 * Math.atan2(c[1] - d[1], c[0] - d[0])) / Math.PI;
};
VisibilityPolygon.intersectLines = function (d, c, e, f) {
  var h = (f[0] - e[0]) * (d[1] - e[1]) - (f[1] - e[1]) * (d[0] - e[0]);
  e = (f[1] - e[1]) * (c[0] - d[0]) - (f[0] - e[0]) * (c[1] - d[1]);
  return 0 != e ? ((h /= e), [d[0] - h * (d[0] - c[0]), d[1] - h * (d[1] - c[1])]) : [];
};
VisibilityPolygon.distance = function (d, c) {
  return (d[0] - c[0]) * (d[0] - c[0]) + (d[1] - c[1]) * (d[1] - c[1]);
};
VisibilityPolygon.isOnSegment = function (d, c, e, f, h, g) {
  return (d <= h || e <= h) && (h <= d || h <= e) && (c <= g || f <= g) && (g <= c || g <= f);
};
VisibilityPolygon.computeDirection = function (d, c, e, f, h, g) {
  const a = (h - d) * (f - c);
  const b = (e - d) * (g - c);
  return a < b ? -1 : a > b ? 1 : 0;
};
VisibilityPolygon.doLineSegmentsIntersect = function (d, c, e, f, h, g, k, l) {
  const d1 = VisibilityPolygon.computeDirection(h, g, k, l, d, c);
  const d2 = VisibilityPolygon.computeDirection(h, g, k, l, e, f);
  const d3 = VisibilityPolygon.computeDirection(d, c, e, f, h, g);
  const d4 = VisibilityPolygon.computeDirection(d, c, e, f, k, l);
  return (
    (((0 < d1 && 0 > d2) || (0 > d1 && 0 < d2)) && ((0 < d3 && 0 > d4) || (0 > d3 && 0 < d4))) ||
    (0 == d1 && VisibilityPolygon.isOnSegment(h, g, k, l, d, c)) ||
    (0 == d2 && VisibilityPolygon.isOnSegment(h, g, k, l, e, f)) ||
    (0 == d3 && VisibilityPolygon.isOnSegment(d, c, e, f, h, g)) ||
    (0 == d4 && VisibilityPolygon.isOnSegment(d, c, e, f, k, l))
  );
};
