$( function(){
	var rendererOptions = {
	  draggable: true
	};

	var directionsDisplay = new google.maps.DirectionsRenderer( rendererOptions );;
	var directionsService = new google.maps.DirectionsService();
	var map;
	var markers = [];

	var Tokyo = new google.maps.LatLng( 35.41032, 139.44982 );

	google.maps.event.addDomListener( window, 'load', initialize );

	$( "#place_form" ).submit(function(){
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({
    	address: $( "#place_text" ).val()
	  }, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      var bounds = new google.maps.LatLngBounds();

	      for (var i in results) {
	        if (results[i].geometry) {

	          var latlng = results[i].geometry.location;

	          calcRoute( new google.maps.LatLng(
	          	latlng.lat(), latlng.lng() ) );
	        }
	        break;
	      }
	    }
    });

    return false;
	})

	function initialize() {

	  var mapOptions = {
	    zoom: 7,
	    center: Tokyo
	  };
	  map = new google.maps.Map( document.getElementById('map-canvas'), mapOptions );
	  var fluster = new Fluster2( map );

	  directionsDisplay.setMap( map );
	  directionsDisplay.setPanel( document.getElementById('directionsPanel') );


		if( navigator.geolocation ){
			navigator.geolocation.getCurrentPosition( function( success_result ){
				calcRoute( new google.maps.LatLng(
											success_result.coords.latitude, 
											success_result.coords.longitude ) );
			}, function( error_result ){
				calcRoute( new google.maps.LatLng( 35.41032, 139.44982 ) );
			});
		}else{
		  calcRoute( new google.maps.LatLng( 35.41032, 139.44982 ) );
		}

		google.maps.event.addListener( map, 'idle', getMarker );

		function getMarker(){
			fluster.clear();

			var pos = map.getBounds();
			var param = {
	        "lat1": pos.getNorthEast().lat(),
	        "lon1": pos.getNorthEast().lng(),
	        "lat2": pos.getSouthWest().lat(),
	        "lon2": pos.getSouthWest().lng()
			};

			var ajaxEndCount = 0;
			var placeType = "";

			var successFunction = function( data, status ){

		    for( var i in data ){
		    	var marker = new google.maps.Marker({
		    		position: new google.maps.LatLng(
		    				data[ i ].lat,
		    				data[ i ].lon
		    			)
		    	});
		    	markers.push( marker );
		    };

		    ajaxEndCount ++;

		    if( ajaxEndCount == 2 )
		    	setMarker();
			}

			$.getJSON(
				"http://www.hi-rezclimate.org/~chome/test/get.py/well",
				param, successFunction );

			$.getJSON(
				"http://www.hi-rezclimate.org/~chome/test/get.py/drinking_water",
				param, successFunction );

			function setMarker(){
				fluster = new Fluster2( map );

				for( var i in markers ){
					fluster.addMarker( markers[i] );
				}
				
		    fluster.initialize();
			}
		}
	}

	function calcRoute( from ) {
		$.getJSON(
			"http://www.hi-rezclimate.org/~chome/test/min.py/drinking_water",
			{ "lat": from.lat(), "lon": from.lng() },
			function( data, status ){

				var goal = new google.maps.LatLng(
					data.coordinates[ 1 ],
					data.coordinates[ 0 ]
				);

			  var request = {
			    origin: from,
			    destination: goal,
			    travelMode: google.maps.TravelMode.WALKING
			  };
			  directionsService.route( request, function( response, status ) {
			    if ( status == google.maps.DirectionsStatus.OK ) {
			      directionsDisplay.setDirections( response );
			    }
			  });
			}
		);
	}
} );