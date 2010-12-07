function ButtonTouchCallback( element, callback ) {
    this.element = element;
    this.callback = callback;
    this.touch_tracker = false;
    this.started_touching = false;
    this.highlights_on_touch = true;
    this.init();
    return this;
}

ButtonTouchCallback.prototype.init = function()
{
    // init touch tracking for showing/hiding menu
	this.touch_tracker = new MouseAndTouchTracker();
	this.touch_tracker.init( this.element, this );
};

ButtonTouchCallback.prototype.touchUpdated = function ( touchState, touchEvent )
{
    var target = touchEvent.target;
    if (target.nodeType == 3) target = target.parentNode;

    // handle touch feedback with opacity
    if( touchState == this.touch_tracker.state_start )
    {
        if( this.highlights_on_touch ) this.element.style.opacity = 0.85;
        this.started_touching = true;
    }
    if( touchState == this.touch_tracker.state_move )
    {
        if( Math.abs( this.touch_tracker.touchmove.x ) + Math.abs( this.touch_tracker.touchmove.y ) >= 2 )
            if( this.highlights_on_touch ) 
                this.element.style.opacity = 1;
    }
    if( touchState == this.touch_tracker.state_end )
    {
        if( this.highlights_on_touch ) this.element.style.opacity = 1;
        // call callback method if touch didn't move
        if( Math.abs( this.touch_tracker.touchmove.x ) + Math.abs( this.touch_tracker.touchmove.y ) < 2 && this.started_touching )
            this.callback( this.element, target );
            
        this.started_touching = false;
    }
};

ButtonTouchCallback.prototype.deactivateHighlight = function()
{
    this.highlights_on_touch = false;
};

ButtonTouchCallback.prototype.dispose = function()
{
	if( this.touch_tracker ) this.touch_tracker.dispose();
	delete this.touch_tracker;
	delete this.callback;
	delete this.element;
};

