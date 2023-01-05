//FUNCTIONS BASED ON ALGORYTHMS AND MAKING NO CHANGES

function isSolvable(){

}
function isDeadlock(){ //returns TRUE if deadlock already appeared and FALSE if not
	if (easiest[1] === 0){
		return true;
	}
	return false;
}
function isFinished(){ //returns TRUE if sudoku is already finished and returns FALSE if not finished yet
	for (let i = 0; i < matrix.rows.length; i++){
		for (let j = 0; j < matrix.rows[i].length; j++){
			if (matrix.rows[i][j] === 0){
				return false;
			}
		}
	}
	return true;
}
function isStarted(){ //returns TRUE if at least one move was made and returns FALSE if not yet
	if (traversingTree.length === 0){
		return false;
	}
	return true;
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
	easiest = [options, difficulty];
	return;
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
	//if there are numbers blacklisted on that field, removes them from list of possibilities
	let localBlacklist = matrix.blacklist[coords[1] - 1][coords[0] - 1];
	for (let i = 0; i < localBlacklist.length; i++){
		if (pool.has(localBlacklist[i])){
			pool.delete(localBlacklist[i]);
		}
	}

	return Array.from(pool);
}


function fieldOnMouse(){ //returns coordinates of field under the mouse cursor
	let coordinates = [ceil(mouseX / (resolution/9)), ceil(mouseY / (resolution/9))];
	return coordinates;
}