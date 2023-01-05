function coordsToIndex(coords){
	return [coords[1] - 1, coords[0] - 1];
}
function indexToCoords(index){
	return [index[1] + 1, index[0] + 1];
}
function lastMove(){
	return traversingTree[traversingTree.length - 1];
}
function countHowManyEmptyFields(){
	let counter = 0;
	for (let i = 0; i < matrix.rows.length; i++){
		for (let j = 0; j < matrix.rows[i].length; j++){
			if (matrix.rows[i][j] == 0){
				console.log(`Detected empty field on ${j + 1}, ${i + 1}`);
				counter++;
				console.log(`Now counter is at ${counter}`);
			}
		}
	}
	return counter;
}
function calculateStartingPoints(){
	let empties = countHowManyEmptyFields();
	let startingPoints = 10;
	if ((empties - 40) > 0) startingPoints += (empties - 40); 
	if ((empties - 47) > 0) startingPoints += (empties - 47);
	if ((empties - 55) > 0) startingPoints += (empties - 55) * 2;
	startingPoints *= 1000;
	pointsForField = floor(startingPoints / empties);
	console.log(`Sudoku was valued at ${startingPoints} points. There are ${pointsForField} points for 1 field`);
	return startingPoints;
}