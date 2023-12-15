import * as fs from 'fs';

class Oasis {
  constructor(private sequences: Sequence[]){}

  public static parse(input: string): Oasis {
    let sequences = input.split('\n').filter(x=>x).map(x=> x.trim().split(' ').map(x=> +x)).map(x=> new Sequence(x));
    return new Oasis(sequences);

  }

  getSum(){
    let sum = 0;
    for(let sequence of this.sequences){
      //console.log(sequence);
      sum += sequence.getPreviousValue();
      //console.log(sequence.getPreviousValue());
    }
    return sum;
  }
}

class Sequence {
  private differences?: Sequence;

  constructor(private values: number[]){
    //console.log(values);
    this.createDifferences();
  }

  createDifferences(){
    if(this.values.filter(x=> x !==0 ).length === 0) return;
    let differences: number[] =[];
    let preceding = this.values[0];
    for(let i = 1; i< this.values.length; i++){
      differences.push(this.values[i] -preceding);
      preceding = this.values[i]
    }
    this.differences = new Sequence(differences);
  }

  getNextValue():number{
    let nextValue = this.values.at(-1)!;
    if(this.differences){
      nextValue +=this.differences?.getNextValue();
    }
    return nextValue;
  }

  getPreviousValue():number{
    let previousValue = this.values.at(0)!;
    if(this.differences){
      previousValue -=this.differences?.getPreviousValue();
    }
    return previousValue;
  }

}

const oasisInput = fs.readFileSync('./src/9/aoc-9.txt', 'utf-8');


let testInput = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;


const oasis = Oasis.parse(oasisInput);

console.log(oasis.getSum());

