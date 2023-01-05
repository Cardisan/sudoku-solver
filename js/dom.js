function assignDOM(){
	let safetyButton = document.getElementById("safetyButton");
	let commentButton = document.getElementById("commentButton");
	let hintButton = document.getElementById("hintButton");
	let solveButton = document.getElementById("solveButton");
	let solveAllButton = document.getElementById("solveAllButton");
	let restartButton = document.getElementById("restartButton");
	let saveButton = document.getElementById("saveButton");
	let restoreButton = document.getElementById("restoreButton");
	let loadButton = document.getElementById("loadButton");
	let generateButton = document.getElementById("generateButton");

	safetyButton.addEventListener('click', switchSafety);
	commentButton.addEventListener('click', switchComment);
	hintButton.addEventListener('click', useHint);
	solveButton.addEventListener('click', solveOne);
	solveAllButton.addEventListener('click', solveAll);
	restartButton.addEventListener('click', cancelAll);
	saveButton.addEventListener('click', saveGame);
	restoreButton.addEventListener('click', loadGame);
	loadButton.addEventListener('click', notReady); //TO WRITE LOAD FUNCTION
	generateButton.addEventListener('click', notReady); //TO WRITE GENERATE FUNCTION

	window.addEventListener("keydown", function(e) {
	    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
	        e.preventDefault();
	    }
	}, false);
	
	
	console.log('DOM assigned.');
}
function switchSafety(){
	console.log('switchSafety function started');
	if (isSafe) isSafe = false;
	else isSafe = true;
}
function switchComment(){
	console.log('switchComment function started');
	if (isCommenting) isCommenting = false;
	else isCommenting = true;
}
function notReady(parameter = null){
	alert(`${parameter} is a feature which hasn't been introduced yet!`);
}