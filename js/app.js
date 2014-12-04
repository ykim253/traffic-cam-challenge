// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {

    var mapElem = document.getElementById('map');

    //catch resizing through jQuery
    $(window).resize(function() {
        var winHeight = Number($(this).height());
        var mapTop = $('#map').position().top;
        $('#map').height(winHeight - mapTop - 20);
    });

    //initialize map
    var map = new google.maps.Map(mapElem, {
        center: { lat: 47.6, lng: -122.3},
        zoom: 12
    });

    //initializing 1 infoWindow
    var infoWindow = new google.maps.InfoWindow();

    //placeholder for places (filtering)
    var places = [];
    //all the cameras
    var cameras;

    $.getJSON("http://data.seattle.gov/resource/65fc-btcc.json")
        .done(function (data) {
            cameras = data;
            //for each camera
            data.forEach(function(place) {
                //create marker with coordinates on map
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(place.location.latitude),
                        lng: Number(place.location.longitude)
                    },
                    map: map
                });

                //put object in array for searching later
                places.push(marker);

                //opens infoWindow with relevant content
                google.maps.event.addListener(marker, 'click', function() {
                    var label = '<h2>' + place.cameralabel + '</h2>';
                    var img = '<img src=' + place.imageurl.url + '></img>';
                    map.panTo(this.getPosition());
                    infoWindow.setContent(label + img);
                    infoWindow.open(map, this);
                    //animation
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        marker.setAnimation(null);
                    }, 750);
                });
            })
        })

        .fail(function (error) {
            alert("Failure is unacceptable but it happens");
        });


    //search filter
    $('#search').bind('search keyup', function() {
        var search = document.getElementById('search').value.toLowerCase();
        for (var i = 0; i < cameras.length; i++) {
            if (cameras[i].cameralabel.toLowerCase().indexOf(search) == -1) {
                places[i].setMap(null);
            } else {
                places[i].setMap(map);
            }
        }
    });

    //Hide infoWindow
    google.maps.event.addListener(map, 'click', function() {
        infoWindow.close();
    });

});