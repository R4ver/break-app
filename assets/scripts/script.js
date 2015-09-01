$(document).ready(function() {

    var body = $("body");

    var jsonData = [];

    //Get the JSON and save to array and call functions
    $.getJSON('assets/scripts/data.json', function(data) {
        jsonData = data;

        //Request permission
        permissions();

        //Render home page
        render("Home");
        console.log(localStorage.getItem("aspit_location"));
    });

    setInterval(function() {
        checkTime(localStorage.getItem("aspit_location"));
    }, 1000);

    //Check for notifications
    var permissions = function() {
        if ( !("Notification" in window) ) {
            alert("This browser does not support desktop notification");
        } else if ( Notification.permission !== 'denied' ) {
            Notification.requestPermission();
        }
    };

    //Render on index page console
    var render = function(arg) {
        $(".page-article").empty();

        for ( var item in jsonData.aspit ) {
            var key = jsonData.aspit[item];

            var city = key.city;
            var time = key.times;

            var page = key.page;
            var content = key.content;

            if ( city === arg ) {
                for ( var i = 0; i < key.times.length; i++ ) {
                    $(".page-article").append("<section class='article-card'><span>Pause: " + time[i][0] + " - " + time[i][1] + "</span></section>");
                }
            }

            if ( page === arg ) {
                $(".page-article").append("<p>" + content + "</p>");
            }
        }

        //checkLocation();
        setLocation();
    };

    //Notifications
    var nt = function(the_body, the_icon, the_title) {

        var options = {
            body: the_body,
            icon: the_icon
        }

        var n = new Notification(the_title, options);
    };

    //Check time
    var checkTime = function(arg) {

        for ( var item in jsonData.aspit ) {
            var key = jsonData.aspit[item];

            var city = key.city;
            var time = key.times;

            if ( city === arg ) {
                for ( var i = 0; i < key.times.length; i++ ) {
                    var cuho = new Date().getHours();
                    var cumi = new Date().getMinutes();
                    var cuse = new Date().getSeconds();

                    var times  = [];
                    var split1 = [];

                    times += key.times[i];
                    var conv_times = times.replace(/:|,/g,' ').split(" ").map(Number);

                    // console.log(cuho + ":" + cumi + ":" + cuse);
                    // console.log(conv_times[0] + " " + conv_times[1]);
                    // console.log(conv_times[2] + " " + conv_times[3]);

                    //Breaks
                    if ( cuho === conv_times[0] && cumi === conv_times[1] && cuse === 0 ) {
                        nt("Time to take a break", "assets/images/alarm.svg", "Break " + cuho + ":" + cumi);
                    }

                    //Class starts again
                    if ( cuho === conv_times[2] && cumi === conv_times[3] && cuse === 0 ) {
                        nt("Class start again", "assets/images/alarm.svg", "Break Over");
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

        if ( location === localStorage.getItem("aspit_location") ) {
            $set.addClass("set-location--disabled");
            $set.removeAttr('href');
        } else {
            $set.removeClass("set-location--disabled");
            $set.attr("href", "#");
        }

        if ( $(".page-content").hasClass("city") ) {
            $set.css("display", "inline-block");
            $set.click(function() {
                //Save in localStorage "aspit_times"
                localStorage.setItem("aspit_location", location);
                $(this).addClass("set-location--disabled");
            });
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

        //Render pages on click
        if ( $(this).hasClass("nav-item") ) {
            var page = $(this).html();

            $("#pageMain").removeAttr("class");
            $(".set-location").empty();
            $(".set-location").css("display", "none");

            $("#pageMain").addClass("page-content page page-" + page);

            $(".page-city").html(page);
            render(page);
        }

        //Render the cities on click
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


      //-------------------------------------------//
     //              Old functions                //
    //-------------------------------------------//
    //Format the text and save to localStorage
    // var saveAll = function() {
    //     var saveData = []

    //     //This loop gets the array number eg. jsonData.aspit[0, 1, 2] etc..
    //     for ( var item in jsonData.aspit ) {
            
    //         var city = jsonData.aspit[item].city;
    //         var times = []

    //         //Get times from array
    //         for ( var i = 0; i < jsonData.aspit[item].times.length; i++ ) {
    //             times += jsonData.aspit[item].times[i] + " | ";
    //         }

    //         saveData += "--" + city + ": ";
    //         //Save times and replace commas with dash
    //         saveData += times.replace(/,/g, " - ");

    //         console.log(saveData);

    //         //Save in localStorage "aspit_times"
    //         localStorage.setItem("aspit_times", JSON.stringify(saveData));
    //     }
    // };

    // //Save specific city
    // var save = function(arg) {
    //     var saveData = [];

    //     //This loop gets the array number eg. jsonData.aspit[0, 1, 2] etc..
    //     for ( var item in jsonData.aspit ) {
    //         var key = jsonData.aspit[item];

    //         var city = key.city;
    //         var times = [];

    //         //Check for the specific city
    //         if ( key.city === arg ) {
    //             for ( var i = 0; i < key.times.length; i++ ) {
    //                 times += key.times[i] + " | ";
    //             }

    //             saveData += arg + ": ";
    //             //Save times and replace commas with dash
    //             saveData += times.replace(/,/g, " - ");
    //         }
    //     }
      
    //     console.log(saveData);

    //     //Save in localStorage "aspit_times"
    //     localStorage.setItem("aspit_times", JSON.stringify(saveData));
    // }
      //-------------------------------------------//
     //           Old functions End               //
    //-------------------------------------------//
});