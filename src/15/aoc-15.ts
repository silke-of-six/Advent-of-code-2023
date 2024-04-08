import * as fs from 'fs';

let testInput = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

class Procedure {

    _count = 0;
    constructor(private sequences: string[]){
        console.log(sequences);
    }

    public static parse(input: string){
        return new Procedure(input.replace('\n', '').split(',').filter(x=>x));
    }

    public calculateSum(){
        let results = this.sequences.map(x=> this.calculateHash(x));
        console.log(this._count);
        return results.reduce((sum,x)=> sum + x, 0);
    }
    calculateHash(x: string): number {
        console.log(x.split(''));
        let currentValue = 0;
        for(let i = 0; i< x.length; i++){    
            if(x.charAt(i) === '\n') this._count++;        
            let asciiCode = x.charCodeAt(i);
            currentValue += asciiCode;
            currentValue *= 17;
            currentValue %= 256;
        }
        return currentValue;
    }
}

const input = fs.readFileSync('./src/15/aoc-15.txt', 'utf-8');

let hashes = Procedure.parse(input);
console.log(hashes.calculateSum());