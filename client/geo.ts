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

export class GEO {
  static ss: number;
  static sx: number;
  static sy: number;
  static cx: number;
  static ccx: number;
  static cy: number;
  static f: number;

  static dx: number;
  static dy: number;

  /* polygon definitions */
  static corner1: [[number, number], [number, number], [number, number]];
  static corner2: [[number, number], [number, number], [number, number]];
  static wall: [[number, number], [number, number], [number, number], [number, number]][];
  static fatwall: [[number, number], [number, number], [number, number], [number, number]][];
  static hexagon: [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
    [number, number],
    [number, number]
  ];

  static setSize(ss: number) {
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
  }
}
