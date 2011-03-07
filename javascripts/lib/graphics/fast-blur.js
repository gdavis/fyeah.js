/*

Superfast Blur - a fast Box Blur For Canvas v0.2

Version: 	0.2
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/BoxBlurForCanvas
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr:
https://flattr.com/thing/140066/Superfast-Blur-a-pretty-fast-Box-Blur-Effect-for-CanvasJavascript

Copyright (c) 2011 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

function boxBlurImage( imageID, canvasID, radius, blurAlphaChannel, iterations )
{
			
 	var img = document.getElementById( imageID );
	var w = img.naturalWidth;
    var h = img.naturalHeight;
       
	var canvas = document.getElementById( canvasID );
      
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w;
    canvas.height = h;
    
    var context = canvas.getContext("2d");
    context.clearRect( 0, 0, w, h );
    context.drawImage( img, 0, 0 );

	if ( isNaN(radius) || radius < 1 ) return;
	
	if ( blurAlphaChannel )
	{
		boxBlurCanvasRGBA( canvasID, 0, 0, w, h, radius, iterations );
	} else {
		boxBlurCanvasRGB( canvasID, 0, 0, w, h, radius, iterations );
	}
	
}


function boxBlurCanvasRGBA( id, top_x, top_y, width, height, radius, iterations )
{
	if ( isNaN(radius) || radius < 1 ) return;
	
	radius |= 0;
	
	if ( isNaN(iterations) ) iterations = 1;
	iterations |= 0;
	if ( iterations > 3 ) iterations = 3;
	if ( iterations < 1 ) iterations = 1;
	
	var canvas  = document.getElementById( id );
	var context = canvas.getContext("2d");
	var imageData;
	
	try {
	  try {
		imageData = context.getImageData( top_x, top_y, width, height );
	  } catch(e) {
	  
		// NOTE: this part is supposedly only needed if you want to work with local files
		// so it might be okay to remove the whole try/catch block and just use
		// imageData = context.getImageData( top_x, top_y, width, height );
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			imageData = context.getImageData( top_x, top_y, width, height );
		} catch(e) {
			alert("Cannot access local image");
			throw new Error("unable to access local image data: " + e);
			return;
		}
	  }
	} catch(e) {
	  alert("Cannot access image");
	  throw new Error("unable to access image data: " + e);
	  return;
	}
			
	var pixels = imageData.data;
		
	var rsum,gsum,bsum,asum,x,y,i,p,p1,p2,yp,yi,yw,idx;		
	var wm = width - 1;
  	var hm = height - 1;
    var wh = width * height;
	var rad1 = radius + 1;
    var div = radius + rad1;
	var div2 = 1 / (div * div);
	
	var r = [];
    var g = [];
    var b = [];
	var a = [];
	
	var vmin = [];
	var vmax = [];
  
	while ( iterations-- > 0 )
	{
		yw = yi = 0;
	 
		for ( y=0; y < height; y++ )
		{
			rsum = pixels[yw]   * rad1;
			gsum = pixels[yw+1] * rad1;
			bsum = pixels[yw+2] * rad1;
			asum = pixels[yw+3] * rad1;
			
			
			for( i = 1; i <= radius; i++ )
			{
				p = yw + (((i > wm ? wm : i )) << 2 );
				rsum += pixels[p++];
				gsum += pixels[p++];
				bsum += pixels[p++];
				asum += pixels[p]
			}
			
			for ( x = 0; x < width; x++ )
			{
				r[yi] = rsum;
				g[yi] = gsum;
				b[yi] = bsum;
				a[yi] = asum;

				if(y==0)
				{
					vmin[x] = Math.min( x + rad1, wm ) << 2;
					vmax[x] = Math.max( x - radius, 0 ) << 2;
				} 
			  
				p1 = yw + vmin[x];
				p2 = yw + vmax[x];
				  
				rsum += pixels[p1++] - pixels[p2++];
				gsum += pixels[p1++] - pixels[p2++];
				bsum += pixels[p1++] - pixels[p2++];
				asum += pixels[p1]   - pixels[p2];
					 
				yi++;
			}
			yw += ( width << 2 );
		}
	  
		for ( x = 0; x < width; x++ )
		{
			yp = x;
			rsum = r[yp] * rad1;
			gsum = g[yp] * rad1;
			bsum = b[yp] * rad1;
			asum = a[yp] * rad1;
			
			for( i = 1; i <= radius; i++ )
			{
			  yp += ( i > hm ? 0 : width );
			  rsum += r[yp];
			  gsum += g[yp];
			  bsum += b[yp];
			  asum += a[yp];
			}
			
			yi = x << 2;
			for ( y = 0; y < height; y++)
			{
			  pixels[yi]   = (rsum * div2 + 0.5) | 0;
			  pixels[yi+1] = (gsum * div2 + 0.5) | 0;
			  pixels[yi+2] = (bsum * div2 + 0.5) | 0;
			  pixels[yi+3] = (asum * div2 + 0.5) | 0;
				
			  if( x == 0 )
			  {
				vmin[y] = Math.min( y + rad1, hm ) * width;
				vmax[y] = Math.max( y - radius,0 ) * width;
			  } 
			  
			  p1 = x + vmin[y];
			  p2 = x + vmax[y];

			  rsum += r[p1] - r[p2];
			  gsum += g[p1] - g[p2];
			  bsum += b[p1] - b[p2];
			  asum += a[p1] - a[p2];

			  yi += width << 2;
			}
		}
	}
	
	context.putImageData( imageData, top_x, top_y );
	
}

function boxBlurCanvasRGB( id, top_x, top_y, width, height, radius, iterations )
{
	if ( isNaN(radius) || radius < 1 ) return;
	
	radius |= 0;
	
	if ( isNaN(iterations) ) iterations = 1;
	iterations |= 0;
	if ( iterations > 3 ) iterations = 3;
	if ( iterations < 1 ) iterations = 1;
	
	var canvas  = document.getElementById( id );
	var context = canvas.getContext("2d");
	var imageData;
	
	try {
	  try {
		imageData = context.getImageData( top_x, top_y, width, height );
	  } catch(e) {
	  
		// NOTE: this part is supposedly only needed if you want to work with local files
		// so it might be okay to remove the whole try/catch block and just use
		// imageData = context.getImageData( top_x, top_y, width, height );
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			imageData = context.getImageData( top_x, top_y, width, height );
		} catch(e) {
			alert("Cannot access local image");
			throw new Error("unable to access local image data: " + e);
			return;
		}
	  }
	} catch(e) {
	  alert("Cannot access image");
	  throw new Error("unable to access image data: " + e);
	  return;
	}
			
	var pixels = imageData.data;
		
	var rsum,gsum,bsum,asum,x,y,i,p,p1,p2,yp,yi,yw,idx;		
	var wm = width - 1;
  	var hm = height - 1;
    var wh = width * height;
	var rad1 = radius + 1;
    var div = radius + rad1;
	var div2 = 1 / (div * div);
	
	var r = [];
    var g = [];
    var b = [];
	
	var vmin = [];
	var vmax = [];
  
	while ( iterations-- > 0 )
	{
		yw = yi = 0;
	 
		for ( y=0; y < height; y++ )
		{
			rsum = pixels[yw]   * rad1;
			gsum = pixels[yw+1] * rad1;
			bsum = pixels[yw+2] * rad1;
			
			for( i = 1; i <= radius; i++ )
			{
				p = yw + (((i > wm ? wm : i )) << 2 );
				rsum += pixels[p++];
				gsum += pixels[p++];
				bsum += pixels[p++];
			}
			
			for ( x = 0; x < width; x++ )
			{
				r[yi] = rsum;
				g[yi] = gsum;
				b[yi] = bsum;
				
				if(y==0)
				{
					vmin[x] = Math.min( x + rad1, wm ) << 2;
					vmax[x] = Math.max( x - radius, 0 ) << 2;
				} 
			  
				p1 = yw + vmin[x];
				p2 = yw + vmax[x];
				  
				rsum += pixels[p1++] - pixels[p2++];
				gsum += pixels[p1++] - pixels[p2++];
				bsum += pixels[p1++] - pixels[p2++];
				 
				yi++;
			}
			yw += ( width << 2 );
		}
	  
		for ( x = 0; x < width; x++ )
		{
			yp = x;
			rsum = r[yp] * rad1;
			gsum = g[yp] * rad1;
			bsum = b[yp] * rad1;
				
			for( i = 1; i <= radius; i++ )
			{
			  yp += ( i > hm ? 0 : width );
			  rsum += r[yp];
			  gsum += g[yp];
			  bsum += b[yp];
			}
			
			yi = x << 2;
			for ( y = 0; y < height; y++)
			{
			  pixels[yi]   = (rsum * div2 + 0.5) | 0;
			  pixels[yi+1] = (gsum * div2 + 0.5) | 0;
			  pixels[yi+2] = (bsum * div2 + 0.5) | 0;
			 
			  if( x == 0 )
			  {
				vmin[y] = Math.min( y + rad1, hm ) * width;
				vmax[y] = Math.max( y - radius,0 ) * width;
			  } 
			  
			  p1 = x + vmin[y];
			  p2 = x + vmax[y];

			  rsum += r[p1] - r[p2];
			  gsum += g[p1] - g[p2];
			  bsum += b[p1] - b[p2];
			  
			  yi += width << 2;
			}
		}
	}
	context.putImageData( imageData, top_x, top_y );
	
}