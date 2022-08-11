/*
How to register and remember that a branch is "burnt" and should not be traversed ever again after it was proven that it leads to fuckup?
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
					console.log(`updateOptions(): wow, field ${[j + 1, i + 1]} has ${matrix.blacklist[i][j].length} numbers blacklisted, these are: ${matrix.blacklist[i][j]}`)
					if (option.includes(matrix.blacklist[i][j][k])){ //if it is amongst the options, removes it from there
						console.log(`It is ${option.includes(matrix.blacklist[i][j][k])} that blacklisted numbers is amongst the options, so it needs to be deleted!`);
						console.log(`Before deletion option content is: ${option}`);
						option.splice(option.indexOf(matrix.blacklist[i][j][k]), 1);
						console.log(`After deletion option content is: ${option}`);
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

let sampleData;
let blocks;
let resolution = 450;
let matrix;
let selectedField = [3, 7];
let traversingTree = [];
let easiest;
let entry;
let isSolvable;
let isDebug = false;
let branches = 0;
let currentBranch = {
	blacklists: []
};
let secondLastMove;

function action(type){
	if (type === 'solveOne'){ //enters the randomly chosen valid number in one of the randomly chosen easiest fields
		a = new Moves(false);
		console.log(`New move was made on field ${a.coords}, where possible options are: ${a.options}`);
		entry = random(a.options);
		console.log(`${entry} was randomly chosen`);

		//removes entered/randomised number from list of other possibilities
		a.options.splice(a.options.indexOf(entry), 1);
	}
	if (type === 'stepForward'){
		a = new Moves(false);
		entry = random(a.options);
		console.log(`New move was made on field ${a.coords}, where possible options are: ${a.options} and ${entry} was randomly chosen`);
		matrix.rows[a.coords[1] - 1][a.coords[0] - 1] = entry;
		traversingTree.push(a);
		if (a.options.length > 1){
			branches++
		}
	}
	if (type === 'solveAll'){
		
	}
	if (type === 'cancelOne'){ //goes back one step (one entered number)
		if (traversingTree.length > 0){
			matrix.rows[lastMove().coords[1] - 1][lastMove().coords[0] - 1] = 0
			traversingTree.pop();
		}
	}
	if (type === 'deleteBranch'){ //goes back to the last fork, adding current branch to blacklist
		let keepGoing = true;
		while (keepGoing){
			if (lastMove().options.length === 1){ //for simple moves, just cancel them
				action('cancelOne');
			}
			else{ //for complex moves, blacklist a combination of number and field leading to deadlock and cancel them
				//blacklisting
				let indexToBlacklist = coordsToIndex([lastMove().coords[0], lastMove().coords[1]]);
				let numberToBlacklist =  matrix.rows[indexToBlacklist[0]][indexToBlacklist[1]];
				matrix.blacklist[coordsToIndex(lastMove().coords)[0]][coordsToIndex(lastMove().coords)[1]].push(numberToBlacklist);

				action('cancelOne');
				keepGoing = false;
				branches--;
				console.log(`Branch was deleted - number ${numberToBlacklist} should never be used on field ${[indexToCoords(indexToBlacklist)[0], indexToCoords(indexToBlacklist)[0]]} anymore.`);
				detect('branchBurned');
			}
		}
	}
	if (type === 'cancelAll'){ //goes back all steps to beginning
		while (traversingTree.length > 0){
			cancelMove();
		}
	}
	if (type === 'fill' && matrix.rows[selectedField[1] - 1][selectedField[0] - 1] == 0){ //enters user-chosen number into user-chosen field
		a = new Moves(true);
		if (possibleNumbers(selectedField).includes(entry)){
			//updates matrix
			matrix.rows[a.coords[1] - 1][a.coords[0] - 1] = entry;

			//inserts input into traversing tree
			traversingTree.push(a);

			//removes entered/randomised number from list of other possibilities
			a.options.splice(a.options.indexOf(entry), 1);
		}
		else{
			alert(`This field can contain only ${possibleNumbers(selectedField)}, while user tried to enter ${entry}!`);
		}
	}
	matrix.calculate();
	matrix.updateOptions();
	checkEasiest();
	detect('deadlock');
}
function detect(type){

	if (type === 'isSolvable'){
		let progress = traversingTree.length;
	}
	if (type === 'deadlock'){
		if (easiest[1] === 0){
			alert(`Deadlock was detected!`);
		}
	}
	if (type === 'branchBurned'){
		if (possibleNumbers(checkEasiest[0]) == matrix.blacklist[checkEasiest[1] - 1][checkEasiest[0] - 1]){ //
			return true;
		}
		else{
			return false;
		}
	}
}

//Some idiot functions which shouldn't be here
function coordsToIndex(coords){
	return [coords[1] - 1, coords[0] - 1];
}
function indexToCoords(index){
	return [index[1] + 1, index[0] + 1];
}


function lastMove(){
	return traversingTree[traversingTree.length - 1];
}
function possibleNumbers(coords){ //accepts coordinates for a field and returns numbers which could be used in that field
	//creates set containing all numbers already used in row, column and block a field belongs to
	let pool = new Set (matrix.rows[coords[1] - 1]);
	for (let i = 0; i < 9; i++){
		pool.add(matrix.columns[coords[0] - 1][i]);
		pool.add(matrix.blocks[floor((coords[0] - 1)/3) + 3*floor((coords[1] - 1)/3)][i]);
	}

	pool.delete(0);
	//inverts the numbers in set so that it contains only numbers NOT USED YET 
	for(let i = 1; i <= 9; i++){
		if (pool.has(i)){
			pool.delete(i);
		}
		else{
			pool.add(i);
		}
	}

	return Array.from(pool);
}
function fieldOnMouse(){ //returns coordinates of field under the mouse cursor
	let coordinates = [ceil(mouseX / (resolution/9)), ceil(mouseY / (resolution/9))];
	return coordinates;
}
function checkEasiest(){ //scans whole matrix searching for fields which can contain smallest array of numbers and sets 'easiest' to [[coords1, coords2, coords3, ...], difficulty]
	let difficulty = 9;
	let options = [];
	for (let i = 0; i < 9; i++){
		for (let j = 0; j < 9; j++){
			if (matrix.rows[i][j] == 0 && matrix.options[i][j].length < difficulty){
					difficulty = matrix.options[i][j].length;
			}
		}
	}
	for (let i = 0; i < 9; i++){
		for (let j = 0; j < 9; j++){
			if (matrix.rows[i][j] == 0){
				if (matrix.options[i][j].length == difficulty){
					options.push([j + 1, i + 1]); //if field is empty and is of the lowest difficulty, adds its coords to easiest[0] (options) 
				}
			}
		}
	}
	console.log(`checkEasiest() have found that lowest difficulty is ${difficulty} and fields are ${options}`);
	easiest = [options, difficulty];
	return;
}

function preload(){}
function setup(){
	createCanvas(resolution, resolution + 200);
	sampleData1 = [[5, 3, 0, 0, 7, 0, 0, 0, 0], [6, 0, 0, 1, 9, 5, 0, 0, 0], [0, 9, 8, 0, 0, 0, 0, 6, 0], [8, 0, 0, 0, 6, 0, 0, 0, 3], [4, 0, 0, 8, 0, 3, 0, 0, 1], 
		[7, 0, 0, 0, 2, 0, 0, 0, 6], [0, 6, 0, 0, 0, 0, 2, 8, 0], [0, 0, 0, 4, 1, 9, 0, 0, 5], [0, 0, 0, 0, 8, 0, 0, 7, 9]];
	sampleDataEmpty = [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]];
	sampleDataHard = [[0, 0, 5, 2, 0, 0, 8, 0, 0], [8, 9, 1, 0, 3, 2, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 9], [1, 0, 2, 0, 0, 0, 0, 0, 0], [0, 7, 9, 8, 0, 0, 1, 0, 2], 
		[0, 0, 0, 0, 0, 9, 0, 0, 0], [0, 0, 0, 0, 5, 0, 4, 0, 7], [0, 0, 7, 0, 3, 0, 9, 1, 5], [2, 0, 0, 0, 1, 0, 0, 0, 3]];
	sampleDataExpert = [[8, 0, 0, 6, 0, 0, 0, 0, 2], [0, 0, 0, 0, 0, 0, 0, 0, 9], [0, 0, 0, 2, 9, 0, 0, 5, 0], [3, 0, 0, 0, 5, 0, 0, 0, 0], [0, 0, 6, 0, 0, 8, 0, 0, 0], 
		[0, 0, 0, 0, 0, 7, 4, 3, 0], [0, 8, 0, 0, 0, 0, 5, 0, 7], [0, 5, 0, 0, 0, 0, 1, 0, 0], [6, 2, 9, 0, 0, 0, 0, 0, 0]];
	sampleDataEvil = [[0, 0, 6, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 4, 0, 0, 0, 1], [5, 0, 7, 0, 0, 1, 0, 8, 0], [8, 0, 1, 0, 0, 4, 0, 7, 0], [0, 0, 0, 2, 0, 0, 9, 0, 0], 
		[0, 3, 0, 0, 0, 0, 0, 0, 0], [3, 0, 5, 0, 9, 0, 7, 0, 0], [0, 6, 0, 0, 0, 5, 0, 0, 0], [0, 4, 0, 0, 0, 0, 0, 3, 0]];
	blocks = [[0, 0], [0, 3], [0, 6], [3, 0], [3, 3], [3, 6], [6, 0], [6, 3], [6, 6]];
	matrix = new Matrices(sampleDataExpert);
	matrix.updateOptions();
	checkEasiest();
}
function draw(){
	background(235);
	if (selectedField != 0){ //If there is a field selected, paints it green
		fill(0, 200, 0);
		rect(((selectedField[0] - 1) * 50), (selectedField[1] - 1) * 50, 50, 50);
	}
	fill(0);
	for (let i = 0; i < resolution; i = i + resolution/9){ //Draws sudoku layout
			if (i % (resolution/3) == 0){
				strokeWeight(3);
			}
			else{
				strokeWeight(1);
			}
			line (i, 0, i, resolution);
			line (0, i, resolution, i);
	}
	textSize(30);
	textAlign(CENTER, CENTER);
	for (let i = 0; i < 9; i++){ //Fills empty spaces with loaded matrix
		for (let j = 0; j < 9; j++){
			if (matrix.rows[i][j] != 0){
				text(matrix.rows[i][j], j*resolution/9 + resolution/18, i*resolution/9 + resolution/18);
			}
			
		}
	}
	let currentSector = fieldOnMouse();
	fill(100, 40);
	noStroke();
	if (fieldOnMouse()[0] < 10 && fieldOnMouse()[1] < 10){
		rect((currentSector[0] - 1) * resolution/9, (currentSector[1] - 1) * resolution/9, resolution/9, resolution/9);
	}
	fill(0);
	stroke(0);
	if (isDebug){
		let treeContent = 'Traversing tree: '
		for (let i = 0; i < traversingTree.length; i++){
			treeContent += `[${traversingTree[i].coords}] - [${traversingTree[i].options}], `;
		}
		textAlign(LEFT);
		textSize(13);
		text(treeContent, 5, 470, 450);
		text(`Lowest difficulty: ${easiest[1]} at: ${easiest[0]}`, 5, 600);
		text(`Number of branches: ${branches}`, 5, 620);
		for (let i = 0; i < easiest[0].length; i++){
			if (easiest[1] > 0){
				fill (255, 147, 38);
			}
			else{
				fill(255, 0, 0);
			}
			rect((easiest[0][i][0] - 1) * resolution/9, (easiest[0][i][1] - 1) * resolution/9, 50, 50);
		}
		textWrap(CHAR);
		noStroke();
		fill(0, 94, 125);
		for (let i = 0; i < 9; i++){
			for (let j = 0; j < 9; j++){
				text(matrix.options[i][j], 3 + 50 * j, 10 + 50 * i, 45);
			}
		}
		stroke(0);
	}
}



function mousePressed(){
	if (selectedField[0] === fieldOnMouse()[0] && selectedField[1] === fieldOnMouse()[1]){
		selectedField = 0;
		console.log('Field was deactivated');
	}
	else if (fieldOnMouse()[0] < 10 && fieldOnMouse()[1] < 10){
		selectedField = fieldOnMouse();
		console.log(`Row number ${fieldOnMouse()[1]}, column number ${fieldOnMouse()[0]}, and block number ${1 + floor((fieldOnMouse()[0] - 1)/3) + 3*floor((fieldOnMouse()[1] - 1)/3)} was activated.`);
	}
}
function keyPressed(){
	if (keyCode === 8){
		action('cancelOne');
	}
	if (keyCode > 48 && keyCode < 58){
		entry = keyCode - 48;
		action('fill');
	}
	if (keyCode === 191){
		if (isDebug){
			isDebug = false;
		}
		else{
			isDebug = true;
		}
	}
}
