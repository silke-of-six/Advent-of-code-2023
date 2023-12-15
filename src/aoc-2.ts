import * as fs from 'fs';

function createColorMap(red: number, green: number, blue: number): Map<Color, number>{
    const map = new Map<Color, number>();
map.set(Color.Red, red);
map.set(Color.Green, green);
map.set(Color.Blue, blue);
return map;
}

function getGames(lines: string[], cubeColorCount: Map<Color, number>): number{
    let games: Game[] = [];
    let validGameIds: number[] = [];
    let powerSum = 0;
    for(let line of lines){
        let parts = line.split(':');
        const id = +parts[0].replace('Game ', '');
        let samples = parts[1].split(';');

        let gameSamples: Sample[] = [];

        for(let sample of samples){
            const colorCounts = new Map<Color, number>();
            let cubes = sample.split(',');
            for(let cubeCount of cubes){
                let trimmed = cubeCount.trim();
                let countAndColor = trimmed.split(' ');
                const count = +countAndColor[0];
                const color = countAndColor[1];
                colorCounts.set(getColor(color),count);
            }  
            gameSamples.push(new Sample(colorCounts));
        }
        let game = new Game(id, gameSamples);
        games.push(game);
        if(game.isPossible(cubeColorCount)){
            validGameIds.push(game.id);
        }
        powerSum += game.getPower();
    }
    //return validGameIds.reduce((sum, current) => sum + current, 0);
    return powerSum;
}

function getColor(color: string): Color{
    if(color === Color.Red)return Color.Red;
    if(color === Color.Green) return Color.Green;
    if(color === Color.Blue) return Color.Blue;
    throw Error('unknown color');
}




class Game {
    constructor(public id: number, private samples: Sample[]){}    

    isPossible(cubeColors: Map<Color, number>): boolean {
        for(let sample of this.samples){
            for (let [key, value] of sample.counts) {
                const colorCount = cubeColors.get(key);
                if(colorCount === undefined) throw Error(`${key} not present in ${cubeColors}`);
                if(colorCount < value) return false;
            }
        }        
        return true;
    }

    private getMinimumCubes(): Map<Color, number>{
        let maxCount = createColorMap(0, 0, 0);
        for(let sample of this.samples){
            for (let [key, value] of sample.counts) {
                const currentMax = maxCount.get(key);
                if(currentMax === undefined) throw Error(`${key} not present in ${maxCount}`);
                if(currentMax < value){
                    maxCount.set(key, value);
                }                
            }
        }
        return maxCount;
        
    }

    getPower(): number {
        const minimumCount = this.getMinimumCubes();
        let power = 1;
        for( const value of minimumCount.values()){
            power *= value;
        }
        return power;
    }
}


class Sample {
        constructor(public counts: Map<Color, number>){}    
}


enum Color {
    Red = 'red',
    Green= 'green',
    Blue = 'blue',
}

const games = [
    'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green',
    'Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue',
    'Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red',
    'Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red',
    'Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green']

const cubeColorCounts = createColorMap(12, 13, 14);

const lines = fs.readFileSync('./aoc-2.txt', 'utf-8').split('\n');

console.log(getGames(lines, cubeColorCounts));
    