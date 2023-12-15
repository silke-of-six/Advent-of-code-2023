import * as fs from 'fs';



function getSum(lines: string[]): number{
    let sum = 0;
    const pattern = new RegExp(' +');
    const cardCount = new Array(lines.length).fill(1);
    for(let row= 0; row< lines.length; row++){
        const cards = lines[row].slice(7).split('|');
        const winningCards = cards[0].trim().split(pattern);
        const myCards = cards[1].trim().split(pattern);
        //console.log(intersection(winningCards, myCards));
        const numberOfWinningCards = intersection(winningCards, myCards).length;
        const rowCardCount = cardCount[row];
        console.log(numberOfWinningCards);
        console.log(row);
        for(let i = 0; i< numberOfWinningCards; i++){
            const cardIndex = row+1+i;
            if(cardIndex< lines.length){
                console.log(cardIndex);
                cardCount[cardIndex] += rowCardCount;
            }
        }
        const count = getPoints(numberOfWinningCards);
        sum += count;

    }
    console.log(cardCount);
    return cardCount.reduce((sum, current) => sum + current, 0);
    return sum;
}

function intersection(array1: string[], array2: string[]): string[] {
    return array1.filter(x=> array2.includes(x));
}

function getPoints(winningCardCount: number): number {
    let product = 1;
    if(winningCardCount == 0) product = 0;
    for (let index = 1; index < winningCardCount; index++) {
        product *= 2;        
    }
    return product;
}

const scratchCardsTest = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`.split('\n');


const scratchCards = fs.readFileSync('./aoc-4.txt', 'utf-8').split('\n');

console.log(getSum(scratchCards));