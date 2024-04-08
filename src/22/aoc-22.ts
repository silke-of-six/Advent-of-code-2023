import * as fs from "fs";

let input = `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`;

class BrickStack {
  cube: string[][][] = [];
  xMax!: number;
  yMax!: number;
  zMax!: number;

  constructor(private bricks: Brick[]) {
    this.update();
  }
  update() {
    //console.log("update");
    this.xMax = Math.max(...this.bricks.map((b) => b.end.x)) + 1;
    this.yMax = Math.max(...this.bricks.map((b) => b.end.y)) + 1;
    this.zMax = Math.max(...this.bricks.map((b) => b.end.z)) + 1;
    this.cube = new Array(this.xMax);
    for (let x = 0; x < this.xMax; x++) {
      this.cube[x] = new Array(this.yMax);
      for (let y = 0; y < this.yMax; y++) {
        this.cube[x][y] = new Array(this.zMax).fill(".");
      }
    }
    for (let b of this.bricks) {
      for (let x = b.start.x; x <= b.end.x; x++) {
        for (let y = b.start.y; y <= b.end.y; y++) {
          for (let z = b.start.z; z <= b.end.z; z++) {
            this.cube[x][y][z] = b.id;
          }
        }
      }
    }
  }

  print() {
    console.log(this.bricks.length);
    //console.log(this.cube);
    this.printX();
    this.printY();
  }
  printY() {
    for (let z = this.zMax - 1; z > 0; z--) {
      let line = "";
      for (let y = 0; y < this.yMax; y++) {
        let chars = this.cube.map((x) => x[y][z]);
        //console.log(chars);
        let char = this.getChar(chars);
        line += char;
        //console.log(char);
      }
      console.log(line);
    }
  }

  printX() {
    for (let z = this.zMax - 1; z > 0; z--) {
      let line = "";
      for (let x = 0; x < this.xMax; x++) {
        let chars = this.cube[x].map((y) => y[z]);
        //console.log(chars);
        let char = this.getChar(chars);
        line += char;
        //console.log(char);
      }
      console.log(line);
    }
  }

  getChar(vector: string[]) {
    let brickIds = vector.filter(
      (x, i) => x !== "." && vector.indexOf(x) === i
    );
    if (brickIds.length === 0) {
      return ".";
    } else if (brickIds.length === 1) {
      return brickIds[0];
    }
    return "?";
  }

  settleBricks() {
    let sortedByZ = this.bricks.sort((a, b) => {
      return a.start.z - b.start.z;
    });
    for (let brick of sortedByZ) {
      this.settleBrick(brick);
    }
  }

  private settleBrick(brick: Brick) {
    //console.log("settleBrick");
    let isFree = true;
    let z = brick.start.z - 1;
    while (isFree && z > 0) {
      for (let x = brick.start.x; x <= brick.end.x; x++) {
        for (let y = brick.start.y; y <= brick.end.y; y++) {
          isFree &&= this.cube[x][y][z] === ".";
        }
      }
      z -= 1;
    }
    let zTranslate = z + 2 - brick.start.z;
    if (zTranslate < 0) {
      this.moveDown(brick, zTranslate);
      this.update();
    }
  }

  moveDown(brick: Brick, zTranslate: number) {
    //console.log(brick);
    //console.log(zTranslate);
    brick.start.z += zTranslate;
    brick.end.z += zTranslate;
  }

  countDisintegratable() {
    for (let brick of this.bricks) {
      let supporting = this.getSupportingBricks(brick);
      if (supporting.length === 1) {
        let single = this.bricks.find((x) => x.id === supporting[0]);
        single!.disintegratable = false;
      }
    }
    return this.bricks.filter((x) => x.disintegratable).length;
  }
  getSupportingBricks(brick: Brick) {
    let ids: string[] = [];
    let z = brick.start.z - 1;
    for (let x = brick.start.x; x <= brick.end.x; x++) {
      for (let y = brick.start.y; y <= brick.end.y; y++) {
        let char = this.cube[x][y][z];
        if (char !== ".") {
          if (ids.indexOf(char) === -1) {
            ids.push(char);
          }
        }
      }
    }
    return ids;
  }

  public static parse(input: string): BrickStack {
    let bricks: Brick[] = [];
    let alphabet = "abcdefghijklmnopqrstuvwxyz"
      .split("")
      .map((s) => s.toUpperCase());
    let i = 0;
    input
      .split("\n")
      .filter((x) => x)
      .map((l, i) => {
        let coordinates = l.split("~").map((c) => c.split(",").map((n) => +n));
        bricks.push(new Brick(coordinates, i.toString()));
      });

    return new BrickStack(bricks);
  }
}

class Brick {
  start: Coordinate;
  end: Coordinate;
  id: string;
  public disintegratable = true;

  constructor(coordinates: number[][], identifier: string) {
    this.start = new Coordinate(coordinates[0]);
    this.end = new Coordinate(coordinates[1]);
    this.id = identifier;

    if (this.start.x > this.end.x) {
      console.log("end x larger");
    }
    if (this.start.z > this.end.z) {
      console.log("end z larger");
    }
    if (this.start.y > this.end.y) {
      console.log("end y larger");
    }
  }
}

class Coordinate {
  public x: number;
  public y: number;
  public z: number;
  constructor(values: number[]) {
    this.x = values[0];
    this.y = values[1];
    this.z = values[2];
  }

  getVector(): number[] {
    return [this.x, this.y, this.z];
  }
}

input = fs.readFileSync("./src/22/aoc-22.txt", "utf-8");
let stack = BrickStack.parse(input);
stack.settleBricks();
stack.print();
console.log(stack.countDisintegratable());
