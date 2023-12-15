export abstract class Puzzle {
    constructor(protected input: string[]){}
    abstract getAnswerPartOne(): number;
    abstract getAnswerPartTwo(): number;
}

