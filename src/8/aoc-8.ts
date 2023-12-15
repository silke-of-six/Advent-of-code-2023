import * as fs from 'fs';

class Network {

  constructor(private nodes: Node[], private instructions: string[]){}

  public static parse(input: string): Network{
    let lines = input.split('\n').filter(x=> x);
    const instructions = lines[0].split('').filter(x=> x);
    const nodes: Node[] =[];
    lines.slice(1).map(x=> {
      let nodeItems = x.split('=');
      const start = nodeItems[0].trim();
      const targets = nodeItems[1].trim().replace('(', '').replace(')', '').split(',').map(x=> x.trim());
      const node = new Node(start, targets);
      nodes.push(node);
    })
    return new Network(nodes, instructions);
  }

  public getSteps() : number {
    let steps = 0;
    let currentNode = this.nodes.find(x=> x.start === 'AAA')!
     let instructionIndex = 0;
     while(currentNode.start !== 'ZZZ'){
      const instruction = this.instructions[instructionIndex] === 'L' ? 0 : 1;
      let nextNodeStart = currentNode.getTarget(instruction);
      
      instructionIndex = (instructionIndex+1) % this.instructions.length;
      currentNode = this.nodes.find(x=> x.start === nextNodeStart)!;
      steps +=1;
     }
     return steps;
  }

  public getGhostSteps(){
    let steps = 0;
    let currentNodes = this.nodes.filter(X=> X.start.endsWith('A'));
    let currentNodesZ = this.nodes.filter(X=> X.start.endsWith('Z'));
    //13939, 17621, 11309, 20777, 19199, 15517
    //console.log(currentNodes);
    //console.log(currentNodesZ);
    const targetCount = currentNodes.length;
    //console.log(currentNodes)
    let instructionIndex = 0;
     while(currentNodes.filter(x=> x.start.endsWith('Z')).length !== targetCount ){
      //console.log(currentNodes);
      //console.log(this.instructions[instructionIndex]);
      const instruction = this.instructions[instructionIndex] === 'L' ? 0 : 1;
      let nextNodeStarts = currentNodes.map(x=> x.getTarget(instruction));
      
      instructionIndex = (instructionIndex+1) % this.instructions.length;
      currentNodes = this.nodes.filter(x=> nextNodeStarts.includes(x.start))!;
      steps +=1;
      //if(steps ===  1) break;
      //console.log(steps);
     }
     return steps;
  }

}

class Node {
  constructor(public start: string, private targets: string[]){}

  getTarget(direction: number){
    return this.targets[direction];    
  }
}


const networkInput = fs.readFileSync('./src/8/aoc-8.txt', 'utf-8');

let inputTest2 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

const network = Network.parse(inputTest2);


var startTime = performance.now()

console.log(network.getGhostSteps());
    
var endTime = performance.now()

console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)

class Network2 {

constructor(private nodes: Node2[],private instructions: string[]){}

  public static parse(input: string): Network2{
    let lines = input.split('\n').filter(x=> x);
    const instructions = lines[0].split('').filter(x=> x);
    const nodes: Node2[] =[];
    lines.slice(1).map(x=> {
      let nodeItems = x.split('=');
      const start = nodeItems[0].trim();
      const node = new Node2(start);
      nodes.push(node);
    });
    lines.slice(1).map(x=> {
      let nodeItems = x.split('=');
      const start = nodeItems[0].trim();
      const targets = nodeItems[1].trim().replace('(', '').replace(')', '').split(',').map(x=> x.trim());
      let node = nodes.find(x=> x.value === start)!;
      let left = nodes.find(x=> x.value === targets[0])!;
      let right = nodes.find(x=> x.value === targets[1])!;
      node.targets = [left, right];
    });
    console.log(nodes.filter(x=> x.value.length !== 3))

    return new Network2(nodes, instructions);
  }

  public getGhostSteps(){
    let steps = 0;
    let currentNodes = this.nodes.filter(X=> X.value.endsWith('A'));
    const targetCount = currentNodes.length;
    let instructionIndex = 0;
     while(currentNodes.filter(x=> x.isGoal).length !== targetCount ){
    
      const instruction = this.instructions[instructionIndex] === 'L' ? 0 : 1;
      let x =Promise.all(currentNodes.map(async x=> x.targets[instruction]));
      x.then(y=> currentNodes =y);
      //currentNodes = currentNodes.map(x=> x.targets[instruction]);
      
      instructionIndex = (instructionIndex+1) % this.instructions.length;
      
      steps +=1;
      if(steps === 100000) break;
      //console.log(steps);
      // if(currentNodes.filter(x=> x.isGoal).length> 2){

      //   console.log(steps);
      //   console.log(currentNodes.filter(x=> x.isGoal));
      // }
     }
     return steps;
  }
}

class Node2 {

  public targets!: Node2[];
  public isGoal = false;
  constructor(public value: string){
    this.isGoal = value.endsWith('Z');
  }

  makeStep(direction: number): Node2{
    return this.targets[direction];
  }
}

const network2 = Network2.parse(networkInput);

var startTime = performance.now()



console.log(network2.getGhostSteps());

    
var endTime = performance.now()

console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)