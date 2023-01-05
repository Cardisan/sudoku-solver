function refreshBlacklist(){
	blacklist = [];
	for (let i = 0; i < matrix.blacklist.length; i++){
		for (let j = 0; j < matrix.blacklist[i].length; j++){
			for (let k = 0; k < matrix.blacklist[i][j].length; k++){
				blacklist.push([j + 1, i + 1, matrix.blacklist[i][j][k]]);
			}
		}
	}
}