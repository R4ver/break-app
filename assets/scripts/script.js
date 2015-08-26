$(document).ready(function() {

    var jsonData = [];

    //Get the JSON and save to array and call functions
    $.getJSON('assets/scripts/data.json', function(data) {
        jsonData = data;

        //Render home page
        render("Home");
    });

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
                console.log(arg);
                for ( var i = 0; i < key.times.length; i++ ) {
                    console.log(time[i]); 

                    $(".page-article").append("<section class='article-card'><span>Pause: " + time[i][0] + " - " + time[i][1] + "</span></section>");
                }
            }

            if ( page === arg ) {
                $(".page-article").append("<p>" + content + "</p>");
            }
        }
    };

    //Format the text and save to localStorage
    var saveAll = function() {
        var saveData = []

        //This loop gets the array number eg. jsonData.aspit[0, 1, 2] etc..
        for ( var item in jsonData.aspit ) {
            
            var city = jsonData.aspit[item].city;
            var times = []

            //Get times from array
            for ( var i = 0; i < jsonData.aspit[item].times.length; i++ ) {
                times += jsonData.aspit[item].times[i] + " | ";
            }

            saveData += "--" + city + ": ";
            //Save times and replace commas with dash
            saveData += times.replace(/,/g, " - ");

            console.log(saveData);

            //Save in localStorage "aspit_times"
            localStorage.setItem("aspit_times", JSON.stringify(saveData));
        }
    };

    //Save specific city
    var save = function(arg) {
        var saveData = [];

        //This loop gets the array number eg. jsonData.aspit[0, 1, 2] etc..
        for ( var item in jsonData.aspit ) {
            var key = jsonData.aspit[item];

            var city = key.city;
            var times = [];

            //Check for the specific city
            if ( key.city === arg ) {
                for ( var i = 0; i < key.times.length; i++ ) {
                    times += key.times[i] + " | ";
                }

                saveData += arg + ": ";
                //Save times and replace commas with dash
                saveData += times.replace(/,/g, " - ");
            }
        }

        console.log(saveData);

        //Save in localStorage "aspit_times"
        localStorage.setItem("aspit_times", JSON.stringify(saveData));
    }

    //For template navigation
    $(".page-nav ul li a").click(function() {
        if ( $(".page-nav ul li a").hasClass("nav--active") ) {
            $(".page-nav ul li a").removeClass("nav--active");
            $(this).addClass("nav--active");
        }

        if ( $(this).hasClass("nav-item") ) {
            var page = $(this).html();

            $(".page-city").html(page);
            render(page);
        }

        if ( $(this).hasClass("nav-city") ) {
            var city = $(this).html();

            $(".page-city").html(city + " Times");
            render(city);
        }      
    });
});