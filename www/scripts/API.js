/// <reference path="jquery.js" />

$(document).ready(function () {

    function addOverlay() {

        $('<div id="overlay"></div>').appendTo('.all-elements');
       // $("#status").fadeOut(); // will first fade out the loading animation
       // $("#preloader").delay(100).fadeOut("slow"); // will fade out the white DIV that covers the website.
    }


    $('#mobile_TXT').on('keydown', function (e) { -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) || /65|67|86|88/.test(e.keyCode) && (!0 === e.ctrlKey || !0 === e.metaKey) || 35 <= e.keyCode && 40 >= e.keyCode || (e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) && (96 > e.keyCode || 105 < e.keyCode) && e.preventDefault() });

    // check if user login
    var getData = JSON.parse(localStorage.getItem("userDataInfo"));
    if (getData != null) {
        $(".userClass").html("Welcome " + getData.fullName + "!");
        // hide login and register button div
        $(".logout_BTN").show();
        // show user ddl 
        $(".login_BTN").hide();
        $(".register_BTN").hide();
        $(".registered_BTN").show();

        // if in reservation page fill data
        var url = document.location.href;
        var index = url.lastIndexOf("/") + 1;
        var filenameWithExtension = url.substr(index);
        var filename = filenameWithExtension.split(".")[0]; // <-- added this line 
        if (filename == "reservation") {

            $("#fullName_TXT").val(getData.fullName);
            $("#fullName_TXT").attr("readonly", "readonly");

            $("#mobile_TXT").val(getData.mobile);
            $("#mobile_TXT").attr("readonly", "readonly");

            $("#cardNumber_TXT").val(getData.cardNumber);
            $("#cardNumber_TXT").attr("readonly", "readonly");

            
        }

    }
    else
    {
        $(".userClass").html("Welcome Vistor!");
        $(".logout_BTN").hide();
        $(".login_BTN").show();
        $(".register_BTN").show();
        $(".registered_BTN").hide();
    }

   

    $("#login_BTN").click(function () {
        $("#login_BTN").attr("disabled", "disabled");
        if ($("#mobile_TXT").val() == "" || $("#mobile_TXT").val() == null || $("#mobile_TXT").val() == "Mobile") {
            alert("Mobile is requierd!");
            $("#mobile_TXT").focus();
            return false;
        }
        else if ($("#password_TXT").val() == "" || $("#password_TXT").val() == null || $("#password_TXT").val() == "password") {
            alert("Password is requierd!");
            $("#password_TXT").focus();
            return false;
        }

        var mobile = $("#mobile_TXT").val();
        var password = $("#password_TXT").val();

        addOverlay();
        $("#login_BTN").attr("disabled", "disabled");



        var urlPath = 'http://carfix-ph.com/Home/LoginApp?mobile=' + mobile + '&password=' + password;

        $.ajax({
            url: urlPath,

            success: function (data) {

                $("#login_BTN").removeAttr("disabled");
                $('#overlay').remove();

                if (!data.isError) {
                  
                    // add login to local storage with replace exist
                    localStorage.setItem('userDataInfo', JSON.stringify(data.data));
                    window.location.href = "index.html";
                }
                else {

                    alert(data.msg);
                }


            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#login_BTN").removeAttr("disabled");
                $('#overlay').remove();
                alert(jqXHR.msg);

            }
        });
       
    });

    $("#logout_BTN").click(function () {

        // logout 

        // remove login to local storage with replace exist
        localStorage.removeItem('userDataInfo');
        $(".userClass").html("Welcome Vistor!");
        $(".logout_BTN").hide();
        $(".registered_BTN").hide();
        $(".login_BTN").show();
        $(".register_BTN").show();
        window.location.href = "index.html";
    });



    $("#register_BTN").click(function () {

        var json = {};

        var fullName = $("#fullName_TXT").val();
        var mobile = $("#mobile_TXT").val();
        var email = $("#email_TXT").val();
        var password = $("#password_TXT").val();
        var cardNumber = $("#cardNumber_TXT").val();


        json.fullName = fullName;
        json.mobile = mobile;
        json.email = email;
        json.password = password;
        json.cardNumber = cardNumber;


        if (fullName == "" || fullName=="Name") {

            alert("Full Name Is Required!");
            $("#fullName_TXT").focus();
            return false;
        }
        else if (mobile == "" || mobile=="Mobile") {
            alert("Mobile Is Required!");
            $("#mobile_TXT").focus();
            return false;
        }
        else if (mobile.length != 11) {
            alert("Mobile Is not Valid!");
            $("#mobile_TXT").focus();
            return false;
        }
        
        else if (email != "E-Mail" && (! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            alert("Email Is Not Valid!");
            $("#email_TXT").focus();
            return false;
        }
        
        else if (password == "" || password == "password") {
            alert("Password Is Required!");
            $("#password_TXT").focus();
            return false;
        }



        json = JSON.stringify(json);

        addOverlay();
      

        $.ajax({
            url: 'http://carfix-ph.com/Home/RegisterApp?json=' + json,



            success: function (data) {
                $('#overlay').remove();
                alert(data.msg);

                if (!data.isError) {
                    window.location.href = "login.html";
                }


            },
            error: function (data) {
                $('#overlay').remove();
                alert(data.msg);

            }
        });



    });

        


    $("#resrvation_BTN").click(function () {

        


        var userDate = $("#userDate_DT").val();
        var cardId = $("#cardNumber_TXT").val();
        var description = $("#message_TXT").val();
        var kilometers = $("#kilometer_TXT").val();
        var fullname = $("#fullName_TXT").val();
        var mobile = $("#mobile_TXT").val();
        var branchName = $("#branch_DDL").val();
        var MaintainTypesArray = [];

        if (cardId == "Card Number")
            cardId = "";
        if (kilometers == "Current Kilometer")
            kilometers = "";
        if (description == "Message")
            description = "";

        var ReservationTypeCount = $(".switch-1-on").length;


        if (fullname == "" || fullname == "Name") {

            alert("Full Name Is Required!");
            $("#fullName_TXT").focus();
            return false;
        }
        else if (mobile == "" || mobile == "Mobile") {
            alert("Mobile Is Required!");
            $("#mobile_TXT").focus();
            return false;
        }

        else if (mobile.length != 11) {
            alert("Mobile Is not Valid!");
            $("#mobile_TXT").focus();
            return false;
        }

        else if (ReservationTypeCount <= 0) {
            alert("Please select at least one service!");
            return false;
        }


        var answer = confirm("Are you sure to send your reservation?");
        if (answer) {

           
           


            var json = {};
            json.userDate = userDate;
            json.cardId = cardId;
            json.description = description;
            json.kilometers = kilometers;
            json.fullname = fullname;
            json.mobile = mobile;
            json.branchName = branchName;
            json.userId = 0;
            var getData = JSON.parse(localStorage.getItem("userDataInfo"));
            if (getData != null)
                json.userId = getData.userId;

            if ($("#oileChange_S").hasClass("switch-1-on")) {
                MaintainTypesArray.push(1);
            }

            if ($("#filterChange_S").hasClass("switch-1-on")) {
                MaintainTypesArray.push(2);
            }

            if ($("#suspension_S").hasClass("switch-1-on")) {
                MaintainTypesArray.push(3);
            }

            if ($("#lubricants_S").hasClass("switch-1-on")) {
                MaintainTypesArray.push(4);
            }

            if ($("#lampCheck_S").hasClass("switch-1-on")) {
                MaintainTypesArray.push(5);
            }

            if ($("#break_S").hasClass("switch-1-on")) {
                MaintainTypesArray.push(6);
            }

            if ($("#wheel_S").hasClass("switch-1-on")) {
                MaintainTypesArray.push(7);
            }

            if ($("#balancing_S").hasClass("switch-1-on")) {
                MaintainTypesArray.push(8);
            }

            if ($("#nitrogen_S").hasClass("switch-1-on")) {
                MaintainTypesArray.push(9);
            }

            if ($("#wash_S").hasClass("switch-1-on")) {
                MaintainTypesArray.push(10);
            }

            if ($("#care_S").hasClass("switch-1-on")) {
                MaintainTypesArray.push(11);
            }

            if ($("#other_S").hasClass("switch-1-on")) {
                MaintainTypesArray.push(12);
            }

            
            
            json = JSON.stringify(json);

            addOverlay();


            $.ajax({
                url: 'http://carfix-ph.com/Home/RecervationApp?json=' + json + '&types=' + MaintainTypesArray,
                //contentType: 'application/json; charset=utf-8',
                //type: 'POST',
                //crossDomain: true,
                //dataType: 'json',


                success: function (data) {

                    $('#overlay').remove();
                    alert(data.msg);
                    window.location.href = "index.html";
                },
                error: function (data) {
                    $('#overlay').remove();
                    alert(data.msg);

                }
            });

        }
    });


    $("#contact_BTN").click(function () {

        var json = {};

        var fullName = $("#contactNameField").val();
        var mobile = $("#contactMobileField").val();
        var email = $("#contactEmailField").val();
        var message = $("#contactMessageTextarea").val();


        json.fullName = fullName;
        json.mobile = mobile;
        json.email = email;
        json.message = message;


        if (fullName == "" || fullName == "Name") {

            alert("Full Name Is Required!");
            $("#contactNameField").focus();
            return false;
        }
        else if (mobile == "" || mobile == "Mobile") {
            alert("Mobile Is Required!");
            $("#contactMobileField").focus();
            return false;
        }
        else if (mobile.length != 11) {
            alert("Mobile Is not Valid!");
            $("#contactMobileField").focus();
            return false;
        }

        else if (email != "Email" && (! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            alert("Email Is Not Valid!");
            $("#contactEmailField").focus();
            return false;
        }

        else if (message == "" || message == "Message") {
            alert("Message Is Required!");
            $("#contactMessageTextarea").focus();
            return false;
        }



        json = JSON.stringify(json);

        addOverlay();


        $.ajax({
            url: 'http://carfix-ph.com/Home/ContactApp?json=' + json,



            success: function (data) {
                $('#overlay').remove();
                alert(data.msg);

                $("#contactNameField").val("Name");
                $("#contactMobileField").val("Mobile");
                $("#contactEmailField").val("Email");
                $("#contactMessageTextarea").val("Message");

            },
            error: function (data) {
                $('#overlay').remove();
                alert(data.msg);

            }
        });



    });

    

    $("#closeApp").click(function () {
        var r = confirm("Do you want to exit?");
        if (r == true) {
            navigator.app.exitApp();
        }
    });

});