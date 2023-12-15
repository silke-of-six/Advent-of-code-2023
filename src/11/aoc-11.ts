import * as fs from 'fs';
import { type } from 'os';

let testInput = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

type Galaxy = {
  row: number;
  column: number;
}

class Universe{

  private galaxies?: Galaxy[];

  constructor(private image: string[][]){

  }

  expand() {
    let rowsToExpand = this.image.map((x, i)=> {if(x.filter(y=> y!== '.').length === 0)return i;}).filter(z=> z);
    console.log(rowsToExpand);
    let columnsToExpand = this.image[0].map((x, i) => {if(this.image.map(y=> y[i]).filter(y=> y!== '.').length === 0) return i;}).filter(z=> z);
    console.log(columnsToExpand);
  }

  findGalaxies(){
    let galaxies: Galaxy[] =[];
    this.image.forEach((row, i) => {
      row.forEach((cell, j) => {
        if(cell !== '.'){
          galaxies.push({row: i, column: j})
        }
      });
    });
  }

  public static parse(input: string):Universe{
    let image = input.split('\n').filter(x=> x).map(y=> y.split(''));
    return new Universe(image);
  }
}

const input = fs.readFileSync('./src/11/aoc-11.txt', 'utf-8');

let universe = Universe.parse(testInput);
universe.expand();






