/**
  * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
  * images to fit into a certain area.
  *
  * @param {Number} srcWidth Source area width
  * @param {Number} srcHeight Source area height
  * @param {Number} maxWidth Fittable area maximum available width
  * @param {Number} maxHeight Fittable area maximum available height
  * @return {Object} { width, heigth }
  */
function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth*ratio, height: srcHeight*ratio };
 }

function setFlipbookFitSize(width, height) {
	g = calculateAspectRatioFit(width, height, $('#flipbook').width()/2, $('#flipbook').height())
	widthOfFlip = g.width
	heightOfFlip = g.height
	$("#flipbook").turn("size", widthOfFlip, heightOfFlip);
}

widthOfFlip = "100%"
heightOfFlip = "90vh"
invert = true
scrollInvert = false

$("#flipbook").turn({
    autoCenter: false
});

var img = new Image();
img.onload = function() {
	setFlipbookFitSize(this.width, this.height) 
}

img.src = ""

function pad(num, size) {
    var s = num+"";
    while (s.length <= size) s = "0" + s;
    return s;
}

function expandUrlString(stringToExpand){
	var retArray = []
	var re = /\[\d*-\d*\]/i;
	var found = stringToExpand.match(re);

	if(!found){
		retArray.push(stringToExpand)
		return retArray
	}
	var ran = found[0].slice(1, -1)
	
	var re1 = /\d*-/
	var min = ran.match(re1)
	var min = min[0].slice(0, -1)
	
	var re2 = /-\d*/
	var max = ran.match(re2)
	var max = max[0].slice(1)

	var leadingZeros = 0
	
	for (var i = 0; i < min.length-1; i++) {
		if (min[i] != "0")
			break
		else
			leadingZeros++
	};

	min = parseInt(min)
	max = parseInt(max)

	amount = max - min
	for (var i = 0; i <= amount; i++) {
		retArray.push(stringToExpand.replace(found[0], pad(min+i,leadingZeros)))
	}
	return retArray
}

function loadImages(){
	textToParse = $('#loader textarea').val();
	arrayOfHrefUnparsed = textToParse.split("\n")
	
	amountPagesToDelete = $("#flipbook").turn("pages")

	//remove empty lines
	var arrayOfHref = []
	for (var i = 0; i < arrayOfHrefUnparsed.length; i++) {
		if(arrayOfHrefUnparsed[i] == '')
    		continue
    	arrayOfHref = arrayOfHref.concat(expandUrlString(arrayOfHrefUnparsed[i]))
	};
	
	totalPages = arrayOfHref.length


	//add new images
    for (i = 0; i < totalPages; i++) {
    	
    	if(i == 0 || i == 1 || i == (totalPages-1) || (i == (totalPages-2) && (totalPages%2) == 0))
			hardClass = 'class = "hard"'
		else
			hardClass = ''

		if(i%2 == 0)
			nextp = '$("#flipbook").turn("next");'
		else
			nextp = '$("#flipbook").turn("previous");'

	    divPage = '<div '+hardClass+'><div class="comic" ><div class="clickBox" onmousedown=\''+nextp+'\'></div><img src="'+arrayOfHref[i]+'"></div></div>'
    	
    	var img = new Image();
    	img.onload = function() {
			widthOfFlip = $('#flipbook').width()/2
			img = calculateAspectRatioFit(this.width, this.height, $('#flipbook').width()/2, $('#flipbook').height())

			widthOfFlip = g.width
			heightOfFlip = g.height

			if(widthOfFlip < heightOfFlip)
				$("#flipbook").turn("size", widthOfFlip, heightOfFlip);

		}
		img.src = arrayOfHref[i]
    	$("#flipbook").turn("addPage", $.parseHTML(divPage))


	}

	//add an ending page if needed
	if ((totalPages%2)!=0) {
	 	divPage = '<div class = "hard"><div class="comic"><div class="clickBox" onmousedown=\'$("#flipbook").turn("previous");\'></div><img src=""></div></div>'
    	$("#flipbook").turn("addPage", divPage);
	}

	//remove old pages
	for (var i = 0; i < amountPagesToDelete; i++) {
		$("#flipbook").turn("removePage", 1);
	};

	//turn to first page
	$("#flipbook").turn("page", 1);
}

$("body").keydown(function(e) {
	if ($("textarea").is(":focus")){
		return
	}
	if(e.keyCode == 37) { // left
		if(!invert)
			$("#flipbook").turn("previous");
		else
			$("#flipbook").turn("next");
	}
	else if(e.keyCode == 39) { // right
		if(!invert)
			$("#flipbook").turn("next");
		else
			$("#flipbook").turn("previous");
	}
});

$("#flipbook").bind('mousewheel', function(e){
    if(e.originalEvent.wheelDelta > 0)
    {
        if(!scrollInvert)
			$("#flipbook").turn("previous");
		else
			$("#flipbook").turn("next");
    }
    else
    {
        if(!scrollInvert)
			$("#flipbook").turn("next");
		else
			$("#flipbook").turn("previous");
    }
});

window.addEventListener('resize', function(event){
  $("#flipbook").turn("size", widthOfFlip, heightOfFlip);
});
