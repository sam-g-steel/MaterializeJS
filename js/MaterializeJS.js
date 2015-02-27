var MaterializeJS = {};

function _emptyStringIfNull(obj){
	try{
		return obj? obj : "";
	}catch(ex){
		
	}
	
	return "";
}

MaterializeJS.revealCardHtml =
function (id, title, image, info) {
	var res = "<div id='" + id + "' class='card animated fadeInUp'>" + "<div class='card-image waves-effect waves-block waves-light'>" + ( image ? "<img class='activator' src='" + image + "'>" : "" ) + "</div>" + "<div class='card-content'>" + "<span class='card-title activator grey-text text-darken-4'>" + title + "<i class='mdi-navigation-more-vert right'></i>" + "</span>" +
	//"<p><a href='#'>This is a link</a></p>" +
	"</div>" + "<div class='card-reveal'>" + "<span class='card-title grey-text text-darken-4'>" + title + "<i class='mdi-navigation-close right'></i></span>" + "<p>" + info + "</p>" + "</div>" + "</div>";
	return res;
};

MaterializeJS.imageCardHtml =
function (id, title, image, info) {
	var res = "<div id='" + id + "' class='card blue-grey lighten-5 animated fadeInUp waves-effect waves-block waves-light'>\n" + "    <div class='card-image'>\n" + ( image ? "        <img src='" + image + "'><hr style='margin: 0;'>\n" : "") + "    </div>\n" + "    <div class='card-content'>\n" + "        <span class='card-title grey-text text-darken-4'>" + title + "</span>\n" + "        <p>" + info + "</p>\n" + "    </div>\n" +
	//"    <div class='card-action'>\n" +
	//"        <a href='#'>This is a link</a>\n" +
	//"        <a href='#'>This is a link</a>\n" +
	//"    </div>\n" +
	"</div>";
	return res;
};

MaterializeJS.buttonHtml =
function (info) {
	if(!info) info = {};
	if(typeof info != "object"){
		toast("<b class='red-text'>Error:</b> MaterializeJS.buttonHtml - info must be an object!", 2500);
		return;
	}
	var res = "<a " + _emptyStringIfNull(info.htmlAttributes) + ">" + _emptyStringIfNull(info.text) + "</a>";
	return res;
};

jQuery.fn.addButton = function(info) {
    var o = $(this[0]); // It's your element
    newElement = $($.parseHTML(MaterializeJS.buttonHtml(info)));
    newElement.addClass("btn");
    newElement.addClass(_emptyStringIfNull(info.classes));
    o.append(newElement);
};