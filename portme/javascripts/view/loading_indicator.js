var LoadingIndicator = Class.create( {
	container : false,
	loader_holder : false,
	loader_graphic : false,
	loader_angle : 0,
	loader_active : true,

	initialize : function( element ) {
    // store containers and insert html for loading indicator parts
		this.container = element;
		this.container.innerHTML = '<div id="loading_indicator"><div id="indicator_graphic"><div class="bar1"></div><div class="bar2"></div><div class="bar3"></div><div class="bar4"></div><div class="bar5"></div><div class="bar6"></div><div class="bar7"></div><div class="bar8"></div></div>';
		this.loader_holder = document.getElementById('loading_indicator');
		this.loader_graphic = document.getElementById('indicator_graphic');
    
    // apply positioning css to center the loader in its container
    this.loader_holder.style.left = ( this.container.offsetWidth - 100 ) / 2 + 'px';
    this.loader_holder.style.top = ( this.container.offsetHeight - 100 ) / 2 + 'px';
    
		// set properties for disabling
		this.container.onmousedown = function(e){return false;};
    this.container.onselectstart = function(e){return false;}

		// start loader spinning, but only update css if showing
		var self = this;
		setInterval(function(){
      if( self.loader_active ) {
        self.incrementLoader();
      }
    }, 100);
	},
	
	incrementLoader : function() {
    this.loader_graphic.style.MozTransform = 'scale(0.5) rotate('+ this.loader_angle +'deg)';
    this.loader_graphic.style.WebkitTransform = 'scale(0.5) rotate('+ this.loader_angle +'deg)';
    if ( this.loader_angle == 360 ) { this.loader_angle = 0; }
    this.loader_angle += 45;
	},
	
	show : function() {
    this.play();
    this.container.show();
	},
	
	hide : function() {
    this.pause();
    this.container.hide();
	},
	
	play : function() {
    this.loader_active = true;
	},
	
	pause : function() {
    this.loader_active = false;
	}
});