var ContentScroller = function( outerContainer, contentContainer, scrollTracker, scrollGrabber ) {
  var _outer_container = outerContainer;
  var _content_container = contentContainer;
  var _scroll_tracker = scrollTracker;
  var _scroll_grabber = scrollGrabber;
  
  var _fps = Math.round( 1000 / 30 );
  
  var _width = 0;
  var _height = 0;
  var _tracker_width = parseInt( DOMUtil.getStyle( _scroll_tracker, 'width' ) );
  var _grabber_height = 50;//parseInt( DOMUtil.getStyle( _scroll_grabber, 'height' ) );
  
  var _grabber_cur_y = 0;
  var _grabber_target_y = 0;
  
  var _is_active = false;
  var _is_scroll_needed = false;

  // add custom mouse/touch events
  var _cursor = new Cursor();
  var _touch_tracker = new MouseAndTouchTracker( _scroll_tracker, this, false );
  var _scroll_wheel = new ScrollWheelCallback( _outer_container, function( delta ){
    _grabber_target_y -= delta;
  });
  
  this.touchUpdated = function( state, event ) {
    switch( state ){
      case MouseAndTouchTracker.state_start :
        _cursor.cursorSetGrabbyHand();
      case MouseAndTouchTracker.state_move :
        _grabber_target_y = _touch_tracker.touchcurrent.y - _grabber_height / 2;
        break;
      case MouseAndTouchTracker.state_end :
        if( _touch_tracker.touch_is_inside ) _cursor.cursorSetHand();
    		else _cursor.cursorSetDefault();
        break;
      case MouseAndTouchTracker.state_enter :
  		  if( !_touch_tracker.is_touching ) _cursor.cursorSetHand();
        break;
      case MouseAndTouchTracker.state_leave :
    		if(_touch_tracker.is_touching) _cursor.cursorSetGrabbyHand();
    		else _cursor.cursorSetDefault();
        break;
      default : 
        break;
    }
  };
  
  var runTimer = function() {
    // limit grabber positino inside track
    if( _grabber_target_y < 0 ) _grabber_target_y = 0;
    if( _grabber_target_y > _height - _grabber_height + 1 ) _grabber_target_y = _height - _grabber_height + 1;
    // ease grabber toward touch 
    _grabber_cur_y = MathUtil.easeTo( _grabber_cur_y, _grabber_target_y, 3 );
    platform_helper.update2DPosition( _scroll_grabber, 0, Math.round( _grabber_cur_y ) );
    
    // move content
    if( _is_scroll_needed ) {
      var scrollPercent = MathUtil.getPercentWithinRange( 0, _height - _grabber_height , _grabber_cur_y );
      platform_helper.update2DPosition( _content_container, 0, Math.round( scrollPercent * ( _height - _content_container.offsetHeight ) ) );
    }

    // keep it running
    setTimeout(function(){
      if( _is_active ) runTimer();
    }, _fps );
  };
  
  var updateSize = function( width, height ) {
    _width = width;
    _height = height;
    
    // resize grabber and track
    _grabber_height = _height / 4;
    _scroll_grabber.style.height = _grabber_height + 'px';
    _scroll_tracker.style.top = '0';
    _scroll_tracker.style.height = _height + 'px';
    
    // check to see if we need a scroller - hide track and kill timer if not
    if( _content_container.offsetHeight < _height ) {
      _is_scroll_needed = false;
      platform_helper.update2DPosition( _content_container, 0, 0 );
      _scroll_tracker.style.display = 'none';
      _content_container.style.width = _width + 'px';   // fill width - no scroll track
      _is_active = false;
    } else {
      _is_scroll_needed = true;
      _scroll_tracker.style.display = 'block';
      _content_container.style.width = ( _width - _tracker_width ) + 'px';  // make room for scroll track
      if( !_is_active ) runTimer();
      _is_active = true;
    }
  };  
  
  var dispose = function() {
    _is_active = false;
    _touch_tracker.dispose();
    _touch_tracker = null;
    _cursor.dispose();
    _cursor = null;
    _scroll_wheel.dispose();
    _scroll_wheel = null;
    this.touchUpdated = null;
    _outer_container = null;
    _content_container = null;
    _scroll_tracker = null;
    _scroll_grabber = null;
    
  };
  
  return {
    updateSize : updateSize,
    dispose : dispose
  }
};