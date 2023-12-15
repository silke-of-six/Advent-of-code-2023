import * as fs from 'fs';

class NumberIndex {
  constructor (public index: number, public number: string){}
}

const numbers: [string, string][] = [['one', '1'], 
  ['two', '2'], ['three', '3'], ['four', '4'], ['five', '5'], ['six', '6'], ['seven', '7'], ['eight', '8'], 
   ['nine', '9'], ['1', '1'],['2', '2'],['3', '3'],['4', '4'],['5', '5'],['6', '6'],['7', '7'], ['8', '8'], ['9', '9']];

function getSum (lines: string[]): number {
  let sum = 0
  for (const line of lines) {
    const firstDigit = getValue(line.split(''));
    const lastDigit = getValue([...line.split('')].reverse());
    sum += +(firstDigit + lastDigit);
  }
  return sum;
}

function getSum2 (lines: string[]): number {
  let sum = 0
  for (const line of lines) {
    console.log(line);
    let indicesFirst =numbers.map(x=> new NumberIndex(line.indexOf(x[0]),x[1])).filter(x=> x.index> -1);
    const firstDigitIndex = Math.min(...indicesFirst.map(x=> x.index));
    const firstDigit = indicesFirst.find(x=> x.index === firstDigitIndex)!.number;
    let indicesLast =numbers.map(x=> new NumberIndex(line.lastIndexOf(x[0]),x[1])).filter(x=> x.index> -1);
    const lastDigitIndex = Math.max(...indicesLast.map(x=> x.index));
    const lastDigit = indicesLast.find(x=> x.index === lastDigitIndex)!.number;
    console.log(firstDigit + lastDigit);
    sum += +(firstDigit + lastDigit);
  }
  return sum;
}

function getValue (chars: string[]): string {
  const value = chars.find(x => x >= '0' && x <= '9');
  if (value === undefined) {
    throw Error(`no number found in ${chars.join()}`);
  }
  console.log(value);
  return value;
}

const calibrationInput = fs.readFileSync('./src/1/aoc-1.txt', 'utf-8').split('\n');

const calibrationTest2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`.split('\n');

console.log(getSum2(calibrationInput))

//console.log(getSum(['1abc2', 'pqr3stu8vwx', 'a1b2c3d4e5f', 'treb7uchet']));