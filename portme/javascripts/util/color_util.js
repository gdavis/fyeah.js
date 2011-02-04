/**
 * Converts rgb color values to hex.
 *
 * @param	r		red
 * @param	g		green
 * @param	b		blue
 * @return	hex color number
 * @use		{@code var vHex:Number = ColorUtil.rgbToHex( 255, 70, 55 );}
 */
public static function rgbToHex( r:Number, g:Number, b:Number ):Number
{
      return ( r << 16 | g << 8 | b );
}

/**
 * Converts a hex color number to an object with r, g, b properties.
 *
 * @param	hex		the hex color number.
 * @return 	an object with r, g, and b color numbers.
 * @use		{@code var vRgb:Number = ColorUtil.hexToRGB( 0xffffff );}
 */
public static function hexToRGB( hex:Number ):Object
{
	// bitwise shift the hex numbers.
      var red:Number = hex >> 16;
      var grnBlu:Number = hex - ( red << 16 );
      var grn:Number = grnBlu >> 8;
      var blu:Number = grnBlu - ( grn << 8 );
      
      // return the new object
      return( { r:red, g:grn, b:blu } );
}