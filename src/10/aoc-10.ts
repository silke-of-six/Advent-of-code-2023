import * as fs from 'fs';

let testInput1 = `.....
.S-7.
.|.|.
.L-J.
.....`;

let testInput1_1 = `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`;

let testInput2 = `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`;

let testInput2_1 = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`;

class Pipes {
  constructor(private segments: Segment[], private rows: number, private columns: number){}

  public static parse(input: string): Pipes{
    let lines = input.split('\n').filter(x=> x);
    let segments: Segment[] = [];
    let rows = lines.length;
    let columns = lines[0].length;
    for(let y =0; y< lines.length; y++){
      const line = lines[y];
      let cells = line.split('');
      for(let x =0; x<cells.length; x++){
        if(cells[x] !== '.'){
          let segment= new Segment(x, y, cells[x]);
          segments.push(segment);
        }
      }      
    }
    let pipes = new Pipes(segments, rows, columns);
    pipes.attachSegments();
    pipes.findLoop();
    //pipes.print();
    return pipes;
  }
  findLoop() {
    let s = this.segments.find(s=> s.type === 'S')!;
    s.isOnLoop = true;
    let nextSegments = [s.down, s.up, s.left, s.right].filter(x=> x != null)!;
    let previousSegments =[s, s];
    let steps =1;
    while(nextSegments[0]!= nextSegments[1]){
      let copy = nextSegments.slice();
      nextSegments[0] = nextSegments[0]!.next(previousSegments[0]);
      nextSegments[1] = nextSegments[1]!.next(previousSegments[1]);
      previousSegments = [copy[0]!, copy[1]!];
      steps++;
    }
    nextSegments[0]!.isOnLoop =true;

    console.log(steps);
  }
  print() {
    for(let y= 0; y < this.rows; y++){
      let line = "";
      for(let x =0; x < this.columns; x++){
        let segment = this.segments.find(s=> s.x === x && s.y === y);
        if(segment?.isOnLoop){
          line += segment.type;
        }
        else{
          line += '.';
        }
      }
      console.log(line);
    }
  }
  attachSegments() {
    for(let segment of this.segments){
      if(segment.type === '|'){
        this.attachNorth(segment);
        this.attachSouth(segment);
      }
      if(segment.type === '-'){
        this.attachWest(segment);
        this.attachEast(segment);
      }
      if(segment.type === 'L'){
        this.attachEast(segment);
        this.attachNorth(segment);
      }
      if(segment.type === 'J'){
        this.attachWest(segment);
        this.attachNorth(segment);
      }
      if(segment.type === '7'){
        this.attachWest(segment);
        this.attachSouth(segment);
      }
      if(segment.type === 'F'){
        this.attachEast(segment);
        this.attachSouth(segment);
      }
    }
  }

  //   | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.

  attachNorth(segment: Segment) {
    if(segment.up != null) return;
    let toAttach = this.segments.find(s=> s.x === segment.x && s.y === segment.y-1);
    if(toAttach === undefined) return;
    if(norths.includes(toAttach.type)){
      segment.up = toAttach;
      toAttach.down = segment;
    }
  }
  
  attachSouth(segment: Segment) {
    if(segment.down !=null) return;
    let toAttach = this.segments.find(s=> s.x === segment.x && s.y === segment.y+1);
    if(toAttach === undefined) return;
    if(souths.includes(toAttach.type)){
      segment.down = toAttach;
      toAttach.up =segment;
    }
  }

  attachEast(segment: Segment) {
    if(segment.right != null) return;
    let toAttach = this.segments.find(s=> s.x === segment.x+1 && s.y === segment.y);
    if(toAttach === undefined) return;
    if(easts.includes(toAttach.type)){
      segment.right = toAttach;
      toAttach.left = segment;
    }
  }
  
  attachWest(segment: Segment) {
    if(segment.left !=null) return;
    let toAttach = this.segments.find(s=> s.x === segment.x-1 && s.y === segment.y);
    if(toAttach === undefined) return;
    if(wests.includes(toAttach.type)){
      segment.left = toAttach;
      toAttach.right = segment;
    }
  }

}


let norths = ['|', 'F', '7', 'S'];
let easts = ['-', 'J', '7', 'S'];
let souths = ['|', 'L', 'J', 'S'];
let wests = ['-', 'F', 'L', 'S'];

class Segment {

  next(from: Segment): Segment {
    this.isOnLoop = true;

    if(this.up != null && from != this.up) return this.up;
    if(this.down != null && from != this.down) return this.down;
    if(this.left != null && from != this.left) return this.left;
    if(this.right != null && from != this.right) return this.right;
    console.log('not matching any');
    return this;
  }

  up?: Segment;
  down?: Segment;
  left?: Segment;
  right?: Segment;
  isOnLoop = false;

  constructor(public x: number, public y: number, public type: string){}


}

let pipes= Pipes.parse(testInput2_1);

const input = fs.readFileSync('./src/10/aoc-10.txt', 'utf-8');

pipes= Pipes.parse(input);

let testinput2_0 = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`




