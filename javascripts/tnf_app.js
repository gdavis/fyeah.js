
var TNFiPadApp = Class.create({
    // app state vars
    app_width : 0,
    app_height : 0,
	timer_fps : 1000/30,
	timer_fps_inactive : 2000,
	is_running_on_device : false,
    is_running_in_app : false,
    is_connected_to_internet : false,
	is_app_fully_ready : false,
	is_hardware_active : true,

	// app-wide objects
	math_util : false,
	debug : false,
	platform_helper : false,
	canvas_pool : false,
	product_data : false,
	main_navigation : false,
	table_of_contents_nav : false,
	nav_bar : false,
	area_model : false,
	loading_indicator : false,

	// elements
	app_container : false,
	background_div : false,

    // class functions
	initialize : function() {
	    // init globals :-X
	    window.tnf_app;
        window.app_events;
        window.debug;
        window.platform_helper;

        // create debug
        this.debug = window.debug = new Debug();
    	this.debug.init();
        //this.debug.dispose();

        // load the data
        Product.load(Products);

		// set up container refs
		this.app_outer_container = $("app_outer_container");
		this.app_container = $("app_container");
		this.background_div = $("background");
        
		var navOuterContainer = $("page_container_outer");
		var navInnerContainer = $("page_container_inner");
		var pages = navInnerContainer.select('div.page');
		var footerContainer = $("table_of_contents_nav");

	    // init app state & util objects
	    this.platform_helper = window.platform_helper = new PlatformHelper();
        this.setBrowserProperties();
	    this.math_util = new MathUtil();
        this.objCInterface = new ObjCInterface( this.is_running_in_app );
        this.canvas_pool = window.canvas_pool = new CanvasPool(450);
        this.loading_indicator = new LoadingIndicator( $("disabler") );

        // main app objects
        this.main_navigation = new MainNavigation( navOuterContainer, navInnerContainer, pages );
        this.area_model = new AreaModel( pages );
        this.table_of_contents_nav = new TableOfContentsNav( footerContainer, pages );
        this.nav_bar = new NavBar( $("nav_bar"), this.table_of_contents_nav );
        
        // init modal windows
        window.modal_shopping_cart = new ModalShoppingCart($('modal_shopping_cart'));
        window.modal_product_detail = new ModalProductDetail($('modal_product_detail'));
        window.modal_image_detail = new ModalImageDetail($('modal_image_detail'));
        window.modal_email_form = new ModalEmailInput($('modal_email_form'));

    	// add listeners for app events
    	var self = this;
		document.observe( app_events.SHOW_ACTIVITY_INDICATOR, function(e) { self.showActivityIndicator(e); } );
		document.observe( app_events.SHOW_STATUS_BAR_ACTIVITY_INDICATOR, function(e) { self.showStatusBarActivityIndicator(e); } );
		
		// android setup
		this.initAndroidSpecifics();
	},
	setBrowserProperties : function() {
		// set app size
		this.app_width = 768;
		this.app_height = 1004;
        //document.body.style.width = this.app_width + 'px';
        //document.body.style.height = this.app_height + 'px';
        // this.app_container.style.width = this.app_width + 'px';
        // this.app_container.style.height = this.app_height + 'px';

		// prevents mobile safari from bouncing
		//document.ontouchmove = function(event) {
		//    event.preventDefault();
		//};

		// add listener to window if it's orientation-capable, and set flag
    	if (window.orientation !== undefined) {
			this.is_running_on_device = true;
    		window.onorientationchange = function (event) {
    			if (Math.abs(window.orientation) % 180 === 90) {
    				window.scrollTo(0,1);
    				//debug.log('is landscape');
    			} else {
    				//debug.log('is portrait');
    			}
    		};
    		// make sure to respond right away
    		window.onorientationchange(null);
    	}

    	// check dimensions of window to tell whether we're in the actual published app - orientation doesn't matter
		var actualAppWidth = window.innerWidth;
		var actualAppHeight = window.innerHeight;
    	if ( ( actualAppWidth === this.app_width && actualAppHeight === this.app_height ) || (actualAppWidth === this.app_height && actualAppHeight === this.app_width)) {
			this.is_running_in_app = true;
		} else {
		    this.hasInternetConnection(true);
		}

    	// ANDROID: add global scale to fit device ?!
    	var self = this;
    	setTimeout(function(){
            var globalScale = window.innerWidth / self.app_width;
            document.body.style.width = window.innerWidth - 10 + 'px';
            document.body.style.height = window.innerHeight - 10 + 'px';
            // self.app_container.style.webkitTransformOrigin = '0 0';
            // self.app_container.style.webkitTransform = 'scale('+globalScale+')';
            // debug.log('globalScale = '+globalScale);
            
            //window.devicePixelRatio = 0.3;
    	}, 1000);
	},
	initAndroidSpecifics : function() {
	    // listen for device ready
	    var self = this;
	    document.addEventListener("deviceready", function() {
            self.deviceReady();
		}, true);
		// listen for device lock
	    document.addEventListener("resume", function() {
            self.hardwareIsActive( true );
		}, true);
		// listen for device unlock
	    document.addEventListener("pause", function() {
            self.hardwareIsActive( false );
		}, true);		
	},
	deviceReady : function() {
	    this.is_connected_to_internet = true;
	    
	    this.is_running_in_app = true;
	    if( device ) {
	        var deviceInfo = 'Device Name: '     + device.name     + '<br />' + 
            'Device PhoneGap: ' + device.phonegap + '<br />' + 
            'Device Platform: ' + device.platform + '<br />' + 
            'Device UUID: '     + device.uuid     + '<br />' + 
            'Device Version: '  + device.version  + '<br />';
			//console.log(deviceInfo);
	        //alert(deviceInfo);
	    }
	    if( navigator.network ) this.listenForReachabilityUpdates();
	},
	listenForReachabilityUpdates : function() {
    	// make call for network accessibility, with callback closure
    	var self = this;
        navigator.network.isReachable("phonegap.com", function( reachability ){
            self.handleReachabilityUpdated( reachability );
        }, {});
	},
	handleReachabilityUpdated : function( reachability ){
        // There is no consistency on the format of reachability
        var networkState = reachability.code || reachability;

        var states = {};
        states[NetworkStatus.NOT_REACHABLE]                      = 'No network connection';
        states[NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK] = 'Carrier data connection';
        states[NetworkStatus.REACHABLE_VIA_WIFI_NETWORK]         = 'WiFi connection';

        // store state locally
        this.is_connected_to_internet = ( networkState > 0 ) ? true : false;
        app_events.fireEvent( app_events.CONNECTIVITY_CHANGED, {is_connected_to_internet: this.is_connected_to_internet});
    },
    requestGeolocation : function() {
        if( navigator.geolocation ) {
            var self = this;
            navigator.geolocation.getCurrentPosition(
                function(position){ self.handleGeolocationSuccess(position); }, 
                function(error){ self.handleGeolocationError(error); }
            );
        }
    },
    handleGeolocationSuccess : function(position) {
        /*
        alert('Latitude: '          + position.coords.latitude          + '\n' +
              'Longitude: '         + position.coords.longitude         + '\n' +
              'Altitude: '          + position.coords.altitude          + '\n' +
              'Accuracy: '          + position.coords.accuracy          + '\n' +
              'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
              'Heading: '           + position.coords.heading           + '\n' +
              'Speed: '             + position.coords.speed             + '\n' +
              'Timestamp: '         + new Date(position.timestamp)      + '\n');
        */
        app_events.fireEvent( app_events.GEOLOCATION_RETURNED, { lat:position.coords.latitude, lng:position.coords.longitude } );
    },
    // onError Callback receives a PositionError object
    handleGeolocationError : function(error) {
        //alert('Please enable geolocation services to use the Dealer Finder');
        alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
    },
    promptEmailSubmit : function() {
        var email = prompt( "Please enter your email", "" );
        if( StringUtil.emailValidate( email ) ) {
            alert("Hello " + email + "! How are you today?");
        } else {
            alert("Please enter a valid email address");
        }
    },
	
	runTimer : function() {
		// keep timer running
		setTimeout( function(t) { t.runTimer(); } , this.timer_fps, this);
	},

	// calls from obj-c
	hasInternetConnection : function( hasInternet ) {
	    this.is_connected_to_internet = hasInternet;
		app_events.fireEvent( app_events.CONNECTIVITY_CHANGED, {is_connected_to_internet: this.is_connected_to_internet});

		if( !this.is_connected_to_internet ){
		    //this.alert('Connection changed','You have no Internet connection. Some parts of this app will not be as functional.');
        } else {
    		//this.objCInterface.callbackToObjC( app_events.DISMISS_ALERT );
        }
	},
	hardwareIsActive : function( isActive ) {
	    this.is_hardware_active = isActive;
	    var newFPS = ( this.is_hardware_active ) ? this.timer_fps : this.timer_fps_inactive;
		app_events.fireEvent( app_events.HARDWARE_ACTIVE_CHANGED, { is_hardware_active:this.is_hardware_active, fps:newFPS } );
	},
	loadCartFromDeviceStorage : function( cartString ) {
        Persist.init({name: 'tnfgiftguide2010', expires: 10}, null, cartString);
        ShoppingCart.init();
	},
	newGeolocation : function( lat, lng ) {
		app_events.fireEvent( app_events.GEOLOCATION_RETURNED, { lat:lat, lng:lng } );
	},
	geolocationDenied : function() {
		app_events.fireEvent( app_events.GEOLOCATION_DENIED, null );
	},

	// calls from .js
	setAppReady : function() {
        if (!this.is_app_fully_ready) {
            var updatedAt = Persist.getData('updated_at');
            if (new Date().getTime() > (updatedAt + (1000 * 60 * 60 * 48))) {
                this.alert('Shopping Cart', 'Your cart has expired and some products may no longer be available.  Please double-check your cart to ensure availability.');
            }
        }

        this.is_app_fully_ready = true;
	},
	alert : function( title, message ) {
	    if( this.is_running_in_app ) {
    		if( this.is_hardware_active ){
    		    this.objCInterface.callbackToObjC( app_events.ALERT, title, message );
    		}
	    } else {
	        alert( title + '\n' + message );
	    }
	},
	openNewBrowserWindow : function( url ) {
	    if( navigator.notification ) {
    	    navigator.notification.confirm(
                'Would you like to proceed?',                               // message
                function( index ){ 
                    if( parseInt( index ) == 1 ) {
                        document.location = url;
                        //window.open( url, 'new_browser' ); 
                    }
                },                                                          // callback to invoke with index of button pressed
                'You are about to leave the Gift Guide',                    // title
                'OK,Cancel'                                                 // buttonLabels
            );
        } else {
            var confirm = window.confirm( "You are about to leave the Gift Guide. Would you like to proceed?" )
            if( confirm ) {
                window.open( url, 'new_browser' );
            } else {
                // nothing
            }
        }
	},
	openUrlInCart : function( url ) {
	    if( this.is_running_in_app ) {
    	    this.objCInterface.callbackToObjC( app_events.OPEN_IN_CART, url );
	    } else {
	        window.open( url, 'new_browser' );
	    }
	},
	showActivityIndicator : function( e ) {
	    var isShowing = e.memo.is_showing;
	    var type = e.memo.type || app_events.LOADER_DEFAULT;
	    if( this.is_app_fully_ready ) {
	        this.objCInterface.callbackToObjC( app_events.SHOW_NATIVE_ACTIVITY_INDICATOR, isShowing, type );
        }
	    
	    if( isShowing ) {
	        this.loading_indicator.show();
        } else {
	        this.loading_indicator.hide();
        }
	},
	showStatusBarActivityIndicator : function( e ) {
	    var isShowing = e.memo.is_showing;
	    if( this.is_app_fully_ready ) {
	        var self = this;
	        setTimeout( function() {
	            self.objCInterface.callbackToObjC( app_events.SHOW_NATIVE_STATUS_BAR_ACTIVITY_INDICATOR, isShowing );
            }, 100 );
        }
	}
});

Event.observe(window,'load',function(){
    window.app_events = new AppEvents();
	window.tnf_app = new TNFiPadApp();
    window.app_events.fireEvent( app_events.APP_CREATED, null );
    if (!tnf_app.is_running_in_app) tnf_app.loadCartFromDeviceStorage();
});/*
document.observe("dom:loaded", function () {
    window.app_events = new AppEvents();
	window.tnf_app = new TNFiPadApp();
});*/

