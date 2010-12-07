function MouseAndTouchTracker ( touchObject, delegate )
{
    this.touchstart = false;
    this.touchcurrent = false;
  	this.touchlast = false;
  	this.touchmove = false;
  	this.touchspeed = false;
  	this.is_touching = false;
  	this.is_touch_capable = false;
  	this.has_moved = false;
  	this.stops_propagation = false;

  	this.scroll_container = false;
    this.container_position = false;
  	this.delegate = false;

  	this.startFunction = false;

    // debug.log('touchObject = '+touchObject);
    this.container_position = { x:0, y:0 };
    this.touchstart = { x : 0, y : 0 };
    this.touchcurrent = { x : 0, y : 0 };
  	this.touchlast = { x : 0, y : 0 };
  	this.touchmove = { x : 0, y : 0 };
  	this.touchspeed = { x : 0, y : 0 };
  	this.is_touching = false;
  	this.is_touch_capable = false;
  	this.has_moved = false;

  	this.scroll_container = touchObject;
  	this.delegate = delegate;

      var self = this;
      this.startFunction = function(e){ self.onStart(e); };
      this.moveFunction = function(e){ self.onMove(e); };
      this.endFunction = function(e){ self.onEnd(e); };
      this.endDocumentFunction = function(e){ if( self.is_touching ) self.onEnd(e); };
  	if( this.scroll_container.attachEvent ) this.scroll_container.attachEvent( "onmousedown", this.startFunction ); else this.scroll_container.addEventListener( "mousedown", this.startFunction, false );
  	if( this.scroll_container.attachEvent ) this.scroll_container.attachEvent( "onmousemove", this.moveFunction );  else this.scroll_container.addEventListener( "mousemove", this.moveFunction, false );
  	if( this.scroll_container.attachEvent ) this.scroll_container.attachEvent( "onmouseup", this.endFunction );     else this.scroll_container.addEventListener( "mouseup", this.endFunction, false );
  	if( document.attachEvent ) document.attachEvent( "onmouseup", this.endDocumentFunction );     else document.addEventListener( "mouseup", this.endDocumentFunction, false );

  	// jQuery-specific helper for detecting mouse leave
  	//$( this.scroll_container ).mouseleave( function(){ self.onEnd(null); } );   

  	// add touch listening (non-IE browsers)
  	if( !this.scroll_container.attachEvent ) {
      	this.scroll_container.addEventListener( "touchstart", this.startFunction, false );
      	this.scroll_container.addEventListener( "touchmove", this.moveFunction, false );
      	this.scroll_container.addEventListener( "touchend", this.endFunction, false );
      	this.scroll_container.addEventListener( "touchcancel", this.endFunction, false );
      	document.addEventListener( "touchend", this.endDocumentFunction, false );
      }

      this.recurseDisableElements( this.scroll_container );
}

MouseAndTouchTracker.state_start = 'TOUCH_START';
MouseAndTouchTracker.state_move = 'TOUCH_MOVE';
MouseAndTouchTracker.state_end = 'TOUCH_END';

MouseAndTouchTracker.prototype.recurseDisableElements = function ( elem )
{
    if( elem ) {
        // disable clicking/dragging
        try {
            elem.onmousedown = function(e){return false;};  // TODO: remove this is touch events, so we can click inside??
            elem.onselectstart = function(){return false;}
        } catch(err) {}
        
        // loop through children and do the same
        if( elem.childNodes.length > 0 ){
            for( var i=0; i < elem.childNodes.length; i++ )
    		    this.recurseDisableElements( elem.childNodes[i] );
    	}
    }
};

MouseAndTouchTracker.prototype.onStart = function ( touchEvent )
{
    var target = (touchEvent.target.nodeType == 3) ? Element.up(touchEvent.target) : touchEvent.target;
   // if (Element.hasClassName(target, 'ignored') || Element.up(target, '.ignored')) return;

    // get position of holder for relative mouse/touch position
    this.findPos(this.scroll_container);
    
    // remove mouse events if we're touch-capable
    if ( touchEvent.touches ) { 
        this.is_touch_capable = true; 
    	this.scroll_container.removeEventListener( "mousedown", this.startFunction );
    	this.scroll_container.removeEventListener( "mousemove", this.moveFunction );
    	this.scroll_container.removeEventListener( "mouseup", this.endFunction );
    	document.removeEventListener( "mouseup", this.endDocumentFunction );
    	
    	//if( document.attachEvent ) document.detachEvent( "onmouseup" ); else document.removeEventListener( "mouseup", false );
    }
    
    // get mouse/touch coordinates
	this.is_touching = true;
	this.touchstart.x = ( this.is_touch_capable ) ? touchEvent.touches[0].clientX : touchEvent.clientX;
	this.touchstart.y = ( this.is_touch_capable ) ? touchEvent.touches[0].clientY : touchEvent.clientY;
	this.touchstart.x -= this.container_position.x;
	this.touchstart.y -= this.container_position.y;
	this.touchcurrent.x = this.touchstart.x;
	this.touchcurrent.y = this.touchstart.y;
	//this.scroll_container.setStyle({ cursor: 'move' });

//    if( this.is_touch_capable && this.stops_propagation ) touchEvent.stopPropagation();
//    touchEvent.preventDefault();
	
	if( this.delegate ) this.delegate.touchUpdated( MouseAndTouchTracker.state_start, touchEvent );
};

MouseAndTouchTracker.prototype.onMove = function ( touchEvent )
{
    if( this.is_touching ) 
    {
        // get position of holder for relative mouse/touch position
        this.findPos(this.scroll_container);

		// store last position
		this.touchlast.x = this.touchmove.x;
		this.touchlast.y = this.touchmove.y;
		
		//  get distance moved since touch start
		this.touchcurrent.x = ( this.is_touch_capable ) ? touchEvent.touches[0].clientX : touchEvent.clientX;
		this.touchcurrent.y = ( this.is_touch_capable ) ? touchEvent.touches[0].clientY : touchEvent.clientY;
		this.touchcurrent.x -= this.container_position.x;
		this.touchcurrent.y -= this.container_position.y;
		this.touchmove.x = this.touchcurrent.x - this.touchstart.x;
		this.touchmove.y = this.touchcurrent.y - this.touchstart.y;
		
		// calculate speed between touch moves
		this.touchspeed.x = this.touchmove.x - this.touchlast.x;
		this.touchspeed.y = this.touchmove.y - this.touchlast.y;
	
//	    if( this.is_touch_capable && this.stops_propagation ) touchEvent.stopPropagation();
//	    touchEvent.preventDefault();

    	if( this.delegate ) this.delegate.touchUpdated( MouseAndTouchTracker.state_move, touchEvent );
    }
};

MouseAndTouchTracker.prototype.onEnd = function ( touchEvent )
{
	// call delegate method before resetting all touch tracking props
	if( this.delegate ) this.delegate.touchUpdated( MouseAndTouchTracker.state_end, touchEvent ); 
	
	// reset tracking vars
	this.is_touching = false;
	this.touchstart.x = this.touchstart.y = false;
	this.touchlast.x = this.touchlast.y = 0;
	this.touchmove.x = this.touchmove.y = 0;
	this.touchspeed.x = this.touchspeed.y = 0;
	
    if( this.is_touch_capable && this.stops_propagation ) if( touchEvent ) touchEvent.stopPropagation();
    touchEvent.preventDefault();
};

MouseAndTouchTracker.prototype.dispose = function ()
{
    if( this.is_touch_capable )
    {
        this.scroll_container.removeEventListener( "touchstart", this.startFunction );
    	this.scroll_container.removeEventListener( "touchmove", this.moveFunction );
    	this.scroll_container.removeEventListener( "touchend", this.endFunction );
    	this.scroll_container.removeEventListener( "touchcancel", this.endFunction );
    	document.removeEventListener( "touchend", this.endDocumentFunction );
    } else {
	    if( this.scroll_container.attachEvent ) this.scroll_container.detachEvent( "onmousedown", this.startFunction ); else this.scroll_container.removeEventListener( "mousedown", this.startFunction, null );
    	if( this.scroll_container.attachEvent ) this.scroll_container.detachEvent( "onmousemove", this.moveFunction ); else this.scroll_container.removeEventListener( "mousemove", this.moveFunction, null );
    	if( this.scroll_container.attachEvent ) this.scroll_container.detachEvent( "onmouseup", this.endFunction );   else this.scroll_container.removeEventListener( "mouseup", this.endFunction, null );
    	if( document.attachEvent ) document.detachEvent( "onmouseup", this.endDocumentFunction );   else document.removeEventListener( "mouseup", this.endDocumentFunction, null );
	}
    this.delegate = false;
	this.touchstart = false;
	this.touchlast = false;
	this.touchmove = false;
};

MouseAndTouchTracker.prototype.findPos = function(obj) {
    // cobbled from
    // http://javascript.about.com/od/browserobjectmodel/a/bom12.htm
    // http://www.quirksmode.org/js/findpos.html
    // with original code to handle webkitTransform positioning added to the mix
    
    // get page scroll offset
    var scrollX = window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
    var scrollY = window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
    
    // get element location
    var curleft = curtop = 0;
    
    if (obj.offsetParent) {
        do {
            if( obj.parentNode.style.webkitTransform )
            {
                var transformXYZArray = obj.parentNode.style.webkitTransform.split('translate3d(')[1].split(')')[0].replace(/ +/g, '').replace(/px+/g, '').split(',');
                curleft += parseInt( transformXYZArray[0] );
                curtop += parseInt( transformXYZArray[1] );
            } 
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    this.container_position.x = curleft - scrollX;
    this.container_position.y = curtop - scrollY;

    //return [curleft,curtop];
};