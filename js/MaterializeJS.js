var MJS = {};

MJS.fakeGuid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

function _emptyStringIfNull(obj) {
    try {
        return obj ? obj : "";
    } catch (ex) {

    }

    return "";
}

MJS.circularPreloaderHtml = function () {
    return '<div class="preloader-wrapper active"><div class="spinner-layer spinner-red-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';
};

MJS.infoToGridHtml = function (info, options) {
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

    $.each(info, function (i, o) {
        //if(i > 0) text += "<br>";

        text += "<div class='row " + opt.rowClasses + "'>";
        text += "<div class='col s" + opt.labelSize + "'><" + labelTag + " class='" + opt.labelClasses + "'>" + o.label + "</" + labelTag + "></div>";
        text += "<div class='col s" + (12 - opt.labelSize) + "'><" + infoTag + "'>" + o.info + "</" + infoTag + "></div>";
        text += "</div>";
    });

    text += "</div>";

    return text;
};

MJS.buttonHtml = function (info) {
    if (!info)
        info = {};
    if (typeof info != "object") {
        toast("<b class='red-text'>Error:</b> MaterializeJS.buttonHtml - info must be an object!", 2500);
        return;
    }
    var res = "<a " + _emptyStringIfNull(info.htmlAttributes) + ">" + (info.icon_classes == null ? "" : "<i class=\"" + info.icon_classes + "\"></i>") + _emptyStringIfNull(info.text) + "</a>";
    return res;
};

MJS.imageCardHtml = function (info) {
    var res = "<div id='" + info.id + "' class='card blue-grey lighten-5 animated fadeInUp waves-effect waves-block waves-light'>\n" + "    <div class='card-image'>\n" + (info.image ? "        <img src='" + info.image + "'><hr style='margin: 0;'>\n" : "") + "    </div>\n" + "    <div class='card-content'>\n" + "        <span class='" + info.classes + "'>" + info.title + "</span>\n" + "        <p>" + info.text + "</p>\n" + "    </div>\n" +
	//"    <div class='card-action'>\n" +
	//"        <a href='#'>This is a link</a>\n" +
	//"        <a href='#'>This is a link</a>\n" +
	//"    </div>\n" +
	"</div>";
    return res;
};

MJS.plainPanelCardHtml = function (info) {
    var res = "<div class='card-panel'>" + "<span class=" + _emptyStringIfNull(info.span_classes) + ">" + _emptyStringIfNull(info.text) + " </span>" + "</div>" + "</div>";
    return res;
};

MJS.revealCardHtml = function (id, title, image, info) {
    var res = "<div id='" + id + "' class='card animated fadeInUp'>" + "<div class='card-image waves-effect waves-block waves-light'>" + (image ? "<img class='activator' src='" + image + "'>" : "") + "</div>" + "<div class='card-content'>" + "<span class='card-title activator grey-text text-darken-4'>" + title + "<i class='mdi-navigation-more-vert right'></i>" + "</span>" +
	//"<p><a href='#'>This is a link</a></p>" +
	"</div>" + "<div class='card-reveal'>" + "<span class='card-title grey-text text-darken-4'>" + title + "<i class='mdi-navigation-close right'></i></span>" + "<p>" + info + "</p>" + "</div>" + "</div>";
    return res;
};

MJS.makeCardDraggable = function (element) {

    var mc = new Hammer.Manager(element);

    mc.add(new Hammer.Pan({
        threshold: 0,
        pointers: 0
    }));
    mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));

    mc.on("panstart panmove", MaterializeJS.onCardDrag);
    mc.on("panend", MaterializeJS.onCardDragEnd);
};

MJS.makeCardsDraggable = function (selector) {

    $.each($(selector), function (i, o) {
        MaterializeJS.makeCardDraggable(o);
    });
};

// listen to events...
MJS.onCardDrag = function (ev) {
    // Get the events target element
    var elem = ev.target;

    // Make sure we work on the card instead of one of its childern
    if (!$(elem).hasClass(".card-panel")) {
        elem = $(elem).closest(".card-panel")[0];
    }

    $(elem).setTranslate2D(ev.deltaX, ev.deltaY);
    var pos = $(elem)[0].getBoundingClientRect();
    $("#posSpan").text("X: " + pos.left + " Y: " + pos.top);
};

MJS.onCardDragEnd = function (ev) {
    $("#posSpan").text("");

    // Get the events target element
    var elem = ev.target;

    // Make sure we work on the card instead of one of its children
    if (!$(elem).hasClass(".card-panel")) {
        elem = $(elem).closest(".card-panel")[0];
    }

    $(elem).velocity({
        translateX: ev.deltaX,
        translateY: ev.deltaY
    }, 1).velocity({
        translateX: 0,
        translateY: 0
    }, 500);
};


///////////////////////////////////////////////////////////////////
// MJS List Class /////////////////////////////////////////////////

MJS.list = function () {
    this.items = [];
    this.selectionStack = []; // For multi-list
    this.textField = "text";
    this.valueField = "value";
    this.listIndex = 0;
    this.newListIndex = 0;
    this.loading = false;
    this.multiList = false;
    this.options = {
        ID: "MJS_list" + MJS.fakeGuid(),
        onSelect: null,
        selectedClasses: "grey white-text",
        itemClasses: "white grey-text text-darken-2"
    };
    this._element = null;
    this.onSelect = null;
};

// Todo List Label, and ID options

MJS.list.prototype.help = function () {
    var text = "items format: \"[{text, value}, ...]\" for a single list\n";
    text += "items format: \"[{topic: \"\", items: [{text, value}, ...]}, ...]\" for a multi list";
    console.log(text);
    return text;
};

MJS.list.prototype.getElement = function () {
    return this._element;
};

MJS.list.prototype.getHeaderElement = function () {
    return this.getElement().children(".header");
};

MJS.list.prototype.getItemsElement = function () {
    return this._element.children(".collection");
};

MJS.list.prototype.clearSelection = function (text) {
    this.getItemsElement().children().removeClass("active");
    this.getItemsElement().children().removeClass(this.options.selectedClasses);
    this.getItemsElement().children().addClass(this.options.itemClasses);
};

MJS.list.prototype.selectFirstItem = function (text) {
    this.getItemsElement().children().first().click();
};

MJS.list.prototype.selectItemByText = function (text) {
    this.getItemsElement().children().filter(function () {
        return $(this).text() == text
    }).click();
};

MJS.list.prototype.getSelectedElement = function () {
    return this.getItemsElement().children(".active");
};

MJS.list.prototype.getSelectedText = function () {
    return this.getSelectedElement().text();
};

MJS.list.prototype.getSelectedValue = function () {
    return this.getSelectedElement().data().value;
};

// Todo: add index parameter
MJS.list.prototype.setItemsData = function (data) {
    if (this.multiList) {
        this.items[this.listIndex].items = data;
    } else {
        this.items = data;
    }
};

// collection-header
MJS.list.prototype.refreshElements = function () {
    var list = this;
    list.getItemsElement().velocity("stop", true);
    list.getItemsElement().velocity("transition.fadeOut", {
        stagger: 100,
        duration: 300,
        complete: function () {
            list.buildItems();
            list.buildHeader();
            list.getItemsElement().velocity("transition.fadeIn", {
                stagger: 100,
                duration: 300
            });
        }
    });

}

// collection-header
MJS.list.prototype.buildHeader = function () {
    if (!this.multiList) return;

    var list = this;
    var element = this.getElement();
    var header = this.getHeaderElement();

    if (!header.length) {
        header = $("<a href='#!' class='collection-header'></a>");
        element.prepend(header);
    }

    header.empty();

    $.each(this.items, function (i, o) {
        if (i < list.listIndex) {
            var element = $("<a class='grey-text text-darken-2' href='#'>" + list.selectionStack[i].text() + "</a>");
            element.click(function () {
                var list = $(this).parent().parent().data().MJS_Source;
                var index = $(this).parent().children().index(this);

                list.listIndex = index;
                list.newListIndex = list.listIndex;
                list.selectionStack.splice(index, Number.MAX_VALUE);

                if (list.onSelect) list.onSelect();

                list.refreshElements();
            });
            header.append(element);
            header.append(" / ");
        } else if (i == list.listIndex) {
            header.append("<b>" + o.topic + "</b>");
        }
    });
}

MJS.list.prototype.buildItems = function () {
    var list = this;
    var items;

    // Remove any old items
    list.getItemsElement().empty();

    // If loading 
    if (this.loading) {
        list.getItemsElement().append(
            '<div class="col s12 center" style="padding: .5em;" >' +
            MJS.circularPreloaderHtml() +
            '</div>'
        );
        return;
    }

    if (!this.multiList) {
        items = this.items;
    }
    else {
        items = this.items[this.listIndex].items;
        if (this.items[this.listIndex].textField)  this.textField  = this.items[this.listIndex].textField;
        if (this.items[this.listIndex].valueField) this.valueField = this.items[this.listIndex].valueField;
    }

    $.each(items, function (i, o) {
        var itemElement = $("<a href='#!' class='collection-item waves-effect'>" + o[list.textField] + "</a>");
        itemElement.data("value", o[list.valueField]);
        itemElement.click(function () {
            var o = $(this);
            var list = o.parent().parent().data().MJS_Source;

            //
            o.siblings().removeClass("active");
            o.siblings().removeClass(list.options.selectedClasses);
            o.siblings().addClass(list.options.itemClasses);

            //
            o.removeClass(list.options.itemClasses);
            o.addClass("active");
            o.addClass(list.options.selectedClasses);

            list.newListIndex = list.listIndex + 1;

            if (list.onSelect) list.onSelect();

            if (list.multiList && 1 + list.listIndex < list.items.length) {
                list.selectionStack.push(list.getSelectedElement());

                list.listIndex++;

                list.refreshElements();
            }
        });
        list.getItemsElement().append(itemElement);
    });
    list.clearSelection();
};

MJS.list.prototype.infoToList = function (info, options) {
    if (options) {
        if (options.selectedClasses != undefined && typeof options.selectedClasses == "string")
            this.options.selectedClasses = options.selectedClasses;
        if (options.itemClasses != undefined && typeof options.itemClasses == "string")
            this.options.itemClasses = options.itemClasses;
    }

    if (info.items) {
        this.items = info.items;
        this.multiList = false;
    }
    else if (info.length) {
        this.items = info;
        this.multiList = true;
    }

    // Create list element
    this._element = $("<div><div class='header'></div><div class='collection with-header'></div></div>");
    this._element.data("MJS_Source", this);

    this.buildHeader();
    this.buildItems();

    this.clearSelection();
    return this.getElement();
};

///////////////////////////////////////////////////////////////////
// jQuery Plug-ins /////////////////////////////////////////////////

jQuery.fn.makeCardsDraggable = function (info) {
    $.each(this, function (i, o) {
        MaterializeJS.makeCardDraggable(o);
    });
};

jQuery.fn.addButton = function (info) {
    // It's your element
    var o = $(this[0]);

    newElement = $($.parseHTML(MaterializeJS.buttonHtml(info)));
    newElement.addClass("btn");
    newElement.addClass(_emptyStringIfNull(info.classes));
    newElement.attr("onclick", _emptyStringIfNull(info.onClick));
    newElement.width(info.width);
    o.append(newElement);
};

jQuery.fn.addImageCard = function (info) {
    var o = $(this[0]);
    // It's your element
    newElement = $($.parseHTML(MaterializeJS.imageCardHtml(info)));
    newElement.attr("onclick", _emptyStringIfNull(info.onclick));
    o.append(newElement);
};

jQuery.fn.addPlainPanelCard = function (info) {
    var o = $(this[0]);
    // It's your element
    newElement = $($.parseHTML(MaterializeJS.plainPanelCardHtml(info)));

    newElement.addClass(_emptyStringIfNull(info.classes));
    o.append(newElement);
};

jQuery.fn.setTranslate2D = function (x, y) {
    // It's your element
    var el = $(this[0])[0];

    var value = 'translateX(' + x + 'px) translateY(' + y + 'px)';

    //el.style.webkitTransform = value;
    //el.style.mozTransform = value;
    el.style.transform = value;
    ticking = false;
};

jQuery.fn.MaterializeJS_Data = function (info) {
    // Get the jQuery element
    var o = $(this[0]);

    // If the user passes data commit it to the element
    if (info) {
        o.data("MaterializeJS", info);
    }

        // Otherwise return the data from the element to the user
    else {
        var data = o.data("MaterializeJS");
        return data ? data : {};
    }
};

jQuery.fn.openNewDialogue = function (info) {
    // Get the jQuery element
    var o = $(this[0]);

    // Create div for the dialogue
    var newElement = $("<div style='position: absolute; z-index: 100;'></div>");

    // Add styling to the div
    // newElement.addClass("card-panel z-depth-3");
    newElement.height(info.fillTarget.height());
    newElement.width(info.fillTarget.width());
    newElement.css("background-color", o.css("background-color"));
    //newElement.css("border-radius", "500px");
    newElement.css("opacity", "0");
    newElement.css("margin", "0px");
    newElement.css("top", (o.offset().top + o.height() * 0.5 - newElement.height() * 0.5) + "px");
    newElement.css("left", (o.offset().left + o.width() * 0.5 - newElement.width() * 0.5) + "px");

    newElement.velocity({
        "scale": "0"
    }, 0);
    //newElement.velocity("finish");

    // Get MaterializeJS Data for the fill target
    var fData = info.fillTarget.MaterializeJS_Data();
    //debugger
    if (fData.currentDialogue) {
        fData.currentDialogue.closeDialogue(info);
    }

    // Add new div to the DOM
    $("body").append(newElement);
    if (info.onStart && typeof info.onStart == "function") {
        info.onStart(newElement);
    }

    // Set MaterializeJS Data for the fill target
    fData.currentDialogue = newElement;
    info.fillTarget.MaterializeJS_Data(fData);

    //
    var mData = newElement.MaterializeJS_Data();
    mData.origonalOffset = newElement.offset();
    newElement.MaterializeJS_Data(mData);

    newElement.velocity({
        top: info.fillTarget.offset().top + "px",
        left: info.fillTarget.offset().left + "px",
        opacity: 2,
        scale: 1
    }, 300, function () {
        newElement.addClass("card-panel z-depth-3");
    });
};

jQuery.fn.closeDialogue = function (info) {
    // It's your element
    var o = $(this[0]);

    var mData = o.MaterializeJS_Data();
    var returnOffset = mData.origonalOffset;

    o.removeClass("card-panel z-depth-3");

    // Get MaterializeJS Data for the fill target
    var fData = info.fillTarget.MaterializeJS_Data();

    if (fData.currentDialogue == o) {
        fData.currentDialogue = null;
        // Set MaterializeJS Data for the fill target
        info.fillTarget.MaterializeJS_Data(fData);
    }

    o.velocity({
        scale: "0",
        top: returnOffset.top + "px",
        left: returnOffset.left + "px"
    }, {
        duration: 300,
        /* Log all the animated divs. */
        complete: function () {
            o.remove();
        }
    });
};

MaterializeJS = MJS;