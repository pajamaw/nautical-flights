var map; //setting map global
var marker;
function initMap() { //creating a new map to be used for the app
map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.0902, lng: -95.7129}, //usa
    zoom: 4
  });
};
document.addEventListener("DOMContentLoaded", function(event){
  document.getElementById('button').addEventListener('click', removeAll);

  var flightPoints = [];
  var distancePoints = [];

  function convertToSeaMiles(dist) {
    return Math.round(dist / 1000 * 0.539957 *10)/10
  };
  function removeMarker(){
    flightPoints.pop();
    distancePoints.pop();
  };
  function removeAll(){ //used to reset map after button click or additional point requested
    flightPoints = [];
    distancePoints = [];
    initMap();
    clearInputs();
    document.getElementById('distance').textContent="0"
    distance = 0;
    flightPath = 0;
  };
  function clearInputs(){
    document.getElementById('autocomplete1').value="";
    document.getElementById('autocomplete2').value="";
  };
  function checkFlightPath(fPoints, dPoints, m){//to ensure that polylines only are created when there are single points
    if(fPoints.length > 1){
      createFlightPath(fPoints, dPoints, m);
    };
  }
  function panToMarker(fPoints, m){//prevents markers from being panned to when there are already 2 markers on the page
    if (fPoints.length < 3){
      map.panTo(m.coor);
    };
  }
  function createFlightPath(fPoints, dPoints, m){//creates geodesic polyline
    if(fPoints.length == 2){
      var distance = google.maps.geometry.spherical.computeDistanceBetween(dPoints[0], dPoints[1]);
      document.getElementById("distance").textContent=convertToSeaMiles(distance);
      var flightPath = new google.maps.Polyline({
        map: map,
        path: fPoints,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
    }else{
        var reset = confirm("Would you like to reset the form and check a new distance?");
        if(reset != true){//if there is a 3rd marker it asks you to reset the page to create a new
                          //a new path or it will negate latest marker
          m.setMap(null);
        }else{
          removeAll();//creates new map to begin new path

        }
    }
  };
  function setMarker(selectedClick, dPoints, fPoints){
    marker = new google.maps.Marker({//sets marker using new cooridnates
      map: map,
      animation: google.maps.Animation.DROP,
      position: selectedClick.item.LatLng,
      coor: {
        lat: selectedClick.item.LatLng.lat,
        lng: selectedClick.item.LatLng.lng
      },
      label: selectedClick.item.label
    });
    distancePoints.push(marker.position);
    flightPoints.push(marker.coor);
    panToMarker(fPoints, marker);
    checkFlightPath(fPoints, dPoints, marker);
  };

  $('.autocomplete').autocomplete({//autocomplete ajax function
      source: function(request, response) {
          $.ajax({//ajax request using airport codes api to grab all the airport codes for the world
              url: "//www.air-port-codes.com/search/",
              jsonp: "callback",
              dataType: "jsonp",
              data: {
                  term: request.term, // input field value
                  limit: 100,
                  size: 0,
                  key: "b34e0b6ea2",
                  secret: "ce36bb996d28c2c"
              },
              success: function(data) {
                //debugger;
                  if (data.status) { // success
                      response(data.airports.filter(function (airport) {
                        //filters through airports to only use US airport locations that
                        //have valid lat and lng
                        return airport.country.iso === "US" && airport.latitude !== null;
                      }).map(function(ap) {
                          return {
                              label: ap.name, //autcompleted name
                              state: ap.state.abbr,
                              LatLng: {
                                lat: parseFloat(ap.latitude),
                                lng: parseFloat(ap.longitude)
                              }
                          }
                      }));
                  } else { // no results
                      response();
                  }
              }
          });
      },
      select: function(event, selected) {
        setMarker(selected, distancePoints, flightPoints);
      }
  });

});
