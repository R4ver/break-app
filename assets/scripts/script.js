$(document).ready(function() {

    var body = $("body");

    var jsonData = [];

    //Get the JSON and save to array and call functions
    $.getJSON('assets/scripts/data.json', function(data) {
        //Get the data into local array
        jsonData = data;

        //Request permission
        permissions();

        //Render home page
        render("Home");

        //Browser compatibility
        test();
    });

    setInterval(function() {
        checkTime(localStorage.getItem("aspit_location"));
    }, 1000);

    //Check for notifications
    var permissions = function() {
        if ( !("Notification" in window) ) { //If the browser doesn't supports desktop notifications - Error
            alert("This browser does not support desktop notification");
        } else if ( Notification.permission !== 'denied' ) { //Else if it's supported and the permission is not denied - ask permission
            Notification.requestPermission();
        }
    };

    //Render on pages
    var render = function(arg) {
        //Clear the page for content before rendering new content
        $(".page-article").empty();

        for ( var item in jsonData.aspit ) {
            var key = jsonData.aspit[item];

            var city = key.city;
            var time = key.times;
            var image = key.image;

            var page = key.page;
            var content = key.content;

            //If the page is a city
            if ( city === arg ) {
                for ( var i = 0; i < key.times.length; i++ ) {
                    $(".page-article").append("<section class='article-card'><span>Pause: " + time[i][0] + " - " + time[i][1] + "</span></section>");
                }

                if ( city === "Rønne" || image === true ) {
                    $(".page-cover").prepend("<div class='overlay'></div><img src='assets/images/Ronne-small.jpg' srcset='assets/images/Ronne-medium.jpg 1000w, assets/images/Ronne-large.jpg 2000w' />");
                } else if ( image === true ) {
                    $(".page-cover").prepend("<div class='overlay'></div><img src='assets/images/" + city + "-small.jpg' srcset='" + city + "-medium.jpg 1000w, " + city + "-large 2000w.jpg' />");
                } else {
                    $(".page-cover").empty();
                }
            }

            //If the page is an actual page - not ment for city times
            if ( page === arg ) {
                $(".page-article").append("<p>" + content + "</p>");
            }
        }
        setLocation();
    };

    //Notifications
    var nt = function(the_body, the_icon, the_title) {
        var isIE = /*@cc_on!@*/false || !!document.documentMode;   // At least IE6

        var options = {
            body: the_body,
            icon: the_icon
        }

        if ( isIE ) { //If the browser is IE - use alerts instead         
            // alert(the_title + " : " + the_body);
            var title = document.title;
            var intv = window.setInterval(function () {
                document.title = document.title === '' ? title : '';
            }, 500);
        } else { //Else create desktop notification
            var n = new Notification(the_title, options);
        }
    };

    // call this to stop the blinking
    function stopBlink() {
        window.clearInterval(intv);
        document.title = title;
    }

    //Check time
    var checkTime = function(arg) {

        for ( var item in jsonData.aspit ) {
            var key = jsonData.aspit[item];

            var city = key.city;
            var time = key.times;

            if ( city === arg ) {
                for ( var i = 0; i < key.times.length; i++ ) {
                    var cuho = new Date().getHours(); //Curent hours
                    var cumi = new Date().getMinutes(); //Curent minutes
                    var cuse = new Date().getSeconds(); //Curent seconds

                    var times  = [];
                    var split1 = [];

                    //Convert times from string to number so it will be checked
                    //in the if statements
                    times += key.times[i];
                    var conv_times = times.replace(/:|,/g,' ').split(" ").map(Number);

                    //Breaks begin
                    if ( cuho === conv_times[0] && cumi === conv_times[1] && cuse === 0 ) {
                        nt("Time to take a break", "assets/images/alarm.svg", "Break " + cuho + ":" + cumi);
                    }

                    //Breaks end
                    if ( cuho === conv_times[2] && cumi === conv_times[3] && cuse === 0 ) {
                        nt("Class start again", "assets/images/alarm.svg", "Break Over" + cuho + ":" + cumi);
                    }
                }
            }
        }
    };

    //Set location
    var setLocation = function () {
        var $set = $(".set-location");
        var location = $(".location-name").html();
        $set.css("display", "none");

        //If the location is already set for this city - disable
        if ( location === localStorage.getItem("aspit_location") ) {
            $set.addClass("set-location--disabled");
            $set.removeAttr('href');
        } else { //Else it is not set - enable
            $set.removeClass("set-location--disabled");
            $set.attr("href", "#");
        }

        //If the page is == city - show button
        //Set location on localStorage
        if ( $(".page-content").hasClass("city") ) {
            $set.css("display", "inline-block");
            $set.click(function() {
                //Save in localStorage "aspit_location"
                localStorage.setItem("aspit_location", location);
                //Disable button upon setting location
                $(this).addClass("set-location--disabled");
            });
        }
    };

    //Functionality testing
    var test = function() {
        //Test notifications
        if ( !("Notification" in window) ) {
            $(".resource-notification").css("background-color", "red");
        } else {
            $(".resource-notification").css("background-color", "rgba(0,240,0,1)");
        }

        //Test localStorage
        if( typeof Storage === "undefined" ) {
            $(".resource-localstorage").css("background-color", "red");
        } else {
            $(".resource-localstorage").css("background-color", "rgba(0,240,0,1)");
        }

        //Test location
        if ( localStorage.getItem("aspit_location") === "undefined" ) {
            $(".resource-location").css("background-color", "red");
        } else {
            $(".resource-location").css("background-color", "rgba(0,240,0,1)");
        }

        //Test browser
        var isIE = /*@cc_on!@*/false || !!document.documentMode;   // At least IE6
        if ( isIE ) {
            $(".resource-browser").css("background-color", "rgba(0,240,0,1)");
        } else {
            $(".resource-browser").css("background-color", "red");
        }
    };

    //For template navigation
    $(".page-nav ul li a").click(function() {

        //Simulate new page (url)
        //Desktop
        if ( $(".page-nav ul li a").hasClass("nav--active") ) {
            $(".page-nav ul li a").removeClass("nav--active");
            $(this).addClass("nav--active");
        }

        //Check if page is a - content page
        if ( $(this).hasClass("nav-item") ) {
            var page = $(this).html();

            $("#pageMain").removeAttr("class");
            $(".set-location").empty();
            $(".set-location").css("display", "none");

            $("#pageMain").addClass("page-content page page-" + page);

            $(".page-city").html(page);
            render(page);

            //Check if the page is the home page, if true - render browser test
            if ( $("#pageMain").hasClass("page-Home") ) {
                test();
            }
        }

        //Check if page is a - city page
        if ( $(this).hasClass("nav-city") ) {
            var city = $(this).html();

            //Clean up classes and content
            $("#pageMain").removeAttr("class");
            $("#setLocation").empty();
            $("#setLocation").removeAttr("class");

            //Add classes and content
            $("#pageMain").addClass("page-content city city-" + city);
            $("#setLocation").addClass("set-location set-location--name=" + city);
            $("#setLocation").html("Set location: <span class='location-name'>" + city + "</span>");

            $(".page-city").html(city + " Times");
            render(city);
        }
    });
});