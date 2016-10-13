const key =  "b34e0b6ea2"
const secret =  "ce36bb996d28c2c"


return fetch('//www.air-port-codes.com/search/', {
    jsonp: 'callback',
    dataType: 'jsonp',
    mode: 'no-cors',
    data: {
      term: "Denver",
      limit: 100,
      size: 0,
      key: `${key}`,
      secret: `${secret}`
  }
}).then(res => res.json()).then(json => console.log(json)).then(json => console.log(json))

  function call_this(req, response) {
      $.ajax({//ajax request using airport codes api to grab all the airport codes for the world
          url: "//www.air-port-codes.com/search/",
          jsonp: "callback",
          dataType: "jsonp",
          data: {
              term: 'denver', // input field value
              limit: 100,
              size: 0,
              key: "b34e0b6ea2",
              secret: "ce36bb996d28c2c"
          }, success:
          function(data){

          (console.log(data))
        }})};
