var x = 1200;
var y = ((x*300)/400)

$("#flipbook").turn({
    width: x,
    height: y,
    autoCenter: false
});

function loadImages(){
	textToParse = $('#loader textarea').val();
	arrayOfHrefUnparsed = textToParse.split("\n")
	
	amountPagesToDelete = $("#flipbook").turn("pages")

	var arrayOfHref = []
	for (var i = 0; i < arrayOfHrefUnparsed.length; i++) {
		if(arrayOfHrefUnparsed[i] == '')
    		continue
    	arrayOfHref.push(arrayOfHrefUnparsed[i])

	};
	
	totalPages = arrayOfHref.length

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
    	$("#flipbook").turn("addPage", divPage)
	}
	if ((totalPages%2)!=0) {
	 	divPage = '<div class = "hard"><div class="comic"><div class="clickBox" onmousedown=\'$("#flipbook").turn("previous");\'></div><img src=""></div></div>'
    	$("#flipbook").turn("addPage", divPage);
	}

	for (var i = 0; i < amountPagesToDelete; i++) {
		$("#flipbook").turn("removePage", 1);
	};
	$("#flipbook").turn("page", 1);
	
}

$("body").keydown(function(e) {
	if ($("textarea").is(":focus")){
		return
	}
	if(e.keyCode == 37) { // left
		$("#flipbook").turn("previous");
	}
	else if(e.keyCode == 39) { // right
		$("#flipbook").turn("next");
	}
});