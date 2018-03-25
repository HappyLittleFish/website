

/**
 * [sameSymbol Determine whether sign of two cross product are the same ]
 */
function sameSymbol(a,b){
	return (a ^ b) >= 0;
}

/**
 * [vectorProduct calculate cross product]
 */
function vectorProduct(v1,v2){
	return v1.x * v2.y - v2.x * v1.y;
}

/**
 * [isPointInTrangle judge whether the point in the triangle or not]
 */
function isPointInTriangle(p,a,b,c){
	var pa = vector(p,a);
	var pb = vector(p,b);
	var pc = vector(p,c);

	var t1 = vectorProduct(pa,pb);
	var t2 = vectorProduct(pb,pc);
	var t3 = vectorProduct(pc,pa);

	if (sameSymbol(t1,t2)&&sameSymbol(t2,t3)) {
		return true;
	}else{
		return false;
	}
	// [vector calculate vector]
	function vector(a,b){
		var aPoint = a;
		var bPoint = b;
		return{
			x: bPoint.x - aPoint.x,
			y: bPoint.y - aPoint.y
		}
	}

}


/**
 * judge mouseenter event whether need delay or not
 */
function needDelay(elem,leftCorner,currentMousePos){
	var offset = elem.offset();

	var topLeft = {
		x: offset.left,
		y: offset.top
	}

	var bottomLeft = {
		x: offset.left,
		y: offset.top + elem.height()
	}

	return isPointInTriangle(currentMousePos,leftCorner,topLeft,bottomLeft);
}


