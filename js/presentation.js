function draw(){
	background(235);
	if (selectedField != 0){ //If there is a field selected, paints it green
		fill(0, 200, 0);
		rect(((selectedField[0] - 1) * 50), (selectedField[1] - 1) * 50, 50, 50);
	}
	fill(0);

	if (hintCounter < 120){ //If hint was recently clicked, highlights easiest fields
		for (let i = 0; i < easiest[0].length; i++){
			if (easiest[1] > 0){
				fill (255, 147, 38);
			}
			else{
				fill(255, 0, 0);
			}
			rect((easiest[0][i][0] - 1) * resolution/9, (easiest[0][i][1] - 1) * resolution/9, 50, 50);
		}
	}
	fill(0);

	for (let i = 0; i <= resolution; i = i + resolution/9){ //Draws sudoku layout
			if (i % (resolution/3) == 0 && i != resolution){
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
	
	//DISPLAYS DEBUG INFO
	if (isDebug){
		let treeContent = 'Traversing tree: '
		for (let i = 0; i < traversingTree.length; i++){
			treeContent += `[${traversingTree[i].coords}] - [${traversingTree[i].options}], `;
		}
		textAlign(LEFT);
		textSize(13);
		text(treeContent, 5, 470, 450);
		text(`Blacklisted fields: ${blacklist}`, 5, 580);
		text(`Lowest difficulty: ${easiest[1]} at: ${easiest[0]}`, 5, 600);
		text(`Number of branches: ${branch}`, 5, 620);
		text(`Move counter: ${moveCounter}`, 5, 640);
		text(`Frame counter: ${frameCounter}`, 5, 660);
		text(`Key pressed frame counter: ${startKeyPressingCounter}`, 5, 680);
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
	else {
		noStroke();
		fill(100);
		textWrap(CHAR);
		textSize(13);
		for (let i = 0; i < 9; i++){
			for (let j = 0; j < 9; j++){
				if (matrix.rows[i][j] == 0) text(matrix.comments[i][j], 3 + 50 * j, 10 + 50 * i, 45);
			}
		}
		stroke(0);
	}
	if ((frameCounter - startKeyPressingCounter + 1) % 15 == 0){
		refresh4();
	}
	hintCounter++;
	frameCounter++;
}
function refresh4(){
	if (keyIsDown(UP_ARROW)) move('up');
	if (keyIsDown(LEFT_ARROW)) move('left');
	if (keyIsDown(DOWN_ARROW)) move('down');
	if (keyIsDown(RIGHT_ARROW)) move('right');
}
