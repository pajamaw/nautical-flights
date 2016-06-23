var map;
function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.0902, lng: -95.7129},
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
  function removeAll(){
    flightPoints = [];
    distancePoints = [];
    initMap();
    document.getElementsByClassName('autocomplete1').value="";
    document.getElementById('autocomplete2').value="";
    document.getElementById('distance').textContent="0"
    distance = 0;
    flightPath = 0;
    document.getElementById('autocomplete2').value="";

  };
  function checkFlightPath(fPoints, dPoints, m){
    if(fPoints.length > 1){
      createFlightPath(fPoints, dPoints, m);
    };
  }
  function createFlightPath(fPoints, dPoints, m){
    if(fPoints.length == 2){
      var distance = google.maps.geometry.spherical.computeDistanceBetween(dPoints[0], dPoints[1]);
      document.getElementById("distance").textContent=convertToSeaMiles(distance);
      var flightPath = new google.maps.Polyline({
        map: map,
        path: fPoints,//flightPlanCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      //console.log(convertToSeaMiles(distance)+ " in nautical miles")
      //debugger;
    }else{ //fPoints.length > 2)
        var reset = confirm("Would you like to reset the form and check a new distance?");
        if(reset != true){
          m.getMap(null);
        }
        removeAll();
    }
  };

  $('.autocomplete').autocomplete({
      source: function( request, response ) {
          $.ajax({
              url: "//www.air-port-codes.com/search/",
              jsonp: "callback",
              dataType: "jsonp",
              data: {
                  term: request.term, // input field value
                  limit: 100, // default is 30
                  size: 0, // default is 0
                  key: "b34e0b6ea2", // dont forget to add your API Key from your air-port-codes account
                  secret: "ce36bb996d28c2c"
              },
              success: function( data ) {
                //debugger;
                  if (data.status) { // success
                      response( data.airports.filter(function (airport) {
                        return airport.country.iso === "US" && airport.latitude !== null;
                      }).map(function(ap) {
                          return {
                              label: ap.name +' (' + ap.iata + ')',
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
          console.log(selected);
          console.log(selected.item);
          console.log(selected.item.location);
          var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: selected.item.LatLng,
            coor: {
              lat: selected.item.LatLng.lat,
              lng: selected.item.LatLng.lng
            },
            label: selected.item.label,
            title: "wooot"//ui.item.label
          });

          distancePoints.push(marker.position);
          flightPoints.push(marker.coor);

          console.log(flightPoints.length);
          checkFlightPath(flightPoints);

      }

  });

});
//document.write('\//<SCR'+'IPT src=https://maps.googleapis.com/maps/api/js?key=AIzaSyA_5h7UwDWuzihCPUwd8FA_NKgEJM30URk&callback=initMap><\/SCR'+'IPT>');
