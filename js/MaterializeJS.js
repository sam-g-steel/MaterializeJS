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

MaterializeJS.plainPanelCardHtml =
function (info) {
      var res = "<div class='card-panel'>" +
          "<span class=" + _emptyStringIfNull(info.span_classes) + ">" + _emptyStringIfNull(info.text) + " </span>" +
        "</div>" +
      "</div>";
      return res;
};

jQuery.fn.addPlainPanelCard = function(info) {
    var o = $(this[0]); // It's your element
    newElement = $($.parseHTML(MaterializeJS.plainPanelCardHtml(info)));
    
    newElement.addClass(_emptyStringIfNull(info.classes));
    o.append(newElement);
};

MaterializeJS.imageCardHtml =
function (info) {
	var res = "<div id='" + info.id + "' class='card blue-grey lighten-5 animated fadeInUp waves-effect waves-block waves-light'>\n" + "    <div class='card-image'>\n" + ( info.image ? "        <img src='" + info.image + "'><hr style='margin: 0;'>\n" : "") + "    </div>\n" + "    <div class='card-content'>\n" + "        <span class='" + info.classes + "'>" + info.title + "</span>\n" + "        <p>" + info.text + "</p>\n" + "    </div>\n" +
	//"    <div class='card-action'>\n" +
	//"        <a href='#'>This is a link</a>\n" +
	//"        <a href='#'>This is a link</a>\n" +
	//"    </div>\n" +
	"</div>";
	return res;
};

jQuery.fn.addImageCard = function(info) {
    var o = $(this[0]); // It's your element
    newElement = $($.parseHTML(MaterializeJS.imageCardHtml(info)));
    newElement.attr("onclick",_emptyStringIfNull(info.onclick));
    o.append(newElement);
};

MaterializeJS.buttonHtml =
function (info) {
	if(!info) info = {};
	if(typeof info != "object"){
		toast("<b class='red-text'>Error:</b> MaterializeJS.buttonHtml - info must be an object!", 2500);
		return;
	}
	var res = "<a " + _emptyStringIfNull(info.htmlAttributes) + ">" + (info.icon_classes == null ? "" : "<i class=\"" + info.icon_classes + "\"></i>" ) + _emptyStringIfNull(info.text) + "</a>";
	return res;
};

MaterializeJS.largeButtonHtml =
function (info) {
	if(!info) info = {};
	if(typeof info != "object"){
		toast("<b class='red-text'>Error:</b> MaterializeJS.buttonHtml - info must be an object!", 2500);
		return;
	}
	var res = "<a " + _emptyStringIfNull(info.htmlAttributes) + ">" + (info.icon_classes == null ? "" : "<i class=\"" + info.icon_classes + "\"></i>" ) + _emptyStringIfNull(info.text) + "</a>";
	return res;
};

jQuery.fn.addButton = function(info, isLarge) {
    var o = $(this[0]); // It's your element
    newElement = $($.parseHTML(MaterializeJS.buttonHtml(info)));
    
    if(!isLarge) {
    	newElement.addClass("btn");
    } else {
    	newElement.addClass("btn-large");
    }
    
    newElement.addClass(_emptyStringIfNull(info.classes));
    newElement.attr("onclick",_emptyStringIfNull(info.onClick));
    newElement.width(info.width);
    o.append(newElement);
};