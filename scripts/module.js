jQuery.fn.extend({
    k_enable: function () {
        return this.removeClass('disabled').attr("aria-disabled", "false").removeAttr("disabled");
    },
    k_disable: function () {
        return this.addClass('disabled').attr("aria-disabled", "true").attr("disabled", "disabled");
    },
    k_IsDisabled: function () {
        if (this.hasClass('disabled')) { return true; } else { return false; }
    }
});
var _ModuleCommon = (function () {
    var reviewData = [];
    return {
        EnableNext: function () {
            var currentPageData = _Navigator.GetCurrentPage();
            if (currentPageData.nextPageId != undefined && currentPageData.nextPageId != "") {
                $("#linknext").k_enable();
            }
        },
        GetPageReviewData: function () {
            var currentPageData = _Navigator.GetCurrentPage();
            if (reviewData != undefined && reviewData.length > 0) {
                for (var i = 0; i < reviewData.length; i++) {
                    if (reviewData[i].pageId == currentPageData.pageId) {
                        return reviewData[i];
                    }
                }
            }

        },
        GetPageDetailData: function () {
            var currentPageData = _Navigator.GetCurrentPage();
            var pageData = _PData[currentPageData.pageId];
            return pageData;
        },
        ShowFeedbackReviewMode: function () {
            var pageData = this.GetPageDetailData();
            var fdkurl = "";
            if (pageData != undefined) {
                if (pageData.EmbedSettings != undefined) {
                    fdkurl = pageData.EmbedSettings.feedbackurl;
                }
                else {
                    if (pageData.ImageHotSpots != undefined) {
                        for (var i = 0; i < pageData.ImageHotSpots.Hotspots.length; i++) {
                            fdkurl = pageData.ImageHotSpots.Hotspots[i].feedbackurl;
                            break;
                        }
                    }
                }
                fdkurl = _Settings.dataRoot + "feedbackdata/" + fdkurl;
                $("#div_feedback").show();
                $("#div_feedback").css("display", "inline-block");
                $("#div_feedback .div_fdkcontent").load(fdkurl, function () {
                    //this.SetFeedbackTop()
                    $('html,body').animate({ scrollTop: 0 }, 0, function () { });
                });
            }
        },
        DisplayInstructorReviewMode: function () {
            $(".reviewDiv").remove();
            var pageDetailData = this.GetPageDetailData();
            var pagedata = _Navigator.GetCurrentPage();
            if(["p8","p13","p15","p21","p27"].indexOf(pagedata.pageId) >=0)
            {
                if(pagedata.pageId == "p8")
                {
                    this.DisplayDrangAndDropInReviewMode();
                }
                if(pagedata.pageId == "p13" || pagedata.pageId == "p21")
                {
                    this.DisplayDrangAndDropInReviewMode1();
                }
                if(pagedata.pageId == "p15")
                {
                    this.DisplayDrangAndDropInReviewMode3();
                }
                if(pagedata.pageId == "p27")
                {
                    this.DisplayDrangAndDropInReviewMode2();
                }
                this.DragandDropFeedbackReviewMode();
                return
            }
            if (pageDetailData != undefined && pageDetailData.EmbedSettings != undefined) {
                
                this.InstructorReviewModeForTextEntry();
            }
            else {
                var reviewData = this.GetPageReviewData();
                if (reviewData != undefined && reviewData.Positions != undefined && reviewData.Positions.length > 0) {
                    for (var i = 0; i < reviewData.Positions.length; i++) {
                        var posObj = reviewData.Positions[i];
                        var appendImage = $(".wrapperimage");
                        var ht = appendImage.height();
                        if(ht < 597)
                        ht = 597;
                        while ((posObj.posY + 40) > ht) {
                            posObj.posY = posObj.posY - 2;
                        }
                        if (posObj.isCorrect) {
                            var _div = "<div class='reviewDiv Correct' style='z-index:5;width:39px;height:39px;position:absolute;left:" + posObj.posX + "px;top:" + posObj.posY + "px;'><img src='assets/images/review-correct.png' style='width:39px;height:35px;' /></div>";
                            appendImage.append(_div);


                        } else {
                            var _divI = "<div class='reviewDiv InCorrect' style='z-index:5;width:39px;height:35px;position:absolute;left:" + posObj.posX + "px;top:" + posObj.posY + "px;'><img src='assets/images/review-incorrect.png' style='width:39px;height:35px;' /></div>";

                            appendImage.append(_divI);
                        }
                    }
                }
            }
            this.ShowFeedbackReviewMode();
            $(".divHotSpotCommon").addClass("disabled")

        },
        InstructorReviewModeForTextEntry: function () {
            $(".EmbededElement").hide();
            var reviewData = this.GetPageReviewData();
            var pageDetailData = this.GetPageDetailData();
            if (reviewData != undefined && reviewData.textEntry != undefined && reviewData.textEntry.length > 0) {
                
                for (i = 0; i < reviewData.textEntry.length; i++) {
                    if (reviewData.textEntry[i] != undefined && reviewData.textEntry[i] != "") {
                        var tEntry = reviewData.textEntry[i].trim().toLowerCase();
                        if (pageDetailData.EmbedSettings.validatearray.indexOf(tEntry) >= 0) {
                            if (reviewData.isCorrect && i == 0) {
                                if(_Navigator.GetCurrentPage().pageId == "p6" &&  /\sSafari\//.test(navigator.userAgent) )
                                {
                                    $(".textentryreview1").html("<span class='OpenSansFont greenspan' style='font-weight:bold;font-size: 11px; '>" + reviewData.textEntry[i] + "</span>")

                                }
                                else
                                {
                                    $(".textentryreview1").html("<span class='OpenSansFont greenspan' style='font-weight:bold;font-size: 13px; '>" + reviewData.textEntry[i] + "</span>")
                                }
                            }
                            else {
                                $(".textentryreview2").html("<span class='OpenSansFont greenspan'  style='font-weight:bold;font-size: 13px;padding-left:5px; '>" + reviewData.textEntry[i] + "</span>");
                                $(".textentryreview2").show();
                            }
                        }
                        else {
                            $(".textentryreview1").html("<span class='OpenSansFont redspan'  style='font-weight:bold;font-size: 13px; '>" + reviewData.textEntry[i] + "</span>")
                        }
                    }

                }
                $(".textentryreview1").show();
            }
        },
        DisplayUserReviewMode: function () {
            $(".reviewDiv").remove();
            var pageDetailData = this.GetPageDetailData();
            if (pageDetailData != undefined && pageDetailData.EmbedSettings != undefined) {
                this.DisplayReviewModeForTextEntry();
            }
            else {
                var reviewData = this.GetPageReviewData();
                if (reviewData != undefined && reviewData.Positions != undefined && reviewData.Positions.length > 0) {
                    var posObj = reviewData.Positions[reviewData.Positions.length - 1];
                    var appendImage = $(".wrapperimage");
                    var ht = appendImage.height();
                    while ((posObj.posY + 40) > ht) {
                        posObj.posY = posObj.posY - 2;
                    }
                    if (posObj.isCorrect) {
                        var _div = "<div class='reviewDiv Correct' style='z-index:5;width:39px;height:39px;position:absolute;left:" + posObj.posX + "px;top:" + posObj.posY + "px;'><img src='assets/images/review-correct.png' style='width:39px;height:35px;' /></div>";
                        appendImage.append(_div);


                    } else {
                        var _divI = "<div class='reviewDiv InCorrect' style='z-index:5;width:39px;height:35px;position:absolute;left:" + posObj.posX + "px;top:" + posObj.posY + "px;'><img src='assets/images/review-incorrect.png' style='width:39px;height:35px;' /></div>";

                        appendImage.append(_divI);
                    }

                }
            }
            this.ShowFeedbackReviewMode();


        },
        DisplayReviewModeForTextEntry: function () {
            $(".EmbededElement").hide();
            var reviewData = this.GetPageReviewData();
            var pageDetailData = this.GetPageDetailData();
            if (reviewData != undefined && reviewData.textEntry != undefined && reviewData.textEntry.length > 0) {
               
                if (reviewData.textEntry[reviewData.textEntry.length - 1] != undefined && reviewData.textEntry[reviewData.textEntry.length - 1] != "") {
                    var tEntry = reviewData.textEntry[reviewData.textEntry.length - 1].trim().toLowerCase();
                    if (pageDetailData.EmbedSettings.validatearray.indexOf(tEntry) >= 0) {
                        $(".textentryreview1").html("<span class='OpenSansFont' style='color:green;font-weight:bold;font-size: 13px; '>" + reviewData.textEntry[reviewData.textEntry.length - 1] + "</span>")
                    }

                }
                $(".textentryreview1").show();
            }
        },
        AddHotspotClick: function (hotspotObj, event) {

            //$(".divHotSpot").remove();
            if (_Navigator.IsAnswered()) {
                return;
            }
            var imgObj = $(".activityimg");
            var posX = imgObj.offset().left;
            var posY = imgObj.offset().top;
            var found = false;

            var rposX;
            var rposY;
            if (event != undefined && event.pageX != undefined) {
                rposX = (event.pageX - posX);
                rposY = (event.pageY - posY);
            }
            if(rposX <0 || rposY <0){//gp if module is attmpted using accessibility
                rposX = hotspotObj.position().left + 20;
                rposY = hotspotObj.position().top + 20;
            }
            var currentPageData = _Navigator.GetCurrentPage();
            var page = this.GetPageDetailData();
            if (page.EmbedSettings != undefined)
            {
                return;
            }
            for (var r = 0; r < reviewData.length; r++) {
                if (reviewData[r].pageId == currentPageData.pageId) {
                    var sameclick = false;
                    var posindex = 0;
                    if (reviewData[r].Positions != undefined) {
                        for (var i = 0; i < reviewData[r].Positions.length; i++) {
                            if (reviewData[r].Positions[i].posX == rposX && reviewData[r].Positions[i].posY == rposY) {
                                sameclick = true;
                                posindex = i;
                                break;
                            }
                        }
                        if (!sameclick) {
                            var position = { posX: rposX, posY: rposY, isCorrect: true };
                            if (reviewData[r].Positions.length < 3) {
                                reviewData[r].Positions.push(position);
                            }
                            else {
                                reviewData[r].Positions.splice(0, 1);
                                reviewData[r].Positions.push(position);
                            }
                        }
                        else {
                            if (reviewData[r].Positions[posindex].isCorrect == undefined || reviewData[r].Positions[posindex].isCorrect == false) {
                                reviewData[r].Positions[posindex].isCorrect = true;
                            }
                        }
                    }
                    else {
                        var position = { posX: rposX, posY: rposY, isCorrect: true };
                        reviewData[r].Positions = [position]
                    }

                    found = true;
                }
            }

            if (!found) {
                var _obj = {};
                _obj.pageId = currentPageData.pageId;
                var position = { posX: rposX, posY: rposY, isCorrect: true };
                _obj.Positions = [position]
                reviewData.push(_obj);

            }

        },
        AddEditPropertiesClick: function (event) {
            if (_Navigator.IsAnswered()) {
                return;
            }
            var pageDetailData = this.GetPageDetailData();
            if (pageDetailData.EmbedSettings != undefined)
                return;
            var imgObj = $(".activityimg");
            var posX = imgObj.offset().left;
            var posY = imgObj.offset().top;
            var found = false;

            var rposX = (event.pageX - posX);
            var rposY = (event.pageY - posY);
            if (isNaN(rposX) || isNaN(rposY))
                return;

            var currentPageData = _Navigator.GetCurrentPage();
            for (var r = 0; r < reviewData.length; r++) {
                if (reviewData[r].pageId == currentPageData.pageId) {
                    var sameclick = false;
                    if (reviewData[r].Positions != undefined) {
                        for (var i = 0; i < reviewData[r].Positions.length; i++) {
                            if (reviewData[r].Positions[i].posX == rposX && reviewData[r].Positions[i].posy == rposY) {
                                sameclick = true;
                                break;
                            }
                        }
                        if (!sameclick) {
                            var position = { posX: rposX, posY: rposY, isCorrect: false };
                            if (reviewData[r].Positions.length < 3) {
                                reviewData[r].Positions.push(position);
                            }
                            else {
                                reviewData[r].Positions.splice(0, 1);
                                reviewData[r].Positions.push(position);
                            }
                        }
                    }
                    else {
                        var position = { posX: rposX, posY: rposY, isCorrect: false };
                        reviewData[r].Positions = [position]
                    }

                    found = true;
                }
            }

            if (!found) {
                var _obj = {};
                _obj.pageId = currentPageData.pageId;
                var position = { posX: rposX, posY: rposY, isCorrect: false };
                _obj.Positions = [position]
                reviewData.push(_obj);
            }

        },
        DisplayFolderName: function(basepageid) {
            var fname="";
            var pagereviewdata
            if (reviewData != undefined && reviewData.length > 0) {
                for (var i = 0; i < reviewData.length; i++) {
                    if (reviewData[i].pageId == basepageid) {
                        pagereviewdata = reviewData[i];
                        break;
                        
                    }
                }
            }
            if(pagereviewdata.textEntry !=undefined)
            {
                fname = pagereviewdata.textEntry[pagereviewdata.textEntry.length - 1]
            }
            
            var cls = basepageid == "p10" ? "input-url2" : "input-url4";
            $("."+cls).text(fname)
        },
        OnPageLoad: function () {
            this.LoadHotSpot();
            this.ApplycontainerWidth();
            $("#div_feedback").hide();
            if(this.GetPageDetailData()!=undefined && this.GetPageDetailData().EmbedSettings !=undefined){
                $("input[type='text']").attr("id", this.GetPageDetailData().EmbedSettings.id)
            }
            var currentPageData = _Navigator.GetCurrentPage();
             if (currentPageData.pageId == "p11" || currentPageData.pageId == "p12"|| currentPageData.pageId == "p19" || currentPageData.pageId == "p20") {
                 var basepageid = currentPageData.pageId == "p11" || currentPageData.pageId == "p12" ? "p10" :"p18";
              this.DisplayFolderName(basepageid);
               
            }
            
            if (_Navigator.IsAnswered()) {
                
                this.DisplayInstructorReviewMode();
            }
        },
        
        LoadHotSpot: function () {
            var currentPageData = _Navigator.GetCurrentPage();
            //ATUL
            if (currentPageData.pageId == "p8" && !_Navigator.IsAnswered()) {
                this.DragImages();
            }
            if ( !_Navigator.IsAnswered() && (currentPageData.pageId == "p13" || currentPageData.pageId == "p15" || currentPageData.pageId == "p21" || currentPageData.pageId == "p27")) {
                if(currentPageData.pageId == "p27")
                {
                    this.DragTwoImage(true);
                }
                else
                {
                this.DragTwoImage();
                }
            }
            var pageData = _PData[currentPageData.pageId];

            if (pageData != undefined) {

                var hotspotdata = pageData.ImageHotSpots;
                var htmlForDivHotspotImage = "";
                if (pageData.ImageHotSpots != undefined) {
                    for (var i = 0; i < hotspotdata.Hotspots.length; i++) {
                        var currImg = $("img")
                        var orw = currImg.width();
                        var orh = currImg.height();

                        var hsId = hotspotdata.Hotspots[i].HotspotId;

                        var pwdth = hotspotdata.Hotspots[i].width;
                        var phight = hotspotdata.Hotspots[i].height;
                        var pleft = hotspotdata.Hotspots[i].left;
                        var ptop = hotspotdata.Hotspots[i].top;
                        var accessText = hotspotdata.Hotspots[i].accessText;
                        if ((hotspotdata.Hotspots[i].left + "").indexOf("px") != -1) {
                            pleft = getPerc(Number(hotspotdata.Hotspots[i].left.replace("px", "").replace("%", "")), orw) + "%";
                            ptop = getPerc(Number(hotspotdata.Hotspots[i].top.replace("px", "").replace("%", "")), orh) + "%";
                        }

                        var eventname = hotspotdata.Hotspots[i].eventName;
                        if(eventname!=undefined )
                        {
                            htmlForDivHotspotImage += "<button type='button' hsId='" + hsId + "'  id='divHotspots" + i + "_" + hsId + "' class='divHotSpotdbl divHotSpotCommon' style=' width:" + pwdth + ";height:" + phight + ";left:" + pleft + ";top:" + ptop + ";' action='" + hotspotdata.Hotspots[i].action + "' role='button' aria-label='" + accessText + "'/>";
                        }
                        else
                        {
                        htmlForDivHotspotImage += "<button type='button' hsId='" + hsId + "'  id='divHotspots" + i + "_" + hsId + "' class='divHotSpot divHotSpotCommon' style=' width:" + pwdth + ";height:" + phight + ";left:" + pleft + ";top:" + ptop + ";' action='" + hotspotdata.Hotspots[i].action + "' role='button' aria-label='" + accessText + "'/>";
                        }
                    }
                    $(".wrapperimage").append(htmlForDivHotspotImage)
                }

            }
        },
        PresenterMode:function(){
            var currentPageData = _Navigator.GetCurrentPage();
            var pageData = this.GetPageDetailData();
           

            if(currentPageData.pageId == "p3" && pageData.EmbedSettings!=undefined)
            {
                $("input[type='text']").addClass("greenspan");
                $("input[type='text']").val(pageData.EmbedSettings.validatearray[0]);
                $("input[type='text']").k_disable();

            }
            $(".divHotSpot").addClass("hotspotclicked");
            $(".divHotSpot").addClass("disabled");
           
            
            $("#linknext").k_enable();
        },
        ApplycontainerWidth: function () {
            var innerWidth = $(window).width();

            $("#header-title img").attr("src", "assets/images/logo.png")

            if (innerWidth < 850) {
                if ($(".activityContainer").find(".activityimg").length > 0) {
                    var marginleft = $(".intro-content:first").css("margin-left");
                    marginleft = marginleft.substring(0, marginleft.indexOf("px"))

                    var imgcntwidth = innerWidth - (marginleft * 2);
                    $(".activity").css({ "width": imgcntwidth + "px" })
                }
                if (innerWidth <= 500) {
                    $("#header-title img").attr("src", "assets/images/pearson-logo-v1.png")
                }
            }
            else {
                $(".activity").css({ "width": "auto" })
            }

        },
        OrientationChange: function () {

            this.ApplycontainerWidth();

        },
        HotspotClick: function (_hotspot, event) {
            if (_Navigator.IsAnswered())
                return;
            var action = _hotspot.attr("action")
            this.AddHotspotClick(_hotspot, event);
            var score = 0;
            var pageData = this.GetPageDetailData();
            if (pageData.ImageHotSpots != undefined) {
                for (var i = 0; i < pageData.ImageHotSpots.Hotspots.length; i++) {
                    if (pageData.ImageHotSpots.Hotspots[i].HotspotId == _hotspot.attr("hsid")) {
                        if (pageData.ImageHotSpots.Hotspots[i].score != undefined && pageData.ImageHotSpots.Hotspots[i].score != "") {
                            score = parseInt(pageData.ImageHotSpots.Hotspots[i].score);
                        }
                    }
                }
            }
            _Navigator.SetPageScore(score)
            switch (action) {
                case "next":
                    _Navigator.SetPageStatus(true);
                    this.HotspotNext();
                    break;
                case "feedback":
                    _Navigator.SetPageStatus(true);
                    this.HotspotFeedback(_hotspot);
                    break;
                case "inputcheck":
                    _ModuleCommon.InputEnter($("input.EmbededElement"));
                    break;
                default:
                    break;
            }
        },
        SetFeedbackTop: function () {
            var ptop = Number($("#div_feedback").position().top);
            var pheight = Number($("#div_feedback").outerHeight());
            var pdiff = (_Settings.minHeight + _Settings.topMargin) - (ptop + pheight);
            if (pdiff > 0) {
                $("#div_feedback").css("margin-top", (pdiff + 35) + "px");
            }
        },
        InputFeedback: function () {
            var pageData = this.GetPageDetailData();
            var fdbkUrl = _Settings.dataRoot + "feedbackdata/" + pageData.EmbedSettings.feedbackurl;
            $("#div_feedback").show();
            $("#div_feedback").css("display", "inline-block");
            $("#div_feedback .div_fdkcontent").load(fdbkUrl, function () {
                // this.SetFeedbackTop()
                $('html,body').animate({ scrollTop: document.body.scrollHeight }, 1000, function () { });
            });
            $("input").k_disable();
            this.EnableNext();
        },
        HotspotFeedback: function (_hotspot) {
            var pageData = this.GetPageDetailData();
            var url = "";
            if (pageData.ImageHotSpots != undefined) {
                for (var i = 0; i < pageData.ImageHotSpots.Hotspots.length; i++) {
                    if (pageData.ImageHotSpots.Hotspots[i].HotspotId == _hotspot.attr("hsid")) {
                        url = pageData.ImageHotSpots.Hotspots[i].feedbackurl;
                    }
                }
            }
            var fdbkUrl = _Settings.dataRoot + "feedbackdata/" + url;
            $("#div_feedback").show();
            $("#div_feedback").css("display", "inline-block");
            $("#div_feedback .div_fdkcontent").load(fdbkUrl, function () {
                // this.SetFeedbackTop()
                $('html,body').animate({ scrollTop: document.body.scrollHeight }, 1000, function () { });
            });

            this.EnableNext();
        },
        HotspotNext: function () {
            _Navigator.Next();
        },
        InputNext: function () {
            _Navigator.Next();
        },
        InputEnter: function (inputtext) {
            if (_Navigator.IsAnswered())
                return;
            if ($.trim(inputtext.val()) != "") {
                if(_Navigator.GetCurrentPage().pageId == "p12" || _Navigator.GetCurrentPage().pageId == "p20")
                {
                    var basepageid = _Navigator.GetCurrentPage().pageId == "p12" ? "p10" :"p18"
                    if (reviewData != undefined && reviewData.length > 0) {
                        for (var i = 0; i < reviewData.length; i++) {
                            if (reviewData[i].pageId == basepageid) {
                                pagereviewdata = reviewData[i];
                                break;
                                
                            }
                        }
                    }
                    var index = _PData[_Navigator.GetCurrentPage().pageId].EmbedSettings.validatearray.indexOf(pagereviewdata.textEntry[pagereviewdata.textEntry.length-1].toLowerCase());
                    if(index >= 0){
                        _PData[_Navigator.GetCurrentPage().pageId].EmbedSettings.validatearray.splice(index,1)
                    }
                }
               
                var pageData = this.GetPageDetailData();
                var vtextarr = pageData.EmbedSettings.validatearray;
                var isVRequired = false;
                
                for (var i = 0; i < vtextarr.length; i++) {
                    if (($.trim(vtextarr[i])).toLowerCase() == ($.trim(inputtext.val())).toLowerCase()) {
                        isVRequired = true;
                       
                        break;
                    }
                }

                var found = false;
                var str = $.trim(inputtext.val()).toLowerCase();
                var currentPageData = _Navigator.GetCurrentPage();
                if (reviewData != undefined && reviewData.length > 0) {
                    for (var i = 0; i < reviewData.length; i++) {
                        if (reviewData[i].pageId == currentPageData.pageId) {
                            if (reviewData[i].textEntry.length < 2) {
                                reviewData[i].textEntry.push(str);
                            } else {
                                reviewData[i].textEntry.splice(0, 1);
                                reviewData[i].textEntry.push(str);
                            }

                            found = true;
                        }
                    }
                }

                if (!found) {
                    var _obj = {};
                    _obj.pageId = currentPageData.pageId;
                    _obj.textEntry = [str];
                    _obj.isCorrect = true;
                    reviewData.push(_obj);

                }

            }
            if (isVRequired) {
                var score = pageData.EmbedSettings.score;
                _Navigator.SetPageScore(score)
                var action = pageData.EmbedSettings.action;
               
                _Navigator.SetPageStatus(true);
                switch (action) {
                    case "next":
                        this.InputNext();
                        break;
                    case "feedback":
                        this.InputFeedback();
                        break;
                    default:
                        break;
                }
            }
            else
            {
                $(".divHotSpot").removeClass("disabled");
                $(".divHotSpot").removeClass("hotspotclicked");
            }
        },
        DragImages: function () {
            $(".draggable1").draggable({
                cancel: "a.ui-icon",
                revert: "invalid",
                containment: ".wrapperimage",
                cursor: "move",
                
                start: function (event, ui) {
                    $(ui.helper).css("z-Index", 100);
                    ui.helper.data('rejected', true);
                    ui.helper.data('original-position', ui.helper.offset());
                   
                },
                revert: function (event, ui) {
                    $(this).data("draggable");
                    return !event;
                },
                stop:function (event, ui) {
                    if (ui.helper.data('rejected') === true) {
                        _ModuleCommon.AddDragReviewData(ui, false);
                    }
                }
            });
            $(".droppable1").droppable({
                accept: ".draggable1",
                classes: {
                    "ui-droppable-active": "ui-state-highlight"
                },
                over: function (event, ui) {
                    $(this).css({"background-color":"#c9e0fc"});
                },
                out: function (event, ui) {
                    $(this).css({"background-color":"transparent"});
                    ui.helper.data('rejected', true);
                },
                drop: function (event, ui) {
                    $(this).css({"background-color":"transparent"});
                    ui.helper.data('rejected', false);
                    _ModuleCommon.DropImage(ui.draggable);
                    _ModuleCommon.AddDragReviewData(ui, true);
                    
                    
                }
            });
        },
        DropImage: function ($item) {
            $item.appendTo(".droppable1")
            $item.addClass("filedropped")
            var top1 = 0;
            var top2 = 0;
            var i = 0;
            $(".filedropped").each(function () {
                if (i > 2) {
                    $(this).css({ position: "absolute", top: top2 + "px", left: "80px" });
                    top2 = top2 + 70;
                }
                else {

                    $(this).css({ position: "absolute", top: top1 + "px", left: "2px " });
                    top1 = top1 + 70;
                }
                if (i == 5) {
                    _ModuleCommon.DragDropFeedback();
                }
                i++;
            })
        },
        DragTwoImage: function (makeclone) {
            makeclone = makeclone == undefined ? false : true;
            $(".draggable1").draggable({
                cancel: "a.ui-icon",
                revert: "invalid",
                containment: ".wrapperimage",
                cursor: "move",
                start: function (event, ui) {
                    $(ui.helper).css("z-Index", 100);
                    ui.helper.data('rejected', true);
                    ui.helper.data('original-position', ui.helper.offset());
                   
                },
                revert: function (event, ui) {
                    $(this).data("draggable");
                    return !event;
                },
                stop:function (event, ui) {
                    if (ui.helper.data('rejected') === true) {
                        _ModuleCommon.AddDragReviewData(ui, false);
                    }
                }
            });
            $(".droppable1").droppable({
                accept: ".dragdiv",
                classes: {
                    "ui-droppable-active": "ui-state-highlight"
                },
                over: function (event, ui) {
                    $(this).css({"background-color":"#c9e0fc","opacity":"0.4"});
                },
                out: function (event, ui) {
                    $(this).css({"background-color":"transparent","opacity":"1"});
                    ui.helper.data('rejected', true);
                },
                drop: function (event, ui) {
                    $(this).css({"background-color":"transparent","opacity":"1"});
                    if(ui.helper.hasClass("draggable1"))
                    {
                        ui.helper.data('rejected', false);
                        _ModuleCommon.AddDragReviewData(ui, true);
                        _ModuleCommon.DropTwoImage(ui.draggable, "draggable1");
                       
                    }
                    else
                    {
                        ui.helper.css({ "top": ui.helper.attr("originaltop"), "left": ui.helper.attr("originalleft") });
                        ui.helper.data('rejected', true);
                    }
                }
            });

            $(".draggable2").draggable({
                cancel: "a.ui-icon",
                revert: "invalid",
                containment: "document",
                containment: ".wrapperimage",
                cursor: "move",
                start: function (event, ui) {
                    $(ui.helper).css("z-Index", 100);
                    ui.helper.data('rejected', true);
                    ui.helper.data('original-position', ui.helper.offset());
                   
                },
                revert: function (event, ui) {
                    $(this).data("draggable");
                    return !event;
                },
                stop:function (event, ui) {
                    if (ui.helper.data('rejected') === true) {
                        _ModuleCommon.AddDragReviewData(ui, false);
                    }
                }
            });
            $(".droppable2").droppable({
                accept: ".dragdiv",
                over: function (event, ui) {
                    $(this).css({"background-color":"#c9e0fc","opacity":"0.4"});
                },
                out: function (event, ui) {
                    $(this).css({"background-color":"transparent","opacity":"1"});
                    ui.helper.data('rejected', true);
                },
                classes: {
                    "ui-droppable-active": "ui-state-highlight"
                },
                drop: function (event, ui) {
                    $(this).css({"background-color":"transparent","opacity":"1"});
                    if(ui.helper.hasClass("draggable2"))
                    {
                        ui.helper.data('rejected', false);
                        _ModuleCommon.AddDragReviewData(ui, true);
                        _ModuleCommon.DropTwoImage(ui.draggable, "draggable2");
                       
                    }
                    else
                    {
                        ui.helper.css({ "top": ui.helper.attr("originaltop"), "left": ui.helper.attr("originalleft") });
                        ui.helper.data('rejected', true);
                    }
                }
            });
            $(".draggable3").draggable({
                cancel: "a.ui-icon",
                revert: "invalid",
                containment: ".wrapperimage",
                cursor: "move",
                start: function (event, ui) {
                    $(ui.helper).css("z-Index", 100);
                    ui.helper.data('rejected', true);
                    ui.helper.data('original-position', ui.helper.offset());
                   
                },
                revert: function (event, ui) {
                    $(this).data("draggable");
                    return !event;
                },
                stop:function (event, ui) {
                    if (ui.helper.data('rejected') === true) {
                        _ModuleCommon.AddDragReviewData(ui, false);
                    }
                }
            });
            if(makeclone)
            {
                $( ".draggable3" ).draggable( "option", "helper", "clone" );
                $( ".draggable2" ).draggable( "option", "helper", "clone" );
                $( ".draggable1" ).draggable( "option", "helper", "clone" );
            }
            $(".dragdiv").each(function(){
                var ob = $(this).position();
                $(this).attr({ "originaltop": ob.top + "px", "originalleft": ob.left + "px"});
         
            })
        },
        DropTwoImage: function ($item, draggableClass) {
            var pageData = _Navigator.GetCurrentPage();
            if(pageData.pageId != "p27")
            {
                $item.appendTo(".draggablediv");
            }            
            $item.addClass("filedropped");
            var i = 0;
            $(".filedropped").each(function () {
                i++;
                var currentPageData = _Navigator.GetCurrentPage();
                if (currentPageData.pageId == "p13") {
                    if (i == 4) {
                        _ModuleCommon.DragDropFeedback();
                    }

                }
                else if (currentPageData.pageId == "p15" || currentPageData.pageId == "p21") {
                    if (i == 3) {
                        _ModuleCommon.DragDropFeedback();
                    }
                }
                else if (currentPageData.pageId == "p27") {
                    if (i == 5) {
                        _ModuleCommon.DragDropFeedback();
                    }
                }
                
            });
        },
        DragDropFeedback: function () {
            var pageData = this.GetPageDetailData();
            var url = pageData.feedbackurl;
           
            var fdbkUrl = _Settings.dataRoot + "feedbackdata/" + url;
            $("#div_feedback").show();
            $("#div_feedback").css("display", "inline-block");
            $("#div_feedback .div_fdkcontent").load(fdbkUrl, function () {
                // this.SetFeedbackTop()
                $('html,body').animate({ scrollTop: document.body.scrollHeight }, 1000, function () { });
            });
            _Navigator.SetPageStatus(true)
            $(".dragdiv").draggable({ disabled: true })
            this.EnableNext();
        },
        DisplayDrangAndDropInReviewMode: function() {
           
            $(".reviewDiv").remove();
            var pagereviewData = this.GetPageReviewData();
            var appendImage = $(".wrapperimage");
            var dropobj = $("#droppable1")    

            if (pagereviewData != undefined && pagereviewData.Images != undefined) {              
                for (var i = 0; i < pagereviewData.Images.length; i++) {
                    if (pagereviewData.Images[i].Positions != undefined) {
                        for (var j = 0; j < pagereviewData.Images[i].Positions.length; j++) {
                            var image = pagereviewData.Images[i];
                            if (pagereviewData.Images[i].Positions[j].isCorrect == true) {
                                var _div = "<div class='reviewDiv Correct' style='z-index:10000;width:15px;height:25px;position:absolute;left:" + image.Positions[j].posX + "px;top:" + image.Positions[j].posY + "px;'><img src='" + image.imageDetails.Imagesrc + "' style='width:" + image.imageDetails.width + "px;height:" + image.imageDetails.height + "px;float:left;' /><img src='assets/images/correct-icon.png' style='width:20px;height:20px;float:right;top:0px;position:absolute;' /></div>";
                                dropobj.append(_div)
                            }
                            else {
                                var _div = "<div class='reviewDiv InCorrect' style='z-index:10000;width:25px;height:25px;position:absolute;left:" + image.Positions[j].posX + "px;top:" + image.Positions[j].posY + "px;'><img src='" + image.imageDetails.Imagesrc + "' style='width:" + image.imageDetails.width + "px;height:" + image.imageDetails.height + "px;float:left;' /><img src='assets/images/incorrect-icon.png' style='width:20px;height:20px;float:right;top:0px;position:absolute;' /></div>";
                                appendImage.append(_div)
                            }
        
                        }
        
                    }
        
                }
              
        
            }

        },
        DisplayDrangAndDropInReviewMode1: function() {
            debugger;
            
            var reviewData = this.GetPageReviewData();
            $(".reviewDiv").remove();
            var appendImage = $(".wrapperimage");
            if (reviewData != undefined && reviewData.Images != undefined) {
                var imageFound = false;
                for (var i = 0; i < reviewData.Images.length; i++) {
                    if (reviewData.Images[i].Positions != undefined) {
                        if ($("#" + reviewData.Images[i].objId).closest(".k-element-box") != undefined) {
                            for (var j = 0; j < reviewData.Images[i].Positions.length; j++) {
                                var image = reviewData.Images[i];
                                if (reviewData.Images[i].Positions[j].isCorrect == true) {
                                    var _div = "<div class='reviewDiv'><img src='assets/images/correct-icon.png' style='width:20px;height:20px;left:0px;top:0px;position:absolute;' /></div>";
                                    $("#" + reviewData.Images[i].objId).append(_div);
                                }
                                else {
                                    var _div = "<div class='reviewDiv'><img src='assets/images/incorrect-icon.png' style='width:20px;height:20px;left:0px;top:0px;position:absolute;' /></div>"
                                    $("#" + reviewData.Images[i].objId).append(_div);
                                }
                            }
                            
                        }
                    }
                }
            }
          
            
        },
        DisplayDrangAndDropInReviewMode2: function() {
          
            var reviewData = this.GetPageReviewData();
            var appendImage = $(".wrapperimage");
            $(".reviewDiv").remove();
            if (reviewData != undefined && reviewData.Images != undefined) {
                var imageFound = false;
                for (var i = 0; i < reviewData.Images.length; i++) {
                    if (reviewData.Images[i].Positions != undefined) {
                        if ($("#" + reviewData.Images[i].objId) != undefined) {
                            var left = parseInt($("#" + reviewData.Images[i].objId).css("left"), 10);
                            var top = parseInt($("#" + reviewData.Images[i].objId).css("top"), 10);
                            left = left - 30;
                            var _div;
                            for (var j = 0; j < reviewData.Images[i].Positions.length; j++) {
                                var image = reviewData.Images[i];
                                if (reviewData.Images[i].Positions[j].isCorrect == true) {
                                  
                                    _div = "<div><img src='assets/images/correct-icon.png' style='width:20px;height:20px;left:" + left + "px;top:" + top + "px;position:absolute;' /></div>";
                                    appendImage.append(_div);
                                }
                                else {
                                    _div = "<div><img src='assets/images/incorrect-icon.png' style='width:20px;height:20px;left:" + left + "px;top:" + top + "px;position:absolute;' /></div>";
                                    appendImage.append(_div);
                                }
                            }
                           
                        }
                    }
                }
               
            }
        },

        DisplayDrangAndDropInReviewMode3: function() {
           
            var reviewData = this.GetPageReviewData();
            var appendImage = $(".wrapperimage");
            $(".reviewDiv").remove();
            if (reviewData != undefined && reviewData.Images != undefined) {
                var imageFound = false;
                for (var i = 0; i < reviewData.Images.length; i++) {
                    if (reviewData.Images[i].Positions != undefined) {
                        if ($("#" + reviewData.Images[i].objId) != undefined) {
                            var left = parseInt($("#" + reviewData.Images[i].objId).css("left"), 10);
                            var top = parseInt($("#" + reviewData.Images[i].objId).css("top"), 10);
                            left = left - 25;
                            var _div;
                       
                            for (var j = 0; j < reviewData.Images[i].Positions.length; j++) {
                                var image = reviewData.Images[i];
                                if (reviewData.Images[i].Positions[j].isCorrect == true) {
                                    _div = "<div><img src='assets/images/correct-icon.png' style='width:20px;height:20px;left:" + left + "px;top:" + top + "px;position:absolute;' /></div>";
                                     appendImage.append(_div);
                                }
                                else {
                                     _div = "<div><img src='assets/images/incorrect-icon.png' style='width:20px;height:20px;left:" + left + "px;top:" + top + "px;position:absolute;' /></div>";
                                    appendImage.append(_div);
                                }
                               
                            }
                        }
                    }
                }
               
            }
        },
        
        DragandDropFeedbackReviewMode: function(){
            var pageData = this.GetPageDetailData();
            var url = pageData.feedbackurl;
           
            var fdbkUrl = _Settings.dataRoot + "feedbackdata/" + url;
            $("#div_feedback").show();
            $("#div_feedback").css("display", "inline-block");
            $("#div_feedback .div_fdkcontent").load(fdbkUrl, function () {
            });
        },
        AddDragReviewData : function(box, isCorrect) {
            debugger;
            var kbox
            if (box.helper != undefined)
                kbox = box.helper;
            else
                kbox = box;
            var currentPage = _Navigator.GetCurrentPage();
            var objId = kbox.attr("id");
            if(objId ==undefined)
                objId = kbox.attr("data-id")
            var image = { Imagesrc: kbox.find("img").attr("src"), width: parseInt(kbox.find("img").width(), 10), height: parseInt(kbox.find("img").height(), 10) };
            var originalPosition;
            var dragPosition;
            if (box.originalPosition != undefined) {
                originalPosition = box.originalPosition;
            }
            /*else {
                originalPosition = { top: parseInt(kbox.attr("originaltop"), 10), left: parseInt(kbox.attr("originalleft"), 10) }
            }*/
            if (box.helper != undefined && box.position != undefined) {
                dragPosition = box.position;
            }
            /*else {
                dragPosition = { top: parseInt(kbox.css("top"), 10), left: parseInt(kbox.css("left"), 10) }
            }*/
        
            var found = false;
            
            var posX;
            var posY;
            if (isCorrect) {
                posX = parseInt(kbox.css("left"), 10);
                posY = parseInt(kbox.css("top"), 10);
            }
            else {
                posX = dragPosition.left;
                posY = dragPosition.top;
            }
           
            if (reviewData != undefined) {
                for (var r = 0; r < reviewData.length; r++) {
                    if (reviewData[r].pageId == currentPage.pageId) {
                        if (reviewData[r].Images != undefined) {
                            var rData = reviewData[r];
                            var imageFound = false;
                            for (var i = 0; i < rData.Images.length; i++) {
        
                                var sameclick = false;
                                if (rData.Images[i].objId == objId) {
                                    for (var j = 0; j < rData.Images[i].Positions.length; j++) {
                                        if (rData.Images[i].Positions[j].posX == posX && rData.Images[i].Positions[j].posY == posY) {
                                            sameclick = true;
                                        }
                                    }
                                    if (!sameclick) {
                                        var position = { posX: posX, posY: posY, isCorrect: isCorrect };
                                        if (rData.Images[i].Positions.length < 3) {
                                            rData.Images[i].Positions.push(position);
                                        }
                                        else {
                                            rData.Images[i].Positions.splice(0, 1);
                                            rData.Images[i].Positions.push(position);
                                        }
                                    }
                                    imageFound = true;
                                }
        
                            }
                            if (!imageFound) {
                                var _obj = {};
                                _obj.imageDetails = image;
                                _obj.originalDragPositions = originalPosition;
                                _obj.objId = objId;
                                var position = { posX: posX, posY: posY, isCorrect: isCorrect };
                                _obj.Positions = [position]
                                rData.Images.push(_obj);
                            }
                            pageReviewData = rData;
                        }
        
                        found = true;
                    }
                }
            }
        
            if (!found) {
                var _obj = {};
                _obj.pageId = currentPage.pageId;
                _obj.dragdrop = true;
                var imageObj = {};
                imageObj.imageDetails = image;
                imageObj.originalDragPositions = originalPosition;
                imageObj.objId = objId;
                var position = { posX: posX, posY: posY, isCorrect: isCorrect };
                imageObj.Positions = [position];
                _obj.Images = [imageObj];
                reviewData.push(_obj);
        
            }
           
        
        }

    }
})();
function AppendFooter() {
    debugger;
    if ($(".levelfooterdiv").length == 0) {
        var str = '<div class="levelfooterdiv"><div class="navBtn prev" onClick="GoToPrev()" role="button" tabindex = 195 aria-label="Previous"><a href="#"></a></div><div style="display: inline-block;width: 2px;"></div><div class="boxleveldropdown" style="width: 150px;"  role="button" tabindex = 196 aria-label="Scorecard"><span class="leftarrow"></span><ul class="levelmenu"><li class="uparrow" style = "width: 100px; margin-left: -8px;"><span class="menutitle" >Scorecard</span><div class="levelsubMenu" tabindex = 197 role="text">Total Score - <br>Activity Score - </div><a class="menuArrow"></a></div><div style="display: inline-block;width: 2px;"></div><div class="navBtn next" onClick="GoToNext()" role="button" tabindex = 198 aria-label="Next"><a href="#"></a></div></div>';
        $("#wrapper").append($(str));
        $(".navBtn.prev").css({
            "opacity": ".5",
            "pointer-events": "none"
        });
        $(".navBtn.prev").attr("aria-disabled","true")
    }
}

function DisplaySubmenu() {
    if ($(".levelsubMenu").is(":visible")) {
        $(".levelsubMenu").hide();
        $('.rightarrow').removeClass('fa-chevron-up').addClass('fa-chevron-right');
    } else {
        $(".levelsubMenu").show();
        $('.rightarrow').removeClass('fa-chevron-right').addClass('fa-chevron-up');
    }
}
var mTreeObj = {
    Goto: function (pageid) {
        _Navigator.LoadPage(pageid);
    },
    GoToPrev: function () {
        debugger;
        try {
            if ($(".navBtn.prev").css("pointer-events") == "none") {
                return;
            }
            else
            {
                _Navigator.Prev();
                if (_Navigator.GetCurrentPage().nextPageId != undefined && _Navigator.GetCurrentPage().nextPageId != "") {
                    enableobj($(".navBtn.next"));
                } else {
                    disableobj($(".navBtn.next"));
                }
                if (_Navigator.GetCurrentPage().PrevPageId != undefined && _Navigator.GetCurrentPage().PrevPageId != "") {
                     enableobj($(".navBtn.prev"));
                } else {
                    disableobj($(".navBtn.prev"));
                }
            }
        } catch (expn) {
            //menuNodeIndex++;
            alert(expn.message);
        }
    },
    GoToNext: function () {
        try {
            debugger;
            if ($(".navBtn.next").css("pointer-events") == "none") {
                return;
            } 
            else{
                _Navigator.Next();
                    if (_Navigator.GetCurrentPage().nextPageId != undefined && _Navigator.GetCurrentPage().nextPageId != "") {
                        enableobj($(".navBtn.next"));
                    } else {
                        disableobj($(".navBtn.next"));
                    }
                    if (_Navigator.GetCurrentPage().prevPageId != undefined &&_Navigator.GetCurrentPage().prevPageId != "") {
                        enableobj($(".navBtn.prev"));
                    } else {
                        disableobj($(".navBtn.prev"));
                    }
                }
            
        } catch (expn) {
            //menuNodeIndex--;
            alert(expn.message);
        }
    }
};



function disableobj(obj) {
    obj.css({
        "opacity": ".5",
        "pointer-events": "none"
    });
    obj.attr("aria-disabled", "true");
}
function enableobj(obj) {
    obj.css({
        "opacity": "1",
        "pointer-events": ""
    });
    obj.attr("aria-disabled", "false");
}


$(document).ready(function () {
    _Navigator.Start();   
    //if (_Settings.enableCache) {
    //    _Caching.InitAssetsCaching();
    //    _Caching.InitPageCaching();
    //}
    $('body').attr({ "id": "thebody", "onmousedown": "document.getElementById('thebody').classList.add('no-focus');", "onkeydown": "document.getElementById('thebody').classList.remove('no-focus');" })
});

