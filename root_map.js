$( function(){
	var rendererOptions = {
	  draggable: false
	};

	var directionsDisplay = new google.maps.DirectionsRenderer( rendererOptions );;
	var directionsService = new google.maps.DirectionsService();
	var map;
	var markers = [];

	var wells;

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

		$.getJSON(
		  'data/well-uniq.geojson',
		  function(data) {
		    for( var i in data.features ){
		    	var marker = new google.maps.Marker({
		    		position: new google.maps.LatLng(
		    				data.features[ i*30 ].properties.lat,
		    				data.features[ i*30 ].properties.lng
		    			),
		    		title: "井戸"
		    	});
		    	fluster.addMarker( marker );
		    	markers.push( marker );
		    	if( i > 1000 ) break;
		    };
		  }
		);

		$.getJSON(
		  'data/drink-water_uniq.geojson',
		  function(data) {
		    for( var i in data.features ){
		    	var marker = new google.maps.Marker({
		    		position: new google.maps.LatLng(
		    				data.features[ i*30 ].properties.lat,
		    				data.features[ i*30 ].properties.lng
		    			),
		    		title: "蛇口"
		    	});
		    	fluster.addMarker( marker );
		    	markers.push( marker );
		    	if( i > 2000 ) break;
		    };
		  }
		);

		$.getJSON(
		  'data/dam_japan.geojson',
		  function(data) {
		    for( var i in data.features ){
		    	var marker = new google.maps.Marker({
		    		position: new google.maps.LatLng(
		    				data.features[ i*30 ].properties.lat,
		    				data.features[ i*30 ].properties.lng
		    			),
		    		title: "ダム"
		    	});
		    	fluster.addMarker( marker );
		    	markers.push( marker );
		    	if( i > 100 ) break;
		    };
		  }
		);
		fluster.initialize();

		google.maps.event.addListener( map, 'idle', function(){
			fluster.showClustersInBounds();
		});
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