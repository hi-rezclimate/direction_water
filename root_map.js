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
		calcRoute( $( "#place_text" ).val() );
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
				calcRoute( "秋葉原駅" );
			});
		}else{
		  calcRoute( "秋葉原駅" );
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

			var placeType = "";

			var successFunction = function( data, status ){
				fluster = new Fluster2( map );

		    for( var i in data ){
		    	var marker = new google.maps.Marker({
		    		position: new google.maps.LatLng(
		    				data[ i ].lat,
		    				data[ i ].lon
		    			),
		    		title: placeType
		    	});
		    	fluster.addMarker( marker );
		    };

		    fluster.initialize();
			}

			placeType = "井戸";
			$.getJSON(
				"http://www.hi-rezclimate.org/~chome/test/get.py/well",
				param, successFunction );

			placeType = "蛇口";
			$.getJSON(
				"http://www.hi-rezclimate.org/~chome/test/get.py/drinking_water",
				param, successFunction );
		}
	}

	function calcRoute( from ) {
	  var request = {
	    origin: from,
	    destination: '渋谷',
	    travelMode: google.maps.TravelMode.DRIVING
	  };
	  directionsService.route( request, function( response, status ) {
	    if ( status == google.maps.DirectionsStatus.OK ) {
	      directionsDisplay.setDirections( response );
	    }
	  });
	}
} );