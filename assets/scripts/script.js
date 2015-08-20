$(document).ready(function() {

    var jsonData = [];

    //Get the JSON and save to array and call functions
    $.getJSON('data.json', function(data) {

        jsonData = data;
        //render();
        saveAll();
        //save("Rønne");

        //Clear jsonData array
        jsonData = [];
    });

    //Render on index page console
    var render = function() {
        for ( var item in jsonData.aspit ) { 

            var key = jsonData.aspit[item];

            console.log(key.city);
            for ( var x = 0; x < key.times.length; x++ ) {
                console.log(key.times[x]);
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
        console.log("click");
        if ( $(".page-nav ul li a").hasClass("nav--active") ) {
            $(".page-nav ul li a").removeClass("nav--active");
            $(this).addClass("nav--active");
        }      
    });
});