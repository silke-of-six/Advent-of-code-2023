import * as fs from 'fs';


const engineSchematicInput = fs.readFileSync('./aoc-3.txt', 'utf-8').split('\n');

const engineSchematicTestInput = [
    '467..114..',
    '...*......',
    '..35...633',
    '......#...',
    '617*......',
    '.....+.58.',
    '..592.....',
    '.......755',
    '...$...*..',
    '.664.598..']



function getPartNumberSum(engineSchematicInput: string[]): number {
    const engineSchemnatic = EngineSchemnatic.parse(engineSchematicInput);
    return engineSchemnatic.getPartNumbers().reduce((sum, current) => sum + current, 0);
}

function getGearRatioSum(engineSchematicInput: string[]): number {
    const engineSchemnatic = EngineSchemnatic.parse(engineSchematicInput);
    return engineSchemnatic.getGearRatioSum();
}

const PERIOD = '.'
const STAR = '*';

class EngineSchemnatic {
    private rows: number;
    private columns: number;

    constructor(private visualRepresentation: Cell[][] = []){
        this.rows = visualRepresentation.length;
        this.columns = visualRepresentation[0].length;
    }

    public static parse(lines: string[]): EngineSchemnatic {
        let visualRepresentation: Cell[][] = [];
        let rowIndex = 0;
        for(let line of lines){
            const chars = line.split('');
            let columnIndex = 0;
            let cells: Cell[] = [];
            for(const char of chars){
                cells.push(new Cell(char, rowIndex, columnIndex));
                columnIndex++;
            }
            visualRepresentation.push(cells);
            rowIndex++;
        }
        return new EngineSchemnatic(visualRepresentation);
    }

    getGearRatioSum(): number{
        this.findNumberSpans();
        let sum = 0;
        for(let row = 0; row< this.rows; row++){
            for(let column = 0; column< this.columns; column++){
                let cell= this.visualRepresentation[row][column];
                if(cell.value === STAR){
                    let numberSpans = this.getCellNeighbours(cell).filter(x=> x.numberSpan != null).map(x=> x.numberSpan as NumberSpan);
                    let numbers: NumberSpan[] = [];
                    
                    for(let numberSpan of numberSpans){
                        if(numbers.find(x=> x.row === numberSpan.row && x.start === numberSpan.start && x.end === numberSpan.end) === undefined){
                            numbers.push(numberSpan);
                        }
                    }
                    if(numbers.length === 2){
                        sum += numbers[0].value!* numbers[1].value!;
                        console.log(JSON.stringify(numbers));
                    }
                }
            }
        }
        return sum;
    }

    findNumberSpans(){
        for(let row = 0; row< this.rows; row++){
            let value = '';
            let numberSpan = new NumberSpan();
            numberSpan.row = row;
            for(let column = 0; column< this.columns; column++){
                const cell = this.visualRepresentation[row][column];
                if(cell.cellType === CellType.Number){
                    if(value.length === 0){
                        numberSpan.start = column;
                    }
                    value += cell.value;
                    cell.numberSpan = numberSpan;
                }
                else{
                    if(value.length>0){
                        numberSpan.end = column;
                        numberSpan.value = +value;
                    }
                    value = '';
                    numberSpan = new NumberSpan();
                    numberSpan.row = row;
                }
            }
            if(value.length>0){
                numberSpan.end = this.columns-1;
                numberSpan.value = +value;
                            
            }
            value = '';
            numberSpan = new NumberSpan();    
        }
    }

    getPartNumbers(): number[] {
        let partNumbers: number[] = [];
        for(let i = 0; i< this.visualRepresentation.length; i++){
            const row = this.visualRepresentation[i];
            let value = '';
            let hasAdjacentSymbol = false;
            for(let j = 0; j< row.length; j++){
                const cell = row[j];
                if(cell.cellType === CellType.Number){
                    value += cell.value;
                    const neighbours = this.getCellNeighbours(cell);
                    let symbol = neighbours.find(x=> x.cellType === CellType.Symbol);
                    if(symbol !== undefined){
                        hasAdjacentSymbol = true;
                    }
                }
                else{
                    if(value.length> 0 && hasAdjacentSymbol){
                        partNumbers.push(+value);
                    }
                    value = '';
                    hasAdjacentSymbol = false;
                }
            }
            if(value.length> 0 && hasAdjacentSymbol){
                partNumbers.push(+value);
            }
            value = '';
            hasAdjacentSymbol = false;
        }
        return partNumbers;
    }

    getCellNeighbours(cell: Cell): Cell[] {
        let neighbours: Cell[] = [];
        for(let i = -1; i<2; i++){
            for(let j = -1; j<2; j++){
                if(i !== 0 || j !== 0){
                    let rowIndex = cell.rowIndex + i;
                    let columnIndex = cell.columnIndex + j;
                    if(rowIndex > -1 && rowIndex < this.rows && columnIndex> -1 && columnIndex < this.columns){
                        neighbours.push(this.visualRepresentation[rowIndex][columnIndex]);
                    }
                }
            }
        }
        return neighbours;
    }
}

class Cell {
    public cellType: CellType;
    public numberSpan?: NumberSpan;

    constructor(public value: string, public rowIndex: number, public columnIndex: number){
        if(value >= '0' && value <= '9'){
            this.cellType = CellType.Number;
        }
        else if(value === PERIOD){
            this.cellType = CellType.Period;
        }
        else {
            this.cellType = CellType.Symbol
        }
    }

}

class NumberSpan {
    public start?: number;
    public end?: number; 
    public row?: number;
    public value?: number;

    constructor(){}
}

enum CellType {
    Number,
    Period,
    Symbol,
}



//console.log(getPartNumberSum(engineSchematicInput));
console.log(getGearRatioSum(engineSchematicInput));