function DOMUtil(){}

DOMUtil.getWidth = function( elem ) {
  if( elem ) return elem.offsetWidth;
  else return -1;
};

DOMUtil.getHeight = function( elem ) {
  if( elem ) return elem.offsetHeight;
  else return -1;
};

DOMUtil.show = function( elem ) {
  if( elem ) elem.style.display = 'inline';
};

DOMUtil.hide = function( elem ) {
  if( elem ) elem.style.display = 'none';
};

DOMUtil.removeElement = function( elem ) {
  if( elem ) {
    if( elem.parentNode ) {
      elem.parentNode.removeChild( elem );
    }
  }
};

DOMUtil.getStyle = function(el,styleProp) {
	if (el.currentStyle) {
		var y = el.currentStyle[styleProp];
	} else if (window.getComputedStyle) {
		var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
	}
	return y;
};

DOMUtil.createElement = function( type, params, parent ) {
  var type = type || params.tag, 
    prop, 
    el = document.createElement(type);

  for (prop in params) {
    if( typeof params[prop] !== 'function' ) {
        switch( prop ){
          case 'text':
            el.appendChild( document.createTextNode( params[prop] ) );
            break;
          case 'className':
			el.className = params[prop];
            break;
          default:
            el.setAttribute( prop, params[prop] );
        }
    }
  }
  if( parent ) parent.appendChild( el );
  return el;
};

DOMUtil.getRE = function( name ) {
  return new RegExp( '\\b' + name + '\\b', 'g' );
};

DOMUtil.hasClass = function( el, name ) {
  return this.getRE( name ).test( el.className );
};

DOMUtil.addClass = function( el, name ) {
  if( !this.hasClass( el, name ) ) {
    el.className += ' ' + name;
  }
};

DOMUtil.removeClass = function( el, name ) {
  el.className = el.className.replace( this.getRE( name ), '' );
};

DOMUtil.toggleClass = function( el, name, on ) {
  if( on === undefined ) {
    on = !this.hasClass( el, name );
  }
  if( on ) {
    this.addClass( el, name );
  } else {
    this.removeClass( el, name );
  }
};

DOMUtil.recurseDisableElements = function ( elem ) {
  if( elem ) {
    // disable clicking/dragging
    try {
      elem.onmousedown = function(e){return false;};  // TODO: remove this is touch events, so we can click inside??
      elem.onselectstart = function(){return false;}
    } catch(err) {}

    // loop through children and do the same
    if( elem.childNodes.length > 0 ) {
      for( var i=0; i < elem.childNodes.length; i++ ) {
        this.recurseDisableElements( elem.childNodes[i] );
      }
    }
  }
};


//This is a third party function written by Martin Honnen
//In comp.lang.javascript
//http://groups-beta.google.com/group/comp.lang.javascript/browse_thread/thread/2b389e61c7b951f2/99b5f1bee9922c39?lnk=gst&q=(doc+%3D+node.ownerDocu ment)+%26%26+(win+%3D+doc.defaultView)&rnum=1&hl=e n#99b5f1bee9922c39
DOMUtil.recurseDisableElements.selectNode =  function ( node ) {
  var selection, range, doc, win;
  if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined') {
    range = doc.createRange();
    range.selectNode(node);
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())) {
    range.moveToElementText(node);
    range.select();
  }
};

