import * as fs from 'fs';

let testInput= `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

class Record {
  constructor(private symbols: string, private groups: number[]){
  }

  //'?###????????', [3,2,1]
  //?????#???#??#???? 3,8

  findArrangements(): number{
    this.getArrangements(this.groups, ['']);
    return 0;
  }
  getArrangments(groupLength: number, max: number) : string[]{
    let arrs: string[]=[];
    let g = new Array(groupLength).fill('#')
    for(let i = 0; i< max; i++){
      let x = new Array(i).fill('.');
      x.push(...[g])
      arrs.push(x.join());
    }
    
    return arrs;
  }

  getArrangements(groups: number[], arrs: string[]): string[]{
    if(groups.length === 0) return arrs;
    let groupLength = groups.splice(0, 1)[0];
    //console.log(groupLength);
    let newArrs: string[] = [];
    for(let x of arrs){
      let l = this.symbols.length - x.length - groups.reduce((sum, f)=> sum +1+f);
      //console.log('length' + l);
      let arranges = this.getArrangments(groupLength, l);
      for(let a of arranges){
        newArrs.push(x+a);
        console.log(x+a);
      }
    }
    return this.getArrangements(groups, newArrs);
  }

}

class ConditionRecords {

  constructor(private records: Record[]){}

  public static parse(input: string): ConditionRecords{
    return new ConditionRecords(input.split('\n').filter(x=> x).map(y=> new Record(y.split(' ')[0], y.split(' ')[1].split(',').map(x=> +x))))
  }

  getSum(): number {
    return this.records.reduce((sum, x)=> sum+x.findArrangements(), 0);
  }
}


const input = fs.readFileSync('./src/12/aoc-12.txt', 'utf-8');


let records = ConditionRecords.parse(testInput);
console.log(records.getSum());




