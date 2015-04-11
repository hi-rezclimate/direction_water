$( function(){
	var rendererOptions = {
	  draggable: false
	};

	var directionsDisplay = new google.maps.DirectionsRenderer( rendererOptions );;
	var directionsService = new google.maps.DirectionsService();
	var map;

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
	  directionsDisplay.setMap( map );
	  directionsDisplay.setPanel( document.getElementById('directionsPanel') );


		if( navigator.geolocation ){
			navigator.geolocation.getCurrentPosition( function( success_result ){
				calcRoute( new google.maps.LatLng(
											success_result.coords.latitude, 
											success_result.coords.longitude ) );
			}, function( error_result ){
				calcRoute( "秋葉原駅" )
			});
		}else{
		  calcRoute( "秋葉原駅" );
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