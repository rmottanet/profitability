function calc() {
	let rate = document.getElementById("fRate").value / 100;
	let term = document.getElementById("fTerm").value * 1;
	let mod = document.querySelector('input[name="modal"]:checked').value;
	let tribute = calcTributes(term);
	let showTrib = tribute * 100;

	if (mod == 'PRE') {
		kind.innerHTML = "Pre";
		tributes.innerHTML = "Tribute: " + showTrib + " %";
		profit = calcPre(rate, tribute);
		profits.innerHTML = "Liquid: " +  profit + " %";
	} 
		
	if (mod == 'POS') {
		kind.innerHTML = "Pos";
		tributes.innerHTML = "Tribute: " + showTrib + " %";
		profit = calcPos(rate, tribute);
		profits.innerHTML = "Liquid: " +  profit + " %";
	}
	
}


function calcTributes(term) {
	if (term < 181) {
		return 22.5 / 100;
		} else if (term > 180 && term < 361) {
			return 17.5 / 100;
			} else if (term > 360 && term < 721) {
				return 17.5 / 100;
				} else {
					return 15 / 100;
	}	
}


function calcPre(rate, tribute) {
	var profit = rate * (1 - tribute);
	profit = profit * 100;
	return profit.toFixed(2);	
}


function calcPos(rate, tribute) {
	let selic = 13.65 / 100;
	var profit = (rate * selic) * (1 - tribute);
	profit = profit * 100;
	return profit.toFixed(2);	
}
