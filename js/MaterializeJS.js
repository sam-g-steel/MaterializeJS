
function _emptyStringIfNull(obj) {
	try {
		return obj ? obj : "";
	} catch(ex) {

	}

	return "";
}

var MaterializeJS = {};


MaterializeJS.infoToGridHtml = function (info, options) {
    opt = {
        labelSize: 4,
        labelBold: true,
        labelClasses: "",
        rowClasses: "half-margin"
    }

    if (options) {
        if (options.labelSize && options.labelSize <= 11)
            opt.labelSize = options.labelSize;
        if (options.labelBold != undefined && typeof options.labelBold == "boolean")
            opt.labelBold = options.labelBold;
        if (options.labelClasses != undefined && typeof options.labelClasses == "string")
            opt.labelClasses = options.labelClasses;
    }

    var text = "";

    var labelTag = "b";
    var infoTag = "span";

    if (!opt.labelBold) {
        labelTag = "span";
    }


    topDom.$.each(info, function (i, o) {
        //if(i > 0) text += "<br>";

        text += "<div class='row " + opt.rowClasses + "'>";
        text += "<div class='col s" + opt.labelSize + "'><" + labelTag + " class='" + opt.labelClasses + "'>" + o.label + "</" + labelTag + "></div>";
        text += "<div class='col s" + (12 - opt.labelSize) + "'><" + infoTag + "'>" + o.info + "</" + infoTag + "></div>";
        text += "</div>";
    });

    text += "</div>";

    return text;
}

MaterializeJS.buttonHtml = function(info) {
	if (!info)
		info = {};
	if ( typeof info != "object") {
		toast("<b class='red-text'>Error:</b> MaterializeJS.buttonHtml - info must be an object!", 2500);
		return;
	}
	var res = "<a " + _emptyStringIfNull(info.htmlAttributes) + ">" + (info.icon_classes == null ? "" : "<i class=\"" + info.icon_classes + "\"></i>" ) + _emptyStringIfNull(info.text) + "</a>";
	return res;
};

MaterializeJS.imageCardHtml = function(info) {
	var res = "<div id='" + info.id + "' class='card blue-grey lighten-5 animated fadeInUp waves-effect waves-block waves-light'>\n" + "    <div class='card-image'>\n" + (info.image ? "        <img src='" + info.image + "'><hr style='margin: 0;'>\n" : "") + "    </div>\n" + "    <div class='card-content'>\n" + "        <span class='" + info.classes + "'>" + info.title + "</span>\n" + "        <p>" + info.text + "</p>\n" + "    </div>\n" +
	//"    <div class='card-action'>\n" +
	//"        <a href='#'>This is a link</a>\n" +
	//"        <a href='#'>This is a link</a>\n" +
	//"    </div>\n" +
	"</div>";
	return res;
};

MaterializeJS.plainPanelCardHtml = function(info) {
	var res = "<div class='card-panel'>" + "<span class=" + _emptyStringIfNull(info.span_classes) + ">" + _emptyStringIfNull(info.text) + " </span>" + "</div>" + "</div>";
	return res;
};

MaterializeJS.revealCardHtml = function(id, title, image, info) {
	var res = "<div id='" + id + "' class='card animated fadeInUp'>" + "<div class='card-image waves-effect waves-block waves-light'>" + ( image ? "<img class='activator' src='" + image + "'>" : "" ) + "</div>" + "<div class='card-content'>" + "<span class='card-title activator grey-text text-darken-4'>" + title + "<i class='mdi-navigation-more-vert right'></i>" + "</span>" +
	//"<p><a href='#'>This is a link</a></p>" +
	"</div>" + "<div class='card-reveal'>" + "<span class='card-title grey-text text-darken-4'>" + title + "<i class='mdi-navigation-close right'></i></span>" + "<p>" + info + "</p>" + "</div>" + "</div>";
	return res;
};


MaterializeJS.makeCardDraggable = function (element){
  
  var mc = new Hammer.Manager(element);

  mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
  mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
  
  mc.on("panstart panmove", MaterializeJS.onCardDrag);
  mc.on("panend", MaterializeJS.onCardDragEnd);
}

MaterializeJS.makeCardsDraggable = function (selector){
  
  $.each( $(selector), function( i, o ) {
    MaterializeJS.makeCardDraggable(o);
  });
}

// listen to events...
MaterializeJS.onCardDrag = function (ev) {
   // Get the events target element
  var elem = ev.target;
   
   // Make sure we work on the card instead of one of its childern
   if(!$(elem).hasClass(".card-panel")){
     elem = $(elem).closest(".card-panel")[0];
   }
  
  $(elem).setTranslate2D(ev.deltaX, ev.deltaY);
  var pos = $(elem)[0].getBoundingClientRect();
  $("#posSpan").text("X: " + pos.left + " Y: " + pos.top);
}

MaterializeJS.onCardDragEnd = function (ev) {
  $("#posSpan").text("");
  
   // Get the events target element
  var elem = ev.target;
   
   // Make sure we work on the card instead of one of its childern
   if(!$(elem).hasClass(".card-panel")){
     elem = $(elem).closest(".card-panel")[0];
   }
  
  $(elem).velocity(
    {
      translateX: ev.deltaX,
      translateY: ev.deltaY
    },
    1).velocity(
    {
      translateX: 0,
      translateY: 0
    }, 500);
  
}

///////////////////////////////////////////////////////////////////
// jQuery Plugins /////////////////////////////////////////////////


jQuery.fn.makeCardsDraggable = function(info) {
	$.each( this, function( i, o ) {
    MaterializeJS.makeCardDraggable(o);
  });
};

jQuery.fn.addButton = function(info) {
	// It's your element
	var o = $(this[0]);
	
	newElement = $($.parseHTML(MaterializeJS.buttonHtml(info)));
	newElement.addClass("btn");
	newElement.addClass(_emptyStringIfNull(info.classes));
	newElement.attr("onclick", _emptyStringIfNull(info.onClick));
	newElement.width(info.width);
	o.append(newElement);
};

jQuery.fn.addImageCard = function(info) {
	var o = $(this[0]);
	// It's your element
	newElement = $($.parseHTML(MaterializeJS.imageCardHtml(info)));
	newElement.attr("onclick", _emptyStringIfNull(info.onclick));
	o.append(newElement);
};

jQuery.fn.addPlainPanelCard = function(info) {
	var o = $(this[0]);
	// It's your element
	newElement = $($.parseHTML(MaterializeJS.plainPanelCardHtml(info)));

	newElement.addClass(_emptyStringIfNull(info.classes));
	o.append(newElement);
};

jQuery.fn.setTranslate2D = function(x, y) {
	// It's your element
	var el = $(this[0])[0];

	var value = 'translateX(' + x + 'px) translateY(' + y + 'px)';

	//el.style.webkitTransform = value;
	//el.style.mozTransform = value;
	el.style.transform = value;
	ticking = false;
};
