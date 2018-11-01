var Utility = function () {
    return {
        shuffle: function (e) { for (var t, n, r = e.length; 0 !== r;) n = Math.floor(Math.random() * r), r -= 1, t = e[r], e[r] = e[n], e[n] = t; return e },
        getParameterByName: function (e, t) { e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"); var n = new RegExp("[\\?&]" + e + "=([^&#]*)"), r = n.exec(t); return null === r ? "" : decodeURIComponent(r[1].replace(/\+/g, " ")) },
        updateHtml: function (e, t) { $.each(e, function (e, n) { var r = "", a = $(n); $.each(t, function (e, t) { var n = new RegExp(e, "g"); r += a.html().replace(n, t) }), a.html(r) }) },
        mergeArray: function (e, t) { var n = e.concat(t).sort(function (e, t) { return e > t ? 1 : t > e ? -1 : 0 }); return n.filter(function (e, t) { return n.indexOf(e) === t }) },
        injectCss: function (e) { var t = document.getElementsByTagName("head")[0], n = document.createElement("style"); n.setAttribute("type", "text/css"), n.styleSheet ? n.styleSheet.cssText = e : n.appendChild(document.createTextNode(e)), t.appendChild(n) },
        getRandomIntInclusive: function (e, t) { return Math.floor(Math.random() * (t - e + 1)) + e },
        getAbbrNum: function (e, t, n, r) { if (0 > e) var a = -1; else var a = 1; -1 == a ? (a = "-", e = Math.abs(e)) : a = "", t = Math.pow(10, t); for (var o = ["k", "m", "b", "t"], c = o.length - 1; c >= 0; c--) { var u = Math.pow(10, 3 * (c + 1)); if (e >= u) { e = Math.round(e * t / u) / t, 1e3 == e && c < o.length - 1 && (e = 1, c++), e += o[c]; break } } return a + n + e },
        removeDuplicates: function (originalArray, objKey) {
            var trimmedArray = [];
            var values = [];
            var value;
            for (var i = 0; i < originalArray.length; i++) {
                value = originalArray[i][objKey];
                if (values.indexOf(value) === -1) {
                    trimmedArray.push(originalArray[i]);
                    values.push(value);
                }
            }
            return trimmedArray;
        },
        hasDuplicates: function (originalArray, objKey) {
            var hsDup = false;
            var values = [];
            var value;
            for (var i = 0; i < originalArray.length; i++) {
                value = originalArray[i][objKey];
                if (values.indexOf(value) === -1) {
                    values.push(value);
                }
                else {
                    hsDup = true;
                    break;
                }
            }
            return hsDup;
        },
        replaceText: function (selector, replacewith) {
            var all = $(selector + ' *:not(:has("*"))'), maxDepth = 0, deepest = [];
            all.each(function () {
                var depth = $(this).parents().length || 0;
                if (depth > maxDepth) {
                    deepest = [this];
                    maxDepth = depth;
                }
                else if (depth == maxDepth) {
                    deepest.push(this);
                }
            });
            $(deepest[0]).text(replacewith)
        }
    }
}();

/*
Module 2: Application Software
Revel Integration Block
Block 1
*/
//piSession Initialization
(function () {
    //NM:set timeout is not required. initialise need some delay after load session.js
    //So added reference to this file on document.ready at end in player 
    //setTimeout(function(){
    if (typeof window.piSession != 'undefined' && typeof piSession != 'undefined') {
        if (typeof (isModuleLoaded) === 'undefined') {
            window.piSession.initialize("fI4Zr0fVKM7uU6uEueywORt1kfkkFpPU", {
                useJwt: (true)
            });
            piSession.on(piSession.LogoutEvent, function () {
                //window.location.reload();
            });
            piSession.getToken(function (result, token) {
                if (knowdldebugMode) debugger;
                if (result != piSession.Success) {
                    piSession.login(window.location.href, 0);
                } else if (result == piSession.Success) {
                    console.log("PI Token Success");
                } else {
                    console.log("PI Token failure");
                    document.write("<h1>You are not authorized to view this page.</h1>");
                }
            });
        }
    }
    //},2000);
})();

//piSession Initialization

//Life Cycle Events
var LifeCycleEvents = (function () {

    var templateId = "knowdl_test";
    var courseId = "";
    var assignmentId = "";
    var activityId = "";
    var customMode = "";
    var refererUrl = "";

    var postUrl = window.location.origin + "/knowdlsim/assignments"
    var LoggedInUser = {};

    function GetTimeStamp() {
        return Math.floor(Date.now() / 1000).toString();
    }

    function GenerateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    function GetMessageId() {
        return GenerateUUID();
    }

    return {
        InitParams: function () {
            assignmentId = Utility.getParameterByName("assiId", window.location.href);
            activityId = Utility.getParameterByName("actiId", window.location.href);
            courseId = Utility.getParameterByName("courId", window.location.href);
            customMode = Utility.getParameterByName("mode", window.location.href);
            refererUrl = Utility.getParameterByName("refurl", window.location.href);
            templateId = courseId;
        },
        IsAllowPost: function () {
            var allowPost = true;
            if (customMode.toLowerCase() == 'preview' || customMode == 'review') {
                allowPost = false;
            }
            return allowPost;
        },
        OnLoad: function () {
            var msg = {
                messageId: GetMessageId(),
                timestamp: GetTimeStamp(),
                type: "epubsc_message",
                source: templateId,
                method: "epubsc_publish",
                topic: "reader_lifecyle",
                topicData: {
                    event: "onload",
                    item: {
                        "assignmentId": assignmentId,
                        "activityId": activityId,
                    }
                }
            };

            kPostMessage.sendMessage(msg);
        },
        OnInteraction: function (userAction) {
            var msg = {
                messageId: GetMessageId(),
                timestamp: GetTimeStamp(),
                type: "epubsc_message",
                source: templateId,
                method: "epubsc_publish",
                topic: "reader_lifecyle",
                topicData: {
                    event: "oninteraction",
                    interactionSpecifier: userAction,
                    item: {
                        "assignmentId": assignmentId,
                        "activityId": activityId,
                    }
                }
            };

            kPostMessage.sendMessage(msg);
        },
        OnSave: function () {
            /*
            var msg = {
                messageId: GetMessageId(),
                timestamp: GetTimeStamp(),
                type: "epubsc_message",
                source: templateId,
                method: "epubsc_publish",
                topic: "reader_lifecyle",
                topicData: {
                    event: "oninteraction",
                    interactionSpecifier: "save",
                    item: {
                        "assignmentId": assignmentId,
                        "activityId": activityId,
                    }
                }
            };
      
            kPostMessage.sendMessage(msg);
            */
        },
        OnSubmit: function () {
            var msg = {
                messageId: GetMessageId(),
                timestamp: GetTimeStamp(),
                type: "epubsc_message",
                source: templateId,
                method: "epubsc_publish",
                topic: "reader_lifecyle",
                topicData: {
                    event: "onsubmit",
                    item: {
                        "assignmentId": assignmentId,
                        "activityId": activityId,
                    }
                }
            };

            kPostMessage.sendMessage(msg);
        },
        OnComplete: function () {
            var msg = {
                messageId: GetMessageId(),
                timestamp: GetTimeStamp(),
                type: "epubsc_message",
                source: templateId,
                method: "epubsc_publish",
                topic: "reader_lifecyle",
                topicData: {
                    event: "oncomplete",
                    item: {
                        "assignmentId": assignmentId,
                        "activityId": activityId,
                    }
                }
            };
            kPostMessage.sendMessage(msg);
        },
        OnClose: function () {
            var msg = {
                messageId: GetMessageId(),
                timestamp: GetTimeStamp(),
                type: "epubsc_message",
                source: templateId,
                method: "epubsc_publish",
                topic: "reader_lifecyle",
                topicData: {
                    event: "oninteraction",
                    interactionSpecifier: "close",
                    item: {
                        "assignmentId": assignmentId,
                        "activityId": activityId,
                    }
                }
            };
            kPostMessage.sendMessage(msg);
        },
        OnFeedback: function () {
            var msg = {
                messageId: GetMessageId(),
                timestamp: GetTimeStamp(),
                type: "epubsc_message",
                source: templateId,
                method: "epubsc_publish",
                topic: "reader_lifecyle",
                topicData: {
                    event: "onfeedback",
                    item: {
                        "assignmentId": assignmentId,
                        "activityId": activityId,
                    }
                }
            };
            kPostMessage.sendMessage(msg);
        },
        OnError: function (errOj) {
            var msg = {
                messageId: GetMessageId(),
                timestamp: GetTimeStamp(),
                type: "epubsc_message",
                source: templateId,
                method: "epubsc_publish",
                topic: "reader_lifecyle",
                topicData: {
                    event: "onerror",
                    item: {
                        "assignmentId": assignmentId,
                        "activityId": activityId,
                    },
                    error: {
                        code: errOj.code,
                        message: errOj.message,
                        status: errOj.status,
                        description: errOj.description
                    }
                }
            };

            kPostMessage.sendMessage(msg);
        },
        OnResize: function (sizeObj) {

            console.log("Naveen - OnResize() called." + ($(".column") != undefined ? $(".column").height() : "no-column-found"))

            var msg = {
                messageId: GetMessageId(),
                timestamp: GetTimeStamp(),
                type: "epubsc_message",
                source: templateId,
                method: "epubsc_publish",
                topic: "reader_lifecyle",
                topicData: {
                    event: "oninteraction",
                    interactionSpecifier: "resize",
                    item: {
                        "assignmentId": assignmentId,
                        "activityId": activityId,
                    },
                    message: {
                        width: sizeObj.width,
                        height: sizeObj.height
                    }
                }
            };

            kPostMessage.sendMessage(msg);
        },
        GetUserDetails: function () {
            if (typeof piSession == 'undefined')
                return;
            if (LoggedInUser.user == undefined) {
                if (refererUrl == undefined || refererUrl == "") {
                    refererUrl = Utility.getParameterByName("refurl", window.location.href);
                }

                $.ajax({
                    async: false,
                    type: "Get",
                    url: postUrl + "/get_user/" + courseId + "/",
                    headers: { "Refurl": refererUrl, "Correlation-Id": GenerateUUID(), "X-Authorization": piSession.currentToken(), "Content-Type": "application/json" },
                    success: function (data) {
                        LoggedInUser = data;
                    },
                    error: function (xhr, data, message) {
                        console.log("error" + message);
                    }
                });
            }

            return $.extend(true, {}, LoggedInUser)
        },

        SubmitScore: function (score) {
            if (!this.IsAllowPost())
                return;

            if (typeof piSession == 'undefined')
                return;

            var dObj = {
                "provider": gRevelProvider,
                "rawItemScore": Number(score) / 100,
                "submissionTime": Date.now(),
                "assessmentId": assignmentId,
                "activityId": activityId,
                "courseId": courseId,
                "actor": piSession.userId(),
                "activityRevision": "", "doScoreProcessing": "true", "authToken": piSession.currentToken()
            };

            if (refererUrl == undefined || refererUrl == "") {
                refererUrl = Utility.getParameterByName("refurl", window.location.href);
            }

            var data = JSON.stringify(dObj);
            $.ajax({
                type: "Post",
                url: postUrl + "/post_grade/",
                data: data,
                headers: { "Refurl": refererUrl, "Correlation-Id": GenerateUUID(), "X-Authorization": piSession.currentToken(), "Content-Type": "application/json" },
                success: function (data) {
                    console.log("success post score");
                },
                error: function (xhr, data, message) {
                    console.log("error" + message);
                }
            });
        }
    };

})();

var kPostMessage = (function () {
    return {
        receiveMessage: function (e) { },
        sendMessage: function (e) {
            var refUrl = Utility.getParameterByName("refurl", window.location.href);
            if (refUrl.endsWith("/")) {
                refUrl = refUrl.substring(0, refUrl.length - 1)
            }
            var msg = JSON.stringify(e);
            if (refUrl != "") {
                //window.parent.postMessage(msg, "https://revel-ilp-qab.pearson.com")
                window.parent.postMessage(msg, refUrl)
            }
        }
    };
})();

//End Lifecycle events

//Revel Tracking
var _startTime = new Date();
var LaunchModes = { "do": "do", review: "review", setup: "setup", presenter: "presenter", preview: "preview" }
var UserRoles = { learner: "learner", author: "author", presenter: "presenter", educator: "educator" }

var k_Revel = (function () {
    var _data = { CompletionStatus: "Inprogress" }
    var _launchPostData = {}
    var _knowdlPostUrl = window.location.origin + "/knowdlsim/assignments/process"
    var _questionstarttime = new Date();
    var _classAverage = 0;
    var _completedAttemptCount = 0;
    var _settings = { ShowClassAvg: false, TargetPoints: 1, AllowSubmission: true, AllowedAttempts: 0 }
    var _launchData = { courseId: "", assignmentId: "", templateId: "", studentId: "", studentName: "", mode: "do", dueDateMode: "", role: "learner", completedAttemptCount: 0, attemptNo: 0, totalTimeSpent: 0, maxRequestNo: 0, bestScore: 0 }
    var _stateData = {}
    var _isLaunchInitialize = false;
    return {
        set_LaunchInitFlag: function (p_flag) {
            _isLaunchInitialize = p_flag;
        },
        get_Settings: function () {
            return $.extend(true, {}, _settings);
        },
        set_Settings: function (p_settings) {
            _settings = $.extend(true, _settings, p_settings);
        },
        get_LaunchData: function () {
            return $.extend(true, {}, _launchData)
        },
        set_LaunchData: function (p_launchData) {
            _launchData = $.extend(true, _launchData, p_launchData);
        },
        set_LaunchPostData: function (p_launchPostData) {
            _launchPostData = $.extend(true, _launchData, p_launchPostData);
        },
        get_StateData: function () {
            return $.extend(true, {}, _stateData);
        },
        set_StateData: function (p_stateData) {
            _stateData = $.extend(true, {}, p_stateData);
        },
        InitLaunch: function (_skipPostData) {
            var skipInit = false;
            if ((_skipPostData + "") == "true") {
                skipInit = true;
            }
            _questionstarttime = _startTime;
            //var ldata = {};
            _launchData.courseId = Utility.getParameterByName("courId", window.location.href);
            _launchData.assignmentId = Utility.getParameterByName("assiId", window.location.href);
            _launchData.templateId = Utility.getParameterByName("tempId", window.location.href);
            _launchData.mode = Utility.getParameterByName("mode", window.location.href);
            _launchData.attemptNo = Utility.getParameterByName("attno", window.location.href);
            _launchData.studentId = Utility.getParameterByName("stdId", window.location.href);
            if (typeof piSession != 'undefined') {
                _launchData.studentId = piSession.userId()
            }
            _launchPostData.Student_Id = _launchData.studentId;
            _launchPostData.StudentName = "";
            _launchPostData.Role = "";

            if (_launchData.mode == LaunchModes.review) {
                this.GetAttemptData(false)
            }
            else if (!skipInit) {
                this.PostLaunchData(false);
            }
        },
        getClassAverage: function () {
            var localparams = {};
            var jsonSerialized = JSON.stringify(localparams);
            var servcUrl = _knowdlPostUrl + "/" + _launchData.courseId + "/" + _launchData.assignmentId + "/" + _launchData.templateId + "/" + "classaverage" + "/";
            $.ajax({
                type: "POST",
                async: false,
                url: servcUrl,
                data: { jsondata: jsonSerialized },
                success: function (result) {
                    if (result != undefined && $.trim(result) != "") {
                        _classAverage = Number(result);
                    }
                },
                error: function (error) {
                    _classAverage = 0;
                }
            });

            return _classAverage;
        },
        PostQuestionData: function (p_overallScore, p_overallPoints, qObj) {
            //this method is called in UpdateAttemptMaxScore->UpdateUserAttempts to post question data
            //Need to call on pages where UpdateAttemptMaxScore is not called.
            if (_launchData.mode.trim().toLowerCase() == LaunchModes["do"]) {
                QDetails = {};
                if (qObj != undefined && qObj != null) {
                    QDetails.QId = qObj.QId;
                    QDetails.PId = qObj.PId;
                    QDetails.QText = qObj.QText;
                    QDetails.QOptions = qObj.QOptions;
                    QDetails.QSelOptionId = qObj.QSelOptionId;
                    QDetails.QTotal = qObj.QTotal;
                    QDetails.QPoints = qObj.QPoints;
                    QDetails.QCorrectStatus = qObj.QCorrectStatus;
                    QDetails.QTitle = qObj.QTitle;
                    if (QDetails.QTotal == undefined) {
                        QDetails.QTotal = 1;
                    }
                    QDetails.QScore = (Number(QDetails.QPoints) / Number(QDetails.QTotal)) * 100;
                    if (QDetails.QScore == undefined || QDetails.QScore == null) {
                        QDetails.QScore = 0;
                        QDetails.QPoints = 0;
                    } else {
                        QDetails.QScore = Number(Number(QDetails.QScore).toFixed(2));
                    }
                    QDetails.MQAdditionalInfo = ""//this.GetMQAdditionalInfo(qObj.QId);
                    QDetails.AdditionalInfo = qObj.AdditionalInfo;
                }
                _data.QDetails = QDetails;

                //Qtimespent is calculated in post data.
                this.PostData(p_overallScore, p_overallPoints);
            }
        },
        SetCompletion: function (p_overallScore, p_overallPoints, isComplete) {
            //NM: Revel Integration - Life Cycle Events.
            LifeCycleEvents.OnComplete();
            if (_launchData.mode.trim().toLowerCase() == LaunchModes["do"]) {
                _data.QDetails = {};
                _data.CompletionStatus = "complete";
                if (typeof isComplete !== 'undefined' && isComplete == true) {
                    this.PostData(p_overallScore, p_overallPoints, false, false);
                } else {
                    this.PostData(p_overallScore, p_overallPoints, false);
                }
            }
        },
        RetryAttempt: function () {
            //NM: Revel Integration - Life Cycle Events.
            LifeCycleEvents.OnInteraction("Retry Button Click");
            if (_launchData.mode.trim().toLowerCase() == LaunchModes["do"]) {
                _isLaunchInitialize = false;
                _data.QDetails = {};
                _launchPostData.CreateAttempt = "yes";
                _data.CompletionStatus = "inprogress";
                this.InitLaunch();
                _launchPostData.CreateAttempt = "no";
            }
        },
        PostLaunchData: function (p_async) {
            if (knowdldebugMode) debugger;
            var _async = true;
            if (_launchData.mode.trim().toLowerCase() == LaunchModes["do"]) {
                if (typeof (p_async) != 'undefined' && p_async == false) {
                    _async = false;
                }
                var jsonSerialized = JSON.stringify(_launchPostData);
                //replace special characters.
                //jsonSerialized = jsonSerialized.replace(/[^a-zA-Z ',"<>!~@#$%&*.+-=|\?()\[\]_{}\\ ]/g, "");
                var servcUrl = _knowdlPostUrl + "/" + _launchData.courseId + "/" + _launchData.assignmentId + "/" + _launchData.templateId + "/" + "launch" + "/";
                $.ajax({
                    type: "POST",
                    async: _async,
                    url: servcUrl,
                    data: { jsondata: jsonSerialized },
                    success: function (result) {
                        if (knowdldebugMode) debugger;
                        //add/update additional launch data
                        var lData = {}
                        lData.completedAttemptCount = 0;
                        try {
                            if (!isNaN(parseInt(result.CompletedAttemptCount))) {
                                lData.completedAttemptCount = parseInt(result.CompletedAttemptCount)
                            }
                        }
                        catch (err) { }
                        lData.bestScore = 0;
                        try {
                            if (!isNaN(parseFloat(result.bestScore))) {
                                lData.bestScore = parseFloat(result.bestScore)
                            }
                        }
                        catch (err) { }
                        lData.maxRequestNo = 0;
                        try {
                            if (!isNaN(parseInt(result.RequestNo))) {
                                lData.maxRequestNo = parseInt(result.RequestNo)
                            }
                        }
                        catch (err) { }
                        lData.totalTimeSpent = 0;
                        try {
                            if (!isNaN(parseInt(result.TotalTimeSpent))) {
                                lData.totalTimeSpent = parseInt(result.TotalTimeSpent)
                            }
                        }
                        catch (err) { }
                        var dueDateMode = '';
                        try {
                            dueDateMode = JSON.parse(result.dueDateMode);
                        }
                        catch (err) { }
                        if (dueDateMode != "") {
                            lData.dueDateMode = dueDateMode;
                            if (dueDateMode == "preview") {
                                lData.mode = dueDateMode;
                                $.fancybox({
                                    content: '<div style="font-size:16px;max-width:350px;width:100%; padding:10px;" class="Open-Sans-Font"><div style="padding-bottom:20px;">The due date for this assignment is past, and Late Submission is not allowed. You can take this learning tool to review but your score and completion status will not be updated to the gradebook.</div><div style="text-align:center;"><button onclick="$.fancybox.close();" type="button" id="btncontinue" style="cursor:pointer;z-index: 4; padding: 0px; margin-left: 20px; border-radius: 5px; border-color: rgb(0, 0, 0); border-width: 0px; width: 100px; height: 30px; background-color: rgb(0, 127, 163); right: auto; bottom: auto;"><span style="font-size:16px;"><strong><span class="Open-Sans-Font "><span style="color:#FFFFFF;">Continue</span></span></strong></span></button></div></div>',
                                    modal: true
                                });
                            }
                        }
                        k_Revel.set_LaunchData(lData);
                        //end 

                        //add/update additional settings data
                        var setting = {}
                        try {
                            setting = JSON.parse(result.settings);
                        }
                        catch (err) { }
                        k_Revel.set_Settings(setting);
                        //end

                        //Set statedata
                        try {
                            k_Revel.set_StateData(result.StateData);
                        }
                        catch (err) { }
                        k_Revel.set_LaunchInitFlag(true);
                        //end
                    },
                    error: function (error) {
                        if (knowdldebugMode) debugger;
                        //error code goes here.
                    }
                });
            }
            else {
                if (knowdldebugMode) debugger;
                //other mode code goes here.
            }
        },
        PostData: function (p_overallScore, p_overallPoints, p_async, ispopup) {
            LifeCycleEvents.OnSave();
            var _async = true;
            if (_launchData.mode.trim().toLowerCase() == LaunchModes["do"] && _isLaunchInitialize) {
                if (typeof (p_async) != 'undefined' && p_async == false) {
                    _async = false;
                }
                var currTime = new Date();
                if (_data.QDetails != undefined) {
                    if (_data.QDetails.QId != undefined) {
                        _data.QDetails.QTimeSpent = parseInt((currTime.getTime() - _questionstarttime.getTime()) / 1000);
                    }
                }
                _questionstarttime = currTime;
                _data.OverallTimeSpent = parseInt((new Date().getTime() - _startTime.getTime()) / 1000) + _launchData.totalTimeSpent;
                if (p_overallScore == undefined)
                    p_overallScore = 0;
                _data.OverallScore = p_overallScore;
                if (p_overallPoints == undefined)
                    p_overallPoints = 0;
                _data.OverallPoints = p_overallPoints;
                _data.StateData = _stateData;
                _data.Student_Id = _launchData.studentId;
                _launchData.maxRequestNo = _launchData.maxRequestNo + 1;
                _data.RequestNo = _launchData.maxRequestNo;

                var jsonSerialized = JSON.stringify(_data);
                //replace special characters.
                jsonSerialized = jsonSerialized.replace(/[^a-zA-Z ',"<>!~@#$%&*.+-=|\?()\[\]_{}\\ ]/g, "");
                //jsonSerialized = jsonSerialized.replace(/[^a-zA-Z ',"<>!~@#$%&*.+-=|\?()\[\]_{}\\ ]/g, "").replace(/&/g, '%26');
                var servcUrl = _knowdlPostUrl + "/" + _launchData.courseId + "/" + _launchData.assignmentId + "/" + _launchData.templateId + "/" + "updateattemptdata" + "/";
                $.ajax({
                    type: "POST",
                    async: _async,
                    url: servcUrl,
                    data: { jsondata: jsonSerialized },
                    success: function (result) {
                        //Data posted successfully
                        if (ispopup) {
                            if (knowdldebugMode) debugger;
                            $("#dialog").hide();
                        }
                    },
                    error: function (error) {

                    }
                });

                //reset Q Details
                _data.QDetails = {}
            }
        },
        GetAttemptData: function () {
            if (knowdldebugMode) debugger;
            var _async = false;
            if (_launchData.mode.trim().toLowerCase() == LaunchModes.review) {
                if (typeof (p_async) != 'undefined' && p_async == true) {
                    _async = true;
                }

                var qs_studentId = Utility.getParameterByName("stdId", window.location.href);
                if (qs_studentId == undefined || qs_studentId == "") {
                    qs_studentId = _launchData.studentId;
                }
                var qs_attno = Utility.getParameterByName("attno", window.location.href);
                var atmptURL = window.location.origin + "/econservice/knowdlsim/revelintegration/assignments/get_attempt_data";
                var servcUrl = atmptURL + "/" + _launchData.courseId + "/" + _launchData.assignmentId + "/" + _launchData.templateId + "/" + qs_studentId + "/?attno=" + qs_attno;
                $.ajax({
                    type: "GET",
                    async: _async,
                    url: servcUrl,
                    success: function (result) {
                        if (knowdldebugMode) debugger;
                        //add/update additional launch data
                        var lData = {}
                        lData.completedAttemptCount = 0;
                        try {
                            if (!isNaN(parseInt(result.CompletedAttemptCount))) {
                                lData.completedAttemptCount = parseInt(result.CompletedAttemptCount)
                            }
                        }
                        catch (err) { }
                        lData.bestScore = 0;
                        try {
                            if (!isNaN(parseFloat(result.bestScore))) {
                                lData.bestScore = parseFloat(result.bestScore)
                            }
                        }
                        catch (err) { }
                        lData.maxRequestNo = 0;
                        try {
                            if (!isNaN(parseInt(result.RequestNo))) {
                                lData.maxRequestNo = parseInt(result.RequestNo)
                            }
                        }
                        catch (err) { }
                        lData.totalTimeSpent = 0;
                        try {
                            if (!isNaN(parseInt(result.TotalTimeSpent))) {
                                lData.totalTimeSpent = parseInt(result.TotalTimeSpent)
                            }
                        }
                        catch (err) { }
                        k_Revel.set_LaunchData(lData);
                        //end
                        //add/update additional settings data
                        var setting = {}
                        try {
                            setting = JSON.parse(result.settings);
                        }
                        catch (err) { }
                        k_Revel.set_Settings(setting);
                        //end

                        //Set statedata
                        try {
                            k_Revel.set_StateData(result.StateData);
                        }
                        catch (err) { }
                        k_Revel.set_LaunchInitFlag(true);
                        //end                        
                    },
                    error: function (error) {
                        if (knowdldebugMode) debugger;
                        //error code goes here.
                    }
                });
            }
            else {
                if (knowdldebugMode) debugger;
                //error code goes here.
            }
        }

    };
})();

//End Tracking