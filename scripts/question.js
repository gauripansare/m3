var isDnDRetried = false;
var droppeditemsList = [];

var dndStartTabIndx = 9; 				//first draggable tabindex
var dndPerDroppable = 6; 				//per droppable number of allowed draggables
var totalDndsToCheckSubmitStatus = 6; 	//min draggables dropped count to check submit btn status
var totalDndCount = 6; 					//total count of draggables
var submitBtnTabIndx = 16; 				//submit btn tabindex

var currpageId = gCurrPageObj.PageId;

//Draggable btn ids -change these ids
var Card1ID = "k-element-button" + currpageId + "6" + "clone";
var Card2ID = "k-element-button" + currpageId + "7" + "clone";
var Card3ID = "k-element-button" + currpageId + "8" + "clone";
var Card4ID = "k-element-button" + currpageId + "9" + "clone";
var Card5ID = "k-element-button" + currpageId + "10" + "clone";
var Card6ID = "k-element-button" + currpageId + "11" + "clone";

var Drop1IDdnd2 = "k-element-droppable" + currpageId + "1" + "clone";
debugger;
var cardDetails =
    [{ cardtype: "Bidsforkids", name: "Bids for kids", cardId: Drop1IDdnd2, corBtnId: [Card1ID, Card2ID, Card3ID, Card4ID, Card5ID, Card6ID], droppedItems: [] }];

var
arrDragItems = [
  { id: "#" + Card1ID, name: 'banner BFK' },
  { id: "#" + Card2ID, name: 'detailed description' },
  { id: "#" + Card3ID, name: 'donations' },
  { id: "#" + Card4ID, name: 'goodies for any event' },
  { id: "#" + Card5ID, name: 'invitations' },
  { id: "#" + Card6ID, name: 'sponsors BFK' }];

//Feedback, Submit, description text ids -change these ids
var fbBtnIds = ["#tk-element-button" + currpageId + "19", "#tk-element-button" + currpageId + "20", "#tk-element-button" + currpageId + "21", "#tk-element-button" + currpageId + "22", "#tk-element-button" + currpageId + "23"];
var dndSubmitBtnId = "#tk-element-button" + currpageId + "10";
var txtElemTxt = $("#tk-element-text" + currpageId + "2");


//Function having ids. Need to change
function initiatePageElements() {
    CallOnDrag();
    //-change this id
    $('.SubmitBtn').addClass('disabled');
    $('.NextPageBtn').addClass('disabled');

    $("#tk-element-button" + currpageId + "13").attr("aria-label", "Computer Type");
    $(".dndbox1").removeAttr('simscore');
    $(dndSubmitBtnId).closest(".k-element-box").addClass("disabled").css("opacity", "0.3");
    $(dndSubmitBtnId).attr({ "role": "button", "aria-disabled": "true" });

    $(".submitFeedbackPopup").css({ "height": "0px", "display": "none", "top": "1177px" });
    $(".PSDragCarddnd1").draggable({ disabled: false }).css("opacity", "1");
    $(".PSDragCarddnd1").removeClass('disabled');
    $(".PSDragCarddnd1").removeAttr("dropped");
    for (var n1 = 0; n1 < cardDetails.length; n1++) {
        cardDetails[n1].droppedItems = [];
    }

    for (var n2 = 0; n2 < arrDragItems.length; n2++) {
        $(arrDragItems[n2].id).attr("dobjName", arrDragItems[n2].name);
    }

    $(".k-element-droppable").attr({ "dropped-list": "" });
    $(".imageDelete").remove();

    $("#footerNext").addClass('disabled').attr("aria-disabled", "true");
    $(".droppableImgBg").remove();

    var isReview = false;
    var trackingObj;
    $(".PSDragCarddnd1").each(function (ix, ob) {
        $(this).find(".k-element-button").attr({ "data-tabindex": ix + dndStartTabIndx, "tabindex": ix + dndStartTabIndx, "role": "button" });
        $(this).attr('orig-wt', parseInt($(this).css('width')));
        var ob = $(this).position();

        $(this).attr("originaltop", ob.top + "px");
        $(this).attr("originalleft", ob.left + "px");
        $(this).attr("originalzindex", $(this).css("z-index"));
    });
    $('.itemlabel').css('color', '#999');
    initiateDragItems();
    $(".droppableObjdnd2.dnd2").css("border", "0px solid #000");
    $(".selDragObj").removeClass("selDragObj");
}
//no-change
function initiateDragItems() {
    if (isReview)
        return;
    $(".PSDragCarddnd1").draggable({
        //handle: '.opHandle',    /*DDeva:v1.1.2*/
        cursor: 'pointer',
        containment: $('.column'),
        helper: '',
        drag: function (event, ui) {
        },
        start: function (event, ui) {
            $(ui.helper).css("z-Index", 100);
            ui.helper.data('rejected', true);
            ui.helper.data('original-position', ui.helper.offset());
            $(".footnote").show();
            $(".droppableObjdnd2.dnd2").css('opacity', '0.3');
        },
        revert: function (event, ui) {
            $(this).data("draggable");
            return !event;
        },
        stop: function (event, ui) {
            if (typeof FireCustomDragFunction == 'function') {
                FireCustomDragFunction(this, event, ui);
            }
            if (ui.helper.data('rejected') === true) {
                // ui.helper.offset(ui.helper.data('original-position'));
                ui.helper.offset({ "top": ui.helper.attr("originaltop"), "left": ui.helper.attr("originalleft") });
                $(ui.helper).css("z-Index", 100);
            }

            $(ui.helper).css("z-Index", 50);
            $(".droppableObjdnd2.dnd2").css('opacity', '1');
        }
    });

    $(".k-element-box[temptype='Droppable']").each(function () {
        $(this).find(".k-element-droppable > p").remove();
        var imglst = $(".k-element-image[draggable='true'][droppable-target-id='" + $(this).find(".k-element-droppable").attr('id') + "']");
        var acceptbls = "", draglist = "";
        for (var k = 0; k < imglst.length; k++) {
            acceptbls += ".k-element-box[temptype='Image']:has('#" + imglst[k].attributes.id.value + "')";
            draglist += imglst[k].attributes.id.value;
            if (k != (imglst.length - 1)) {
                acceptbls += ", ";
                draglist += ",";
            }
        }
        var isadvnce = ($(this).find(".k-element-droppable").attr("answers") == undefined || $(this).find(".k-element-droppable").attr("answers") == "") ? false : true;

        if (acceptbls == "" || isadvnce) {
            acceptbls = "*";
        }

        $(this).find(".k-element-droppable").attr("drag-list", draglist);
        $(this).droppable({
            accept: acceptbls,
            over: function (event, ui) {
                toggletDroppableBackground(this);
            },
            out: function (event, ui) {
                toggletDroppableBackground(this);
                ui.helper.data('rejected', true);
            },
            drop: function (ev, ui) {
                toggletDroppableBackground(this);
                var eleDrag = ui.helper;
                //Anu 3-march-2015 line up drag n drop items one after another on drop
                var eleDropble = $(this).find(".k-element-droppable");
                //naveen- change for accept only answers.
                var isaoanswers = eleDropble.attr("AOAnswers");
                if (isaoanswers != undefined && isaoanswers != "false" && (isaoanswers || isaoanswers == "true")) {
                    //var answers = eleDropble.attr('answers');
                    var answers = eleDropble.attr('drag-list');
                    //AR 28 April 2015 - Condition Updated to resolve check/uncheck issue
                    if (answers == undefined || answers == "") {
                        return typeof event == "undefined" ? !ev : !event;
                    }
                    else {
                        if (!(answers.indexOf(eleDrag.find(".k-element-image").attr('id')) > -1)) {
                            return typeof event == "undefined" ? !ev : !event;
                        }
                    }
                }

                var isadvanced = (eleDropble.attr("answers") == undefined || eleDropble.attr("answers") == "") ? false : true;
                var keepCopy = eleDrag.find(".k-element-image").attr("keepcopy");

                var isMultipleDropAllow = eleDropble.attr("dragelemtslimit") == "Multiple" ? true : false;
                if (!isMultipleDropAllow && typeof eleDropble.attr("dropped-list") != "undefined" && eleDropble.attr("dropped-list") != "") {
                    return typeof event == "undefined" ? !ev : !event;
                }
                else {
                    if (keepCopy != undefined && (keepCopy == true || keepCopy == "true")) {
                        eleDrag = ui.helper.clone();
                        ui.helper.data('rejected', false);
                    }
                    else {
                        ui.draggable.data('rejected', false);
                    }

                    var eleDragId = eleDrag.find(".k-element-image").attr("id");

                    //AR 14 April 2015 - Accept all - Condition no longer required
                    if (isadvanced != undefined && (isadvanced == true || isadvanced == "true")) {
                        if (keepCopy != undefined && (keepCopy == true || keepCopy == "true")) {
                            var drplst = eleDropble.attr("dropped-list");
                            if (drplst != undefined && drplst != "") {
                                if (drplst.indexOf(eleDragId) >= 0) {
                                    ui.helper.data('rejected', true);
                                    return;
                                }
                            }
                        }
                    }
                    //Rahul 24March-2015 - added delete button on droppable image component

                    if (keepCopy != undefined && (keepCopy == true || keepCopy == "true")) {
                        eleDrag.addClass("dragclone")
                        eleDrag.find(".k-element-image").attr("droppableid", eleDropble.attr("id"))
                    } else {
                        eleDrag.addClass("dragOriginal")
                        eleDrag.find(".k-element-image").attr("droppableid", eleDropble.attr("id"))
                    }
                    if (eleDrag.find(".imageDelete").length == 0) {
                        eleDrag.append($("<div class='imageDelete'></div>"));
                        if (iPadClickStatus == "true") {
                            eleDrag.find(".imageDelete").css({ "display": "inline" });
                        }
                    }

                    //end
                    if (keepCopy != undefined && (keepCopy == true || keepCopy == "true")) {
                        ui.helper.parent().append(eleDrag);
                    }

                    if (eleDropble.attr("arrange-vertically") == "true" || eleDropble.attr("arrange-vertically") == true) {
                        var nextDrgelemntTop = eleDropble.attr("next-dragelemt-top");
                        if (nextDrgelemntTop == undefined) {
                            eleDropble.attr("next-dragelemt-top", eleDrag.height() + 3);
                            eleDrag.css({ top: (Number($(this).css('top').replace("px", "")) + 3) + "px", left: (Number($(this).css('left').replace("px", "")) + 3) + "px" });
                        }
                        else {
                            var dropHt = $(this).height();
                            nextDrgelemntTop = Number(nextDrgelemntTop)
                            if (dropHt >= (nextDrgelemntTop + eleDrag.height())) {
                                eleDrag.css({ top: (Number($(this).css('top').replace("px", "")) + nextDrgelemntTop + 3), left: (Number($(this).css('left').replace("px", "")) + 3) + "px" });
                            }
                            else {
                            }
                            eleDropble.attr("next-dragelemt-top", (nextDrgelemntTop + eleDrag.height() + 3));
                        }
                    }
                    //end
                    var temp = eleDropble.attr("drag-list");
                    if (temp != undefined && temp != "") {
                        temp = temp.replace(eleDragId + ",", "").replace(eleDragId, "");
                        eleDropble.attr("drag-list", temp);

                        if (isadvanced == undefined || isadvanced == false || isadvanced == "false") {
                            if (temp == "") {
                                //called func to show feedback
                                droppableActionComplete(this);
                            }
                        }
                    }
                    var drplst = eleDropble.attr("dropped-list");
                    if (drplst == undefined) drplst = "";
                    drplst = drplst + eleDragId + ",";
                    eleDropble.attr("dropped-list", drplst);
                    if (typeof FireCustomFunction == 'function') {
                        FireCustomFunction(this, ev, ui);
                    }
                }
                var IsHideDragElmts = eleDropble.attr("IsHideDragElmts");
                //AR 28 April 2015 - Condition Updated to resolve check/uncheck issue
                if (IsHideDragElmts == true || IsHideDragElmts == "true") {
                    eleDrag.hide();
                }

            }
        });
    })
}
//no-change
//event: image delete click
$(".imageDelete").die('click').live('click', function (event) {
    var btnId = $(this).attr("dropId");
    $("#" + btnId).closest(".k-element-box").removeAttr("dropped").addClass("selDragObj");

    var _kbox = $(this).closest(".k-element-box")
    _kbox.find(".div-edit-properties").removeAttr("aria-describedby");
    var did = _kbox.find(".k-element-button").attr("id");
    debugger;

    for (var k = 0; k < cardDetails.length; k++) {
        var removeItemDragID = "";
        if ($.inArray(did, cardDetails[k].droppedItems) != -1) {
            cardDetails[k].droppedItems.splice($.inArray(did, cardDetails[k].droppedItems), 1);
            removeItemDragID = cardDetails[k].cardId;
        }
        if (removeItemDragID != "") {
            var droppedlist = $("#" + removeItemDragID).attr("dropped-list");
            if (droppedlist != undefined && droppedlist != "") {
                if (endswith(droppedlist, ',')) {
                    droppedlist = droppedlist.substring(0, droppedlist.length - 1);
                }
            }
            droppedList = droppedlist.split(",");
            $("#" + removeItemDragID).attr("dropped-list", "");
            var dlist = "";
            for (var dlI = 1; dlI < droppedList.length; dlI++) {
                dlist += "undefined,";
            }
            $("#" + removeItemDragID).attr("dropped-list", dlist);
        }
    }

    checkResetDropObjects($(this));
    SetCardNameToDraggable($("#" + btnId), '');
    checkSubmitStatus();
    AddTabindexdnd2(false, $("#" + btnId));
    event.stopPropagation();
});
//no-change
//event: image delete keyup
$(".imageDelete").die("keyup").live('keyup', function (event) {
    if (window.event) {
        key = window.event.keyCode;
    } else if (event) {
        key = event.keyCode;
    }
    if (key == 13) {
        $(this).trigger('click');
    }
    event.stopPropagation();
});
//check and change - very minimal change
function FireCustomFunction(_this, ev, ui) {
    if (isReview)
        return;
    var leftOffSet = 3;
    if ($(".column").width() <= 414) {
        leftOffSet = 2;
    }

    var dragObj = $(ui.draggable);
    var cardType = $(ev.target).attr("cardtype");
    var draggableId = dragObj.find(".k-element-button").attr("id");
    var droppableId = $(ev.target).find(".k-element-droppable").attr("id");

    var droppedlist = $("#" + droppableId).attr('dropped-list');
    if (droppedlist != undefined && droppedlist != "") {
        if (endswith(droppedlist, ',')) {
            droppedlist = droppedlist.substring(0, droppedlist.length - 1);
        }
    }
    droppedList = droppedlist.split(",");
    for (var k = 0; k < cardDetails.length; k++) {
        if (cardDetails[k].cardtype == cardType && cardDetails[k].droppedItems.length >= dndPerDroppable) {
            if (dragObj.attr("dropped") != "dropped") {
                dragObj.find(".imageDelete").remove();
            }
             ui.helper.css({ "top": ui.helper.attr("originaltop"), "left": ui.helper.attr("originalleft") });
            UpdateDraggablePos();
            checkSubmitStatus();
            AddTabindexdnd2(false, dragObj.find(".k-element-button"));
            return;
        }
    }

    for (var k = 0; k < cardDetails.length; k++) {
        if ($.inArray(draggableId, cardDetails[k].droppedItems) != -1) {
            cardDetails[k].droppedItems.splice($.inArray(draggableId, cardDetails[k].droppedItems), 1);
            var droppedlist = $("#" + cardDetails[k].cardId).attr('dropped-list');
            if (droppedlist != undefined && droppedlist != "") {
                if (endswith(droppedlist, ',')) {
                    droppedlist = droppedlist.substring(0, droppedlist.length - 1);
                }
            }
            droppedList = droppedlist.split(",");
            $("#" + cardDetails[k].cardId).attr("dropped-list", "");
            var dlist = "";
            for (var dlI = 1; dlI < droppedList.length; dlI++) {
                dlist += "undefined,";
            }
            $("#" + cardDetails[k].cardId).attr("dropped-list", dlist);
        }

        if (cardDetails[k].cardtype == cardType && cardDetails[k].droppedItems.length > totalDndCount) {
            $(ui.helper).removeClass("dragOriginal");
            $(ui.helper).removeClass("rollovereffect");
             ui.helper.css({ "top": ui.helper.attr("originaltop"), "left": ui.helper.attr("originalleft") });
            dragObj.css("z-Index", 6);
            dragObj.find(".imageDelete").remove();
        } else if (cardDetails[k].cardtype == cardType && cardDetails[k].droppedItems.length >= 0) {
            dragObj.find(".div-edit-properties").attr("aria-label", SetCardNameToDraggable(dragObj.find(".div-edit-properties"), droppableId));
            cardDetails[k].droppedItems.push(draggableId);
            dragObj.attr("dropped", "dropped");
            dragObj.css({
                'z-Index': 6,
            });
            var tbindx = dragObj.find("[tabindex]").attr("data-tabindex");
            dragObj.find(".imageDelete").attr({ "dropId": draggableId, "data-tabindex": tbindx, "tabindex": tbindx, "role": "button", "aria-label": "remove item", "aria-disabled": "false" });
            //dragObj.find(".imageDelete").show();
            $(".imageDelete").remove();
            AddDragReviewData(ui, true);
        }
    }

    UpdateDraggablePos();
    checkSubmitStatus();
    AddTabindexdnd2(false, dragObj.find(".k-element-button"));
}

function SuccessPop() {
    var _totScore = 2;
    ITSimModule.UpdatePageData(gCurrPageObj.PageId, null, _totScore);
    var settings = PageSettings[gCurrPageObj.PageId];
    if (settings != undefined && settings.SuccessPopup != undefined) {
        if (settings.SuccessPopup.action == "next") {
            ITSimModule.ShowSuccessPopup();
        }
    }
}

function TrackActivityDetails(that) {
    var pagereviewData = {};
    var cardId;
    var indx;
    for (var i = 0; i < cardDetails.length; i++) {
        if (cardDetails[i].droppedItems.length > 0) {
            cardId = cardDetails[i].cardId;
            indx = i;
            break;
        }
    }

    pagereviewData.droppeditem = cardDetails[indx].droppedItems[0];
    pagereviewData.dropid = cardId;
    pagereviewData.pageId = gCurrPageObj.PageId;
    pagereviewData.isDnDRetried = true;
    var reviewData = ITSimModule.GetReviewData();
    reviewData.push(pagereviewData);
    ITSimModule.SetReviewData(reviewData);

    $(".NextPageBtn").removeClass("disabled");
    $('.NextPageBtn').closest('.k-element-box').removeClass('disabled');
    $(that).closest('.k-element-box').addClass('disabled');
}

function FireCustomDragFunction(_ths, event, ui) {
    if (ui.helper.data('rejected') === true) {
        AddDragReviewData(ui, false);
    }
}
//no-change
function setReviewStatus(trackingObj) {
    var FeedbkText = trackingObj.FeedbkText;

    $(".submitFeedbackPopup .feedbk").html(FeedbkText);
    $("#footerNext").removeClass('disabled').attr("aria-disabled", "false");

    $(".submitFeedbackPopup .correctFdbk, .submitFeedbackPopup .pcorrectFdbk, .submitFeedbackPopup .incorrectFdbk, .submitFeedbackPopup .corIncoStatus").hide();

    var _top = $(dndSubmitBtnId).parent().position().top + 75
    $(".submitFeedbackPopup").css("top", _top + "px");

    var txtElemBtn = $(dndSubmitBtnId);
    var txtElemImg = $("#tk-element-image52");
    $(".droppableObjdnd2.dnd2").closest(".k-element-box").attr({ "tabindex": "" });
}
//change control ids
/**DOM ready**/
$(document).ready(function () {

    $('.k-element-box[role="button"]').removeAttr('role');

});

//no-change
$(".draggableObjdnd2.dnd2").die("click").live('click', function (event) {
    if (isReview)
        return;

    console.log(".draggableObjdnd2.dnd2 -> click");
    var isDone = false;

    if ($(this).attr('ui-draggable-disabled') == "true" || $(this).hasClass('ui-draggable-disabled') === true || $(this).attr('dropped') == "dropped" || isReview) {
        //if ($(this).attr('disabled') == "true" || $(this).hasClass('disabled') === true || isReview) {
        isDone = true;
    }
    if (isDone) return;

    $(".footnote").show();

    var isSelected = $(this).hasClass("selDragObj");
    var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    $(".droppableImgBg").remove();

    $(".droppableObjdnd2.dnd2").attr("tabindex", "");
    $(".selDragObj").removeClass("selDragObj");
    if (isSelected == false) {
        $(this).addClass("selDragObj");
        for (var i = 0; i < cardDetails.length; i++) {
            if (cardDetails[i].droppedItems.length < dndPerDroppable) {
                $("#" + cardDetails[i].cardId).closest(".k-element-box").attr({ "tabindex": (i + dndStartTabIndx + totalDndCount), "aria-label": cardDetails[i].name + " droppable" });
                if (iOS) {
                    $("#" + cardDetails[i].cardId).append('<img class="droppableImgBg" src="" alt="' + cardDetails[i].name + ' droppable Background" style="width:' + $("#" + cardDetails[i].cardId).closest(".k-element-box").width() + 'px;height:' + $("#" + cardDetails[i].cardId).closest(".k-element-box").height() + 'px;opacity:0;"></n3>');
                }
            }
        }
        RemoveTabindexdnd2(this);
    } else {
        //$(".droppableObjdnd2.dnd2").removeAttr("role");
        $(this).find('.div-edit-properties').attr("aria-pressed", "false");
        AddTabindexdnd2(true);
    }

    event.stopPropagation();
});
//no-change
$(".draggableObjdnd2.dnd2").die("keyup").live('keyup', function (event) {
    console.log(".draggableObjdnd2.dnd2 -> keyup");
    if (window.event) {
        key = window.event.keyCode;
    } else if (event) {
        key = event.keyCode;
    }
    console.log(key);
    if (key == 13 || key == 32) {
        $(this).trigger('click');
    }
});
//no-change
$(".droppableObjdnd2.dnd2").die("click touchstart").live('click touchstart', function (event) {
    if (isReview) {
        return;
    }
    console.log(".droppableObjdnd2.dnd2 -> click");
    DropItem(this);
});
//no-change
$(".droppableObjdnd2.dnd2").die("keyup").live('keyup', function (event) {
    if (isReview) {
        return;
    }
    console.log(".droppableObjdnd2.dnd2 -> keyup");
    if (window.event) {
        key = window.event.keyCode;
    } else if (event) {
        key = event.keyCode;
    }
    console.log(key);
    if (key == 13) {
        DropItem(this);
    }
});
//no-change
function DropItem(_this) {
    if (isReview)
        return;
    console.log("DropItem");
    var dragObj = $(".selDragObj");
    if (dragObj != undefined && dragObj.length > 0) {

        var leftOffSet = 10;
        if ($(".column").width() <= 414) {
            leftOffSet = 3;
        }

        var cardType = $(_this).attr("cardtype");
        var dropId = dragObj.find(".div-edit-properties").attr("id");

        for (var k = 0; k < cardDetails.length; k++) {
            if (cardDetails[k].cardtype == cardType && cardDetails[k].droppedItems.length >= dndPerDroppable) {
                UpdateDraggablePos();
                checkSubmitStatus();
                AddTabindexdnd2(false, $(".selDragObj").find(".div-edit-properties"));
                return;
            }
        }

        for (var k = 0; k < cardDetails.length; k++) {
            if ($.inArray(dropId, cardDetails[k].droppedItems) != -1) {
                cardDetails[k].droppedItems.splice($.inArray(dropId, cardDetails[k].droppedItems), 1);
            }

            if (cardDetails[k].cardtype == cardType && cardDetails[k].droppedItems.length >= 0) {
                dragObj.find(".div-edit-properties").attr("aria-label", SetCardNameToDraggable(dragObj.find(".div-edit-properties"), cardDetails[k].cardId));
                cardDetails[k].droppedItems.push(dropId);
                dragObj.attr("dropped", "dropped");
                //dragObj.attr('orig-wt', parseInt(dragObj.css('width')));
                dragObj.css({
                    'z-Index': 6,
                });
                dragObj.find(".imageDelete").remove();
                //var tbindx = dragObj.find("[tabindex]").attr("tabindex");
                var tbindx = dragObj.find("[tabindex]").attr("data-tabindex");
                dragObj.append('<div class="imageDelete" data-tabindex="' + tbindx + '" tabindex="' + tbindx + '" role="button" aria-label="remove item" aria-disabled="false" style="display: inline;"></div>');
                //dragObj.find(".imageDelete").attr("dropId", dropId).show();
                $(".imageDelete").remove();

            }
        }

        UpdateDraggablePos();
        AddDragReviewData(dragObj, true)
        checkSubmitStatus();
        AddTabindexdnd2(false, $(".selDragObj").find(".div-edit-properties"));
        //$(".selDragObj").removeClass("selDragObj");
    }
}
//no-change
function UpdateDraggablePos() {
    if (cardDetails.length != 0) {
        var initTop = 0,
            initLeft = 0;
        for (var n2 = 0; n2 < cardDetails.length; n2++) {
            for (n3 = 0; n3 < cardDetails[n2].droppedItems.length; n3++) {
                if (n3 > 3) {
                    initTop = 0;
                    initLeft = 90;
                }
                var _top = parseInt($("#" + cardDetails[n2].cardId).closest(".k-element-box").css("top"), 10) + initTop;
                var _left = parseInt($("#" + cardDetails[n2].cardId).closest(".k-element-box").css("left"), 10) + initLeft;
                var boxElem = $("#" + cardDetails[n2].droppedItems[n3]).closest(".k-element-box");
                _top += 10 + ((n3 % 4) * 15);
                for (var n1 = 0; n1 < (n3 % 4) ; n1++) {
                    _top += $("#" + cardDetails[n2].droppedItems[n1]).parent().height();
                }
                boxElem.css({
                    "top": _top + "px",
                    "left": _left + "px"
                });
            }
        }
    }
}
//no-change
function checkSubmitStatus() {
    var allDropped = 0;
    $(".PSDragCarddnd1").each(function () {
        if ($(this).attr("dropped") == "dropped") {
            allDropped++;
        }
    });

    if (allDropped == totalDndsToCheckSubmitStatus) {
        SuccessPop();
    }
}
//no-change
function CallOnDrag() {
    //Add classes
    for (var i = 0; i < arrDragItems.length; i++) {
        $(arrDragItems[i].id).closest(".k-element-box").addClass("PSDragCarddnd1 draggableObjdnd2 dnd2").attr("cardNum", (i + 1));
        $(arrDragItems[i].id).attr({ "dobjName": arrDragItems[i].name, "aria-pressed": "false", "aria-label": arrDragItems[i].name });
    }
    for (var i = 0; i < cardDetails.length; i++) {
        $("#" + cardDetails[i].cardId).closest(".k-element-box").addClass("droppableObjdnd2 dnd2").attr({ "cardtype": cardDetails[i].cardtype, "aria-label": cardDetails[i].name + " droppable" });
    }


    $(".PSDragCarddnd1").die("mouseover").live("mouseover", function () {
        if (iPadClickStatus != "true") {
            //$(this).find(".imageDelete").css({ "display": "inline" });
            $(".imageDelete").remove();
        }
    });

    $(".PSDragCarddnd1").die("mouseover").live("mouseout", function () {
        if (iPadClickStatus != "true") {
            //$(this).find(".imageDelete").css({ "display": "inline" });
            $(".imageDelete").remove();
        }
    });

    $(".PSDragCarddnd1").each(function () {
        var ob = $(this).position();
        $(this).attr({ "originaltop": ob.top + "px", "originalleft": ob.left + "px", "originalzindex": $(this).css("z-index") });
        $(this).find(".k-element-button").find("img").attr("aria-hidden", "true");
        $(this).find(".k-element-button").find("span").attr("aria-hidden", "true");
        $(this).find(".k-element-button").find("p").attr("aria-hidden", "true");
    });



    $('.column').find(".imageDelete").remove();
    $('.k-element-box[role="button"]').removeAttr('role');
}
//no-change
function AddTabindexdnd2(isEscape, currentDragObj) {
    if (isReview)
        return;
    $(".droppableObjdnd2.dnd2").attr("tabindex", "").css("border", "0px solid #000");

    $(".PSDragCarddnd1").find(".k-element-button").each(function (ix, ob) {
        $(ob).attr("aria-hidden","false")
        $(ob).attr({ "tabindex": $(ob).attr("data-tabindex"), "aria-pressed": "false" });
        $(ob).parent().find(".imageDelete").attr("tabindex", $(ob).parent().find(".imageDelete").attr("data-tabindex"));
    });
    var isLast = true, smallCardNumber = 999;
    $(".PSDragCarddnd1[dropped!=dropped]").each(function (_ix, _obj) {
        isLast = false;
        var cardnumber = parseInt($(_obj).attr('cardNum'));
        smallCardNumber = smallCardNumber < cardnumber ? smallCardNumber : cardnumber;
    })
    if (!isEscape) {
        var objSelDrag = currentDragObj;
        setTimeout(function () {
            objSelDrag.closest('.k-element-box').removeAttr('aria-disabled');
            //objSelDrag.focus();
            $($(".PSDragCarddnd1[dropped!=dropped]").get(0)).find('.k-element-button').focus()

            $(".selDragObj").removeClass("selDragObj");
            $(".droppableObjdnd2.dnd2").each(function () {
                $(this).css("z-index", 12);
            })
        }, 50);
    }
    $('.PSDragCarddnd1[dropped="dropped"]').each(function () {
        $(this).css("z-Index", 16);
    });

}
//no-change
function RemoveTabindexdnd2(_this) {
    if (isReview)
        return;
    $(".PSDragCarddnd1").find(".k-element-button").each(function (ix, ob) {
        if ($(_this).find(".div-edit-properties").attr('id') != $(ob).attr('id')) {
            $(this).attr("aria-pressed", "false");
            $(ob).attr("tabindex", "");

            $(ob).parent().find(".imageDelete").attr("tabindex", "");
            $(this).attr("aria-hidden", "true");
        } else {
            $(ob).attr("tabindex", $(ob).attr("data-tabindex"));
            $(ob).parent().find(".imageDelete").attr("tabindex", $(ob).parent().find(".imageDelete").attr("data-tabindex"));
        }
    });
    setTimeout(function () {
        $(_this).find('.div-edit-properties').attr("aria-pressed", "true").focus();
        $(".droppableObjdnd2.dnd2").css("border", "2px solid #dd9900");
        $('.PSDragCarddnd1[dropped="dropped"]').each(function () {
            $(this).css("z-Index", 10);
        });
        $(".droppableObjdnd2.dnd2").each(function () {
            $(this).css("z-index", 17);
        })
    }, 50);
}

function SetCardNameToDraggable(_dragObj, _cardId) {
    for (var i = 0; i < cardDetails.length; i++) {
        if (cardDetails[i].cardId == _cardId || _cardId == '') {
            var str = _dragObj.attr("aria-label");
            if (typeof str == 'undefined')
                str = _dragObj.attr("dobjName");
            var lastIndex = str.lastIndexOf(" dropped");
            if (lastIndex != -1)
                str = str.substring(0, lastIndex);
            if (_cardId != '') {
                str += " dropped in " + cardDetails[i].name;
            }
            _dragObj.attr({ "aria-label": str, "aria-pressed": "false" });
        }
    }
}

function DisplayPageInReviewMode() {
    debugger;
    $(".PSDragCarddnd1").draggable({ disabled: true });
    $(".PSDragCarddnd1").removeAttr("aria-disabled");
    $(".PSDragCarddnd1").css("pointer-events", "none");
    $(".imageDelete").remove();
    $(".NextPageBtn").addClass("disabled");
    $(dndSubmitBtnId).closest('.k-element-box').addClass('disabled');

    var pageReviewData = ITSimModule.GetReviewDataForPage(gCurrPageObj.PageId);
    if (pageReviewData != undefined) {
        var top = parseInt($("#" + pageReviewData.dropid).closest(".k-element-box").css("top"), 10) + 30;
        var left = parseInt($("#" + pageReviewData.dropid).closest(".k-element-box").css("left"), 10) + 25;
        $("#" + pageReviewData.droppeditem).closest(".k-element-box").css({ "top": top + "px", "left": left + "px" });
        $("#" + pageReviewData.droppeditem).css({ "border": "2px solid green" })
        if (pageReviewData.checkedItems != undefined && pageReviewData.checkedItems.length > 0) {
            for (var i = 0; i < pageReviewData.checkedItems.length; i++) {
                $("#" + pageReviewData.checkedItems[i]).attr("checked", "checked");
            }
        }
        if (isReview) {
            $("#" + pageReviewData.droppeditem).css({ "border": "2px solid green" })
            displayReviewScore();
        }
        else {
            $(".NextPageBtn").removeClass("disabled");
        }
        debugger;
        var _cntCorrectDropped = 0;
        for (var k = 0; k < cardDetails.length; k++) {
            for (d = 0; d < cardDetails[k].droppedItems.length; d++) {
                if ($.inArray(cardDetails[k].droppedItems[d], cardDetails[k].corBtnId) != -1) {
                    _cntCorrectDropped++;
                }
            }
        }
    }
}