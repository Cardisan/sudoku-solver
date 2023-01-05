/*
checkEasiest() says one thing, while possibleNumbers() says the other. Why according to AI there are no possible numbers to type in [1, 2] on second move???
Analyze how this event listener on window works in dom.js!
*/


class Matrices {
	constructor(data = undefined) {
		if (typeof(data) == 'undefined'){
			this.rows = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			for (let i = 0; i < 9; i++){
				this.rows[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			}
		}
		else {
			this.rows = data;
		}
		this.blacklist = [[[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []],
			[[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []],
			[[], [], [], [], [], [], [], [], []]];
		this.comments = [[[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []],
			[[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []], [[], [], [], [], [], [], [], [], []],
			[[], [], [], [], [], [], [], [], []]];
	    this.columns = [];
	    this.blocks = [];
	    this.options = [];
	    this.calculate();
	}
	calculate(){ //updates matrix's columns and blocks' content and saves it to appropriate object properties
		this.columns = []; 
		this.blocks = [];
		for (let i = 0; i < 9; i++){
			let column = [];
			let block = [];
			for (let j = 0; j < 9; j++){
				column.push(this.rows[j][i]);
			}		
			for (let j = 0; j < 3; j++){
				for (let k = 0; k < 3; k++){
					block.push(this.rows[blocks[i][0] + j][blocks[i][1] + k]);
				}
			}
			this.columns.push(column);
			this.blocks.push(block);
		}
	}
	updateOptions(){ //recalculates which numbers could be inserted into each field and removes the ones which were blacklisted using any method
		this.options = []; //array of rows, where each is an array of field, where each is an array of options
		for (let i = 0; i < 9; i++){ //loops over every row
			let optionsRow = []; //array of fields, where each is an array of options
			for (let j = 0; j < 9; j++){ //loops over every non-empty field
				let option = []; //array of options
				if (matrix.rows[i][j] == 0){
					option = possibleNumbers([j + 1, i + 1]);
				}
				for (let k = 0; k < matrix.blacklist[i][j].length; k++){ //loops over every blacklisted number for that field...
					if (option.includes(matrix.blacklist[i][j][k])){ //if it is amongst the options, removes it from there
						option.splice(option.indexOf(matrix.blacklist[i][j][k]), 1);
					} 
				}
				optionsRow.push(option);
			}	
			this.options.push(optionsRow);
		}
	}
}
class Moves {
	constructor(isManual){
		if (isManual){
			this.coords = selectedField;
			this.options = possibleNumbers(selectedField);
		}
		else{
			this.coords = random(easiest[0]);
			this.options = possibleNumbers(this.coords);
		}
	}
}

let blocks;
let resolution = 450;
let matrix;
let selectedField = 0;
let traversingTree = [];
let easiest;
let entry;
let isDebug = false;
let isSafeTyping = true;
let lastField;
let branches = [];
let branch = [];
let currentBranch = {
	blacklists: []
};
let isBlacklistActive = false;
let isCommenting = false;
let isSafe = false;
let isUser = true;
let save;
let blacklist = [];
let moveCounter = 0;
let hintsUsed = 0;
let solveUsed = 0;
let hintCounter = 180;
let pointsForField;
let frameCounter = 0;
let startKeyPressingCounter = 0;

function saveGame(){
	save = [JSON.parse(JSON.stringify(matrix.rows)), JSON.parse(JSON.stringify(matrix.comments)), JSON.parse(JSON.stringify(traversingTree))];
}
function loadGame(){
	matrix.rows = JSON.parse(JSON.stringify(save[0]));
	matrix.comments = JSON.parse(JSON.stringify(save[1]));
	traversingTree = JSON.parse(JSON.stringify(save[2]));
	update();
}
function setup(){
	var myCanvas = createCanvas(resolution, resolution + 400);
    myCanvas.parent("canvasMain");
	sampleDataEmpty = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
	sampleDataEasy = [[3, 8, 7, 0, 0, 0, 9, 0, 2], [0, 0, 2, 7, 3, 6, 0, 0, 5], [0, 1, 0, 9, 0, 2, 3, 0, 0], [0, 0, 0, 0, 9, 0, 0, 0, 0], [0, 7, 5, 8, 0, 0, 6, 4, 9], 
		[9, 0, 8, 0, 2, 0, 5, 0, 0], [0, 6, 9, 0, 0, 0, 0, 5, 0], [0, 5, 4, 3, 6, 9, 0, 1, 0], [8, 2, 0, 1, 7, 0, 0, 0, 0]];
	sampleDataMedium = [[6, 5, 0, 4, 3, 0, 0, 0, 0], [0, 0, 0, 0, 7, 5, 0, 3, 0], [0, 4, 3, 0, 0, 0, 0, 5, 8], [1, 9, 7, 3, 8, 4, 0, 0, 0], [0, 0, 0, 9, 0, 0, 0, 0, 0], 
		[0, 0, 0, 7, 0, 0, 1, 0, 9], [0, 6, 0, 0, 0, 0, 0, 9, 0], [9, 0, 2, 5, 0, 3, 0, 1, 0], [8, 3, 0, 0, 9, 0, 0, 0, 7]];
	sampleDataHard = [[0, 0, 0, 0, 0, 0, 0, 0, 8], [3, 0, 0, 0, 0, 0, 5, 0, 0], [0, 0, 4, 3, 0, 0, 0, 9, 1], [0, 0, 1, 0, 4, 6, 7, 5, 0], [0, 4, 9, 0, 0, 0, 0, 1, 0],
		[0, 7, 0, 0, 0, 5, 0, 0, 0], [0, 0, 0, 4, 0, 0, 0, 6, 0], [0, 0, 0, 0, 8, 1, 0, 0, 4], [0, 0, 5, 0, 0, 0, 0, 7, 3]];
	sampleDataExpert = [[8, 0, 0, 6, 0, 0, 0, 0, 2], [0, 0, 0, 0, 0, 0, 0, 0, 9], [0, 0, 0, 2, 9, 0, 0, 5, 0], [3, 0, 0, 0, 5, 0, 0, 0, 0], [0, 0, 6, 0, 0, 8, 0, 0, 0], 
		[0, 0, 0, 0, 0, 7, 4, 3, 0], [0, 8, 0, 0, 0, 0, 5, 0, 7], [0, 5, 0, 0, 0, 0, 1, 0, 0], [6, 2, 9, 0, 0, 0, 0, 0, 0]];
	sampleDataEvil = [[0, 0, 6, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 4, 0, 0, 0, 1], [5, 0, 7, 0, 0, 1, 0, 8, 0], [8, 0, 1, 0, 0, 4, 0, 7, 0], [0, 0, 0, 2, 0, 0, 9, 0, 0], 
		[0, 3, 0, 0, 0, 0, 0, 0, 0], [3, 0, 5, 0, 9, 0, 7, 0, 0], [0, 6, 0, 0, 0, 5, 0, 0, 0], [0, 4, 0, 0, 0, 0, 0, 3, 0]];
	blocks = [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6], [6, 0], [6, 3], [6, 6]];
	matrix = new Matrices(sampleDataEasy);
	matrix.updateOptions();
	checkEasiest();
}
