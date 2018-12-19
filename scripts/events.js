var hotspotclicked = false;;
var hotspot;
var touchend = false;
var touchend1 = false;
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
$(document).on("click", ".hintdoc", function (event) {
    debugger;
    if ($(this).hasClass("hintdoc")) {
        if ($(this).hasClass("expanded")) {
            $(this).removeClass("expanded")
            $(".hintcontainerdoc").hide();

            open = "close";
        }
        else {
            $(this).addClass("expanded")
            $(".hintcontainerdoc").show();

        }
    }
    if(touchend1){
        $(this).mouseout();
        touchend1 = false;
    }
    event.preventDefault();
    return;
});
$(document).on("click", ".hintlink", function (event) {
    if ($(this).k_IsDisabled()) return;
   var open = "open;"
    if ($(this).hasClass("expanded")) {
        $(this).removeClass("expanded")
        $(this).attr("aria-expanded", "false")
        $(".hintcontainer").slideUp(100);
        $(".pageheading").focus();
        open = "close";
    }
    else {
        $(this).addClass("expanded");
        $(this).attr("aria-expanded", "true");
        $(".hintcontainer").slideDown(100, function () {

            $(".hintcontainer .hintcontent").find("p:first").attr("tabindex", "-1")
            if (iOS) {
                $(".hintcontainer .hintcontent").find("p:first").attr("role", "text")
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

$(document).on("click", ".closehintdoc", function (event) {
    if ($(this).k_IsDisabled()) return;
    $(".hintdoc").removeClass("expanded")
    $(".hintcontainerdoc").hide();
   
    if (_Navigator.IsRevel()) {
        LifeCycleEvents.OnInteraction("Hint button click. Hint closed")
    }
    event.preventDefault();
    return;

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
    if ($(this).k_IsDisabled())
     return;
    _Navigator.Next();
});

$(document).on('click', ".reviewsubmit", function (event) {
    if ($(this).k_IsDisabled()) return;
    _Navigator.Next();
});


$(document).on('touchstart', ".hintlink", function (event) {
    mouseenter($(this));
    touchend = false;
});

$(document).on('touchend ', ".hintlink", function (event) {
    mouseleave($(this));
    touchend = true;
});

$(document).on('touchstart', ".hintdoc", function (event) {
    mouseenter($(this));
    touchend1 = false;
});

$(document).on('touchend ', ".hintdoc", function (event) {
    mouseleave($(this));
    touchend1 = true;
});


$(document).on('mouseenter', ".hintlink", function (event) {
    mouseenter($(this));
});

$(document).on('mouseleave', ".hintlink", function (event) {
    mouseleave($(this));
});

$(document).on('mouseenter', ".hintdoc", function (event) {
    mouseenter($(this));
});

$(document).on('mouseleave', ".hintdoc", function (event) {
    mouseleave($(this));
});
function mouseenter(_ths) {
    _ths.find(".hintlinkspan").css({ "color": "#b22222", "border-bottom": "1px solid #b22222" })
    _ths.find("path").css({ "fill": "#b22222" })
}
function mouseleave(_ths) {
    _ths.find(".hintlinkspan").css({ "color": "#047a9c", "border-bottom": "1px solid #047a9c" })
    _ths.find("path").css({ "fill": "#047a9c" })
}

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

window.addEventListener("scroll", function () {

    var currPage = _Navigator.GetCurrentPage();
    if (currPage.pageId == "p1" )
        return;
    var target = $(".header-content-dock");

    if (window.pageYOffset > $("#header-content").height() - 10) {
        var width = $("#wrapper").width();
        target.css({ "visibility": "visible", "top": "0px", "width": width + "px" })
    }
    else if (window.pageYOffset < $("#header-content").height() - 10) {
        target.css({ "visibility": "hidden", "top": "-80px"})
        $(".hintcontainerdoc").hide();
        $(".hintdoc").removeClass("expanded")
        $(".header-content-dock").find(".presentationModeFooter").hide();

    }
    if (_Navigator.GetCurrentPage().pageId == _Navigator.GetQuizPageId() || currPage.hinturl ==undefined || currPage.hinturl == "" )
    {
        $(".hintdoc").parent().hide();
    }
    else
    {
        $(".hintdoc").parent().show();
    }
    if(_Navigator.IsPresenterMode() || _Navigator.IsReviewMode())
    {
        $(".header-content-dock").find(".presentationModeFooter").show();
        $(".header-content-dock .intro-content").css({"margin-top":"30px"})
    }

}, false);


$(document).on("keyup", ".dragdiv", function (event) {
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
            $('.selected').attr("aria-pressed","false");
            $('.selected').each(function(){
                if(Macos != -1 && isSafari && !(isIpad || isIphone)){
                    $(this).attr("aria-label", $(this).attr("data-aria-label"));
                }
            })
            $('.selected').removeClass('selected').css("border", "none");
            
        }
        $(this).css("border", "cornflowerblue solid 2px");
        $(this).addClass("selected");

        $(this).attr({ "aria-pressed": "true" })
        if(Macos != -1 && isSafari && !(isIpad || isIphone)){
            $(this).attr({"aria-label":$(this).attr("data-aria-label") +" selected"})
        }
        // $('.droppable1 ').attr({ "aria-dropeffect": "move" })
        $(".droppable1,.droppable2,.droppable3 ").css("border", "cornflowerblue solid 2px");
    }


});
$(document).on("keyup", ".droppable1", function (event) {
    if (window.event) {
        key = window.event.keyCode;
    } else if (event) {
        key = event.keyCode;
    }
    if (key == 13) {
        $(this).trigger("click")
    }

});

$(document).on("click touchstart", ".droppable1", function (event) {
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

$(document).on("keyup", ".droppable2", function (event) {
    if (window.event) {
        key = window.event.keyCode;
    } else if (event) {
        key = event.keyCode;
    }
    if (key == 13) {
        $(this).trigger("click")
    }
});
$(document).on("click touchstart", ".droppable2", function (event) {
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



