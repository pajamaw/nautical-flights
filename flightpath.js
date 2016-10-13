let map; //setting map global
let marker;

function initMap() { //creating a new map to be used for the app

//  map = new L.Map(document.getElementById('map'), {center: new L.LatLng(37.0902, -95.7129), zoom: 4});
//  let osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
//  var ggl = new L.Google();
//  var ggl2 = new L.Google('TERRAIN');
//  map.addLayer(ggl);


//   map = new L.Map('map', {
//    center: {lat: 37.0902, lng: -95.7129}, //usa
//    zoom: 4
//  });
//let osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
//var map = new L.Map('map', {center: new L.LatLng(37.0902, -95.7129), zoom: 4});


//var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
//var styles = [
//    {
//      featureType: 'all',
//      stylers: [{hue: '#ff0000'}]
//    }
// ];
//var ggl = new L.Google('ROADMAP', {
//	mapOptions: {
//		styles: styles
//	}
//});

//map.addLayer(ggl);
//map.addControl(new L.Control.Layers( {'OSM':osm, 'Google':ggl}, {}));
let styledMapType = new google.maps.StyledMapType(
    [
      {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [{color: '#c9b2a6'}]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [{color: '#dcd2be'}]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [{color: '#ae9e90'}]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#93817c'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [{color: '#a5b076'}]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#447530'}]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#f5f1e6'}]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{color: '#fdfcf8'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#f8c967'}]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#e9bc62'}]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [{color: '#e98d58'}]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [{color: '#db8555'}]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [{color: '#806b63'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [{color: '#8f7d77'}]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#ebe3cd'}]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [{color: '#dfd2ae'}]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [{color: '#b9d3c2'}]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#92998d'}]
      }
    ],
    {name: 'Styled Map'});

  map = new google.maps.Map(document.getElementById('map'), {

      center: {lat: 37.0902, lng: -95.7129}, //usa
    zoom: 4,
    mapTypeControlOptions: {
      mapTypeIds: ['map', 'satellite', 'styled_map']
    }

 });
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');
};

document.addEventListener("DOMContentLoaded", function(event){
    document.getElementById('button').addEventListener('click', removeAll);

    let flightPoints = [];
    let distancePoints = [];

  const convertToSeaMiles = (dist) => Math.round(dist / 1000 * 0.539957 *10)/10

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

      const distance = google.maps.geometry.spherical.computeDistanceBetween(dPoints[0], dPoints[1]);
      document.getElementById("distance").textContent=`${convertToSeaMiles(distance)} nm`;

      let flightPath = new google.maps.Polyline({
        map: map,
        path: fPoints,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

    }else{
      let reset = confirm("Would you like to reset the form and check a new distance?");

      if(!reset){//if there is a 3rd marker it asks you to reset the page to create a new
                        //a new path or it will negate latest marker
        m.setMap(null);

      }else{

        removeAll();//creates new map to begin new path

      }
    }
  };

  function setMarker(selectedClick, dPoints, fPoints){
    //console.log(selectedClick.item)
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
    //console.log(L.marker())
    dPoints.push(marker.position);
    fPoints.push(marker.coor);
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
              //  debugger;
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
        //do this function when query selected
        setMarker(selected, distancePoints, flightPoints);
      }
  });

});
