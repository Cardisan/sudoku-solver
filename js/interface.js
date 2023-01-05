function mousePressed(){
	if (selectedField[0] === fieldOnMouse()[0] && selectedField[1] === fieldOnMouse()[1]){ //when clicked on selectedField
		selectedField = 0;
		console.log('Field was deactivated');
	}
	else if (mouseX >= 0 && mouseX <= resolution && mouseY >= 0 && mouseY <= resolution){
		selectedField = fieldOnMouse();
		console.log(`Row number ${fieldOnMouse()[1]}, column number ${fieldOnMouse()[0]}, and block number ${1 + floor((fieldOnMouse()[0] - 1)/3) + 3*floor((fieldOnMouse()[1] - 1)/3)} was activated.`);
	}
}
function keyPressed(){
	if (keyCode === 8){ //backspace cancels last move
		cancelOne();
	}
	if (keyCode === 46){//delete erases chosen field
		eraseField();
	}
	if (keyCode > 48 && keyCode < 58){ //numbers 1-9 either add/remove comments or type numbers
		if (isCommenting){
			if (selectedField != 0){
				comment(keyCode - 48);
			}
		}
		else{
			entry = keyCode - 48;
			insert(keyCode - 48);
		}
	}
	if (keyCode === 67){ //"C" toggles commenting mode
		switchComment();
		if (commentButton.hasAttribute('checked', '')){
			commentButton.removeAttribute('checked');
		}
		else{
			commentButton.setAttribute('checked', '');
		}
	}
	if (keyCode === 191){ //backslash turns on and off debug mode
		if (isDebug){
			isDebug = false;
		}
		else{
			isDebug = true;
		}
	}
	if (keyCode === 70){
		action('stepForward');
	}
	if (keyCode === 71){
		action('unstuck');
	}

	if (keyCode === UP_ARROW){
		move('up');
	}
	if (keyCode === LEFT_ARROW){
		move('left');
	}
	if (keyCode === DOWN_ARROW){
		move('down');
	}
	if (keyCode === RIGHT_ARROW){
		move('right');
	}
	startKeyPressingCounter = frameCounter;
}
