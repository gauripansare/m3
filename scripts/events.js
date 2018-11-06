

$(document).on("mouseover", ".qheight", function (event) {
    $(this).css({
        "font-weight": "bold"
    });
    $(this).children(".question_icon").children("span").css({
        "background-color": "#003058",
        "color": "#F9FF00"
    });

});
$(document).on("mouseout", ".qheight", function (event) {
    $(this).css({
        "font-weight": "normal"
    });
    $(this).children(".question_icon").children("span").css({
        "background-color": "#007AA2",
        "color": "#FFF"
    });
});
$(document).on("click", ".qheight", function (event) {
    $(".qheight").removeClass("optionselected");

    $(this).addClass("optionselected");

});

var hotspotclicked = false;;
var hotspot;
$(document).on("click", ".divHotSpot", function (event) {
    if (_Navigator.IsPresenterMode()) {
        return;
    }
    event.preventDefault();
    $(this).k_disable()
    if (hotspotclicked || _Navigator.IsAnswered())
        return;
    hotspotclicked = true;
    $(this).addClass("hotspotclicked")
    hotspot = $(this);
    setTimeout(function () {
        hotspotclicked = false;
        _ModuleCommon.HotspotClick(hotspot, event);

    }, 400)

});


$(document).on("dblclick", ".divHotSpotdbl", function (event) {
    if (_Navigator.IsPresenterMode()) {
        return;
    }
    if ($(this).attr("disabled") || $(this).hasClass("disabled")) {
        event.preventDefault();
        return;
    } else {
        event.preventDefault();

        $(this).k_disable()
        if (hotspotclicked || _Navigator.IsAnswered())
            return;
        $(this).addClass("hotspotclicked")
        hotspot = $(this);
        setTimeout(function () {
            hotspotclicked = false;
            _ModuleCommon.HotspotClick(hotspot, event);
        }, 400);

    }
});
$(document).on("keyup", ".divHotSpotdbl", function (event) {
    if (_Navigator.IsPresenterMode()) {
        return;
    }
    if ($(this).attr("disabled") || $(this).hasClass("disabled")) {
        event.preventDefault();
        return;
    } else {
        event.preventDefault();
        if (window.event) {
            key = window.event.keyCode;
        } else if (event) {
            key = event.keyCode;
        }
        if (key == 13) {
            $(this).k_disable()
            if (hotspotclicked || _Navigator.IsAnswered())
                return;
            $(this).addClass("hotspotclicked")
            hotspot = $(this);
            setTimeout(function () {
                hotspotclicked = false;
                _ModuleCommon.HotspotClick(hotspot, event);
            }, 400);
        }

    }
});

$(document).on("click", "#linkprevious", function (event) {
    if ($(this).k_IsDisabled()) return;
    _Navigator.Prev();
});
$(document).on("click", "#linknext", function (event) {
    if ($(this).k_IsDisabled()) return;
    _Navigator.Next();
});

$(document).on("click", ".hintlink", function (event) {
    if ($(this).k_IsDisabled()) return;
   var open = "open;"
    if ($(this).hasClass("expanded")) {
        $(".hintlink").removeClass("expanded")
        $(".hintlink").attr("aria-expanded", "false")
        $(".hintcontainer").slideUp(100);
        $(".pageheading").focus();
        open = "close";
    }
    else {
        $(".hintcontainer").slideDown(100, function () {
            $(".hintlink").addClass("expanded");
            $(".hintlink").attr("aria-expanded", "true");  
            $(".hintcontainer .hintcontent").find("p:first").attr("tabindex","-1")
            if(iOS)
            {
                $(".hintcontainer .hintcontent").find("p:first").attr("role","text")
            }
            $(".hintcontainer .hintcontent").find("p:first").focus(); 
        });
    }
    if (_Navigator.IsRevel()) {
        LifeCycleEvents.OnInteraction("Hint button click. Hint " + open)
    }
     if(touchend){
        $(this).mouseout();
        touchend = false;
    }
   
});
$(document).on("click", ".closehintlink", function (event) {
    if ($(this).k_IsDisabled()) return;
    $(".hintlink").removeClass("expanded")
    $(".hintlink").attr("aria-expanded", "false")
    $(".hintcontainer").slideUp(100,function(){$("h2.pageheading").focus();});
    if (_Navigator.IsRevel()) {
        LifeCycleEvents.OnInteraction("Hint button click. Hint closed")
    }

});

$(document).on("keydown", "input.EmbededElement", function (event) {
    if ($(this).k_IsDisabled()) return;
    if ($(this).attr("disabled") || $(this).hasClass("disabled")) {
        event.preventDefault();
        return;
    }
    if (window.event) {
        key = window.event.keyCode;
    } else if (event) {
        key = event.keyCode;
    }
    if (key == 13) {
        _ModuleCommon.InputEnter($(this));
    }
});

$(window).resize(function () {
    _ModuleCommon.OrientationChange();
});



$(document).on('click', ".activityimg", function (event) {
    if ($(".divHotSpot").hasClass("disabled") || $(".divHotSpot").length == 0)
        return;
    _ModuleCommon.AddEditPropertiesClick(event);
});


$(document).on('click', ".startbtn", function (event) {
    if ($(this).k_IsDisabled()) return;
    _Navigator.Next();
});
$(document).on('click', ".reviewsubmit", function (event) {
    if ($(this).k_IsDisabled()) return;
    _Navigator.Next();
});

var touchend = false;
$(document).on('touchstart', ".hintlink", function (event) {
    mouseenter();
    touchend = false;
});
$(document).on('touchend ', ".hintlink", function (event) {
    mouseleave();
    touchend = true;
});


$(document).on('mouseenter', ".hintlink", function (event) {
    mouseenter();
});

$(document).on('mouseleave', ".hintlink", function (event) {
    mouseleave();
});

function mouseenter(){
    $(".hintlink .hintlinkspan").css({ "color": "#b22222", "border-bottom": "1px solid #b22222" })
    $(".hintlink").find("path").css({ "fill": "#b22222" })    
}
function mouseleave(){
    $(".hintlink .hintlinkspan").css({ "color": "#047a9c", "border-bottom": "1px solid #047a9c" })
    $(".hintlink").find("path").css({ "fill": "#047a9c" })
}


$(document).on("mouseup", ".dragdiv", function (event) {
    if (window.event) {
        key = window.event.keyCode;
    } else if (event) {
        key = event.keyCode;
    }
    if (key == 13) {
        $(this).trigger("click")
    }

});
$(document).on("click", ".dragdiv", function (event) {

    if ($(this).attr("disabled") || $(this).hasClass("disabled")) {
        $(".droppable1,.droppable2,.droppable3 ").css({
            "border": "none"
        });
        event.preventDefault();
        return;
    } else {
        if ($('.selected').length > 0) {
            $('.selected').removeClass('selected').css("border", "none");
        }
        $(this).css("border", "cornflowerblue solid 2px");
        $(this).addClass("selected");

        $(this).attr({ "aria-pressed": "true" })
        // $('.droppable1 ').attr({ "aria-dropeffect": "move" })
        $(".droppable1,.droppable2,.droppable3 ").css("border", "cornflowerblue solid 2px");
    }


});
$(document).on("mousedown", ".droppable1", function (event) {
    if (window.event) {
        key = window.event.keyCode;
    } else if (event) {
        key = event.keyCode;
    }
    if (key == 13) {
        $(this).trigger("click")
    }

});

$(document).on("click", ".droppable1", function (event) {
    if( $('.selected').length == 0)
    return;
    var pagedata = _Navigator.GetCurrentPage();
    $('.selected').addClass("dropped");
    var draggable = $('.selected');
    if (pagedata.pageId == "p8") {

        _ModuleCommon.DropImage(draggable, "draggable1");
        _ModuleCommon.AddDragReviewData(draggable, true,$(this));

    } else {
        if (draggable.hasClass('draggable1')) {

            _ModuleCommon.DropTwoImage(draggable, "draggable1");
            _ModuleCommon.AddDragReviewData(draggable, true,$(this));

        } else {
            draggable.removeClass("dropped").css("border", "none");
            draggable.removeClass("selected");
            _ModuleCommon.AddDragReviewData(draggable, false);

        }
    }
    $('.selected').attr("aria-pressed", "false")
    $('.selected').removeClass('selected');
    $(".ui-droppable,.disabled").css("border", "none");


});

$(document).on("mousedown", ".droppable2", function (event) {
    if (window.event) {
        key = window.event.keyCode;
    } else if (event) {
        key = event.keyCode;
    }
    if (key == 13) {
        $(this).trigger("click")
    }
});
$(document).on("click", ".droppable2", function (event) {
    if( $('.selected').length == 0)
        return;
    $('.selected').addClass("dropped");
    var draggable = $('.selected');
    if (draggable.hasClass('draggable2')) {

        _ModuleCommon.DropTwoImage(draggable, "draggable2");
        _ModuleCommon.AddDragReviewData(draggable, true,$(this));

    } else {
        draggable.removeClass("dropped").css("border", "none");
        _ModuleCommon.AddDragReviewData(draggable, false);
    }
    $('.selected').attr("aria-pressed", "false")
    $('.selected').removeClass('selected');
    $('.droppable2 ').attr({ "aria-dropeffect": "none" })
    $(".ui-droppable").css("border", "none");
    $(".disabled").css("border", "none");

});

$(document).on("change", ".assessmentradio", function (event) {
    if ($(this).k_IsDisabled()) return;
    if ($(this).hasClass("disabled"))
        return;
    $(".assessmentSubmit").k_enable();
});
$(document).on("click", ".assessmentSubmit", function (event) {
    if ($(this).k_IsDisabled()) return;
    if (_Navigator.IsRevel()) {
        LifeCycleEvents.OnSubmit();
    }
    gRecordData.Questions[currentQuestionIndex].UserSelectedOptionId = $("input[type='radio']:checked").attr("id");
    gRecordData.Questions[currentQuestionIndex].IsAnswered = true;
    _Navigator.GetBookmarkData();
    _Navigator.Next();
});

$(document).on('click', ".inputcircle", function (event) {
    if ($(this).k_IsDisabled()) return;
    $(this).next(".inpputtext").trigger("click");
});



window.onload = function () {
    _ScormUtility.Init();
}

window.onunload = function () {
    _ScormUtility.End();
}

