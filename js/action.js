function useHint(){ //displays a hint - the easiest fields at that moment (with the smallest amount of possible numbers which could by typed in) 
	hintCounter = 0;
	hintsUsed++;
}
function solveOne(){ //makes one correct move
	if (easiest[1] == 1){
		stepForward();
	}
	else{
		let currentStage = traversingTree.length;
		solveAll();
		while (traversingTree.length > currentStage + 1){
			cancelOne();
		}
	}
	solveUsed++;
}
function stepForward(){ //enters randomly chosen valid number in one of the randomly chosen easiest fields
	//Creates a move
	a = new Moves(false);
	entry = random(a.options);

	//Changes matrix and enters Move into traversing tree
	matrix.rows[a.coords[1] - 1][a.coords[0] - 1] = entry;
	traversingTree.push(a);
	
	//If it was not a obvious move, pushes coords to branch array
	if (a.options.length > 1 || matrix.blacklist[a.coords[1] - 1][a.coords[0] - 1].length > 0){
		branch.push(a.coords);
	}
	update();
}
function solveAll(){ //solves whole sudoku using algorythm
	while(!isFinished()){
		if (isDeadlock()){
			unstuck();
		}
		else{
			stepForward();
		}
	}
}
function cancelOne(){ //goes back one step (one entered number)
	if (isStarted()){
		matrix.rows[lastMove().coords[1] - 1][lastMove().coords[0] - 1] = 0
		traversingTree.pop();
	}
	update();
}
function wrongWay(){ //Goes back to previous branching and adds current branching to blacklist
	while (lastMove().coords != branch[branch.length - 1]){ //cancel all simple moves
		action('cancelOne');
	}
	
	//blacklist typed number which led to deadlock
	let coords = lastMove().coords;
	let numberToBlacklist =  matrix.rows[coordsToIndex(coords)[0]][coordsToIndex(coords)[1]];
	matrix.blacklist[coordsToIndex(coords)[0]][coordsToIndex(coords)[1]].push(numberToBlacklist);

	cancelOne();
	branch.pop();

	//If all options for that field were proved to be wrong, it cancels current blacklist, goes back to parent
	//branch, and blacklists parent branch
	if (isDeadlock()){ 
		console.log(`It appears all combinations for that field were used! Clearing blacklist on ${lastMove().coords} and moving to parent branch!`);
		matrix.blacklist[coordsToIndex(coords)[0]][coordsToIndex(coords)[1]] = [];
		action('unstuck');
	}
	else{
		console.log('Deadlock was not detected after cancelling!');
	}
	update();
}
	function move(direction){
		if (direction === 'left'){
			if (selectedField[0] > 1){
				selectedField[0]--;
			}
		}
		if (direction === 'up'){
			if (selectedField[1] > 1){
				selectedField[1]--;
			}	
		}
		if (direction === 'right'){
			if (selectedField[0] < 9){
				selectedField[0]++;
			}
		}
		if (direction === 'down'){
			if (selectedField[1] < 9){
				selectedField[1]++;
			}
		}
	}
function unstuck(){
	while (lastMove().coords != branch[branch.length - 1]){ //cancel all simple moves
		cancelOne();
	}
	
	//blacklist typed number which led to deadlock
	let coords = lastMove().coords;
	let numberToBlacklist =  matrix.rows[coordsToIndex(coords)[0]][coordsToIndex(coords)[1]];
	matrix.blacklist[coordsToIndex(coords)[0]][coordsToIndex(coords)[1]].push(numberToBlacklist);

	cancelOne();
	branch.pop();

	//If all options for that field were proved to be wrong, it cancels current blacklist, goes back to parent
	//branch, and blacklists parent branch
	if (isDeadlock()){ 
		console.log(`It appears all combinations for that field were used! Clearing blacklist on ${lastMove().coords} and moving to parent branch!`);
		matrix.blacklist[coordsToIndex(coords)[0]][coordsToIndex(coords)[1]] = [];
		unstuck();
	}
	else{
		console.log('Deadlock was not detected after cancelling!');
	}
}
function cancelAll(){ //goes back all steps to beginning
	while (isStarted()){
		cancelOne();
	}
}
function insert(number){ //inserts chosen number into selected field
	if (matrix.rows[selectedField[1] - 1][selectedField[0] - 1] == 0){
		let a = new Moves(true);
		if (isSafe){
			if (possibleNumbers(selectedField).includes(number)){
				//updates matrix
				matrix.rows[a.coords[1] - 1][a.coords[0] - 1] = number;

				//inserts input into traversing tree
				traversingTree.push(a);

				//removes entered/randomised number from list of other possibilities
				a.options.splice(a.options.indexOf(number), 1);
				}
			else{
				alert(`This field can contain only ${possibleNumbers(selectedField)}, while user tried to enter ${number}!`);
			}
		}
		else{
			//updates matrix
			matrix.rows[a.coords[1] - 1][a.coords[0] - 1] = number;

			//inserts input into traversing tree
			traversingTree.push(a);

			//removes entered/randomised number from list of other possibilities
			a.options.splice(a.options.indexOf(number), 1);
		}
	}
	update();
}
function eraseField(){ //erases content of any field which is not a part of the sudoku and removes entry from traversing tree 
	if (!isCommenting){
		let treeIndex = undefined;
		for (let i = 0; i < traversingTree.length; i++){
			if (traversingTree[i].coords[0] === selectedField[0] && traversingTree[i].coords[1] === selectedField[1]){
				treeIndex = i;
				break;
			}
		}
		if (typeof treeIndex === 'undefined' && matrix.rows[selectedField[1] - 1][selectedField[0] - 1] != 0){
			alert('User tried to erase field which is a part of the sudoku!');
		}
		else{
			matrix.rows[selectedField[1] - 1][selectedField[0] - 1] = 0;
			traversingTree.splice(treeIndex, 1);
		}
		update();
	}
	else{
		matrix.comments[selectedField[1] - 1][selectedField[0] - 1] = [];
	}
	
}
function comment(number){ //adds and removes user comments on selected field
	let commentsOnField = matrix.comments[selectedField[1] - 1][selectedField[0] - 1];
	
	//IF COMMENT IS ALREADY IN THAT FIELD, REMOVE IT
	if (commentsOnField.includes(number)){
		commentsOnField.splice(commentsOnField.indexOf(number), 1);
	}
	//IF NOT, ADD IT
	else{
		commentsOnField.push(number);
		commentsOnField.sort();
	}
}
function update(){ //recalculation after matrix has been changed
	matrix.calculate();
	matrix.updateOptions();
	checkEasiest();
	moveCounter++;
}