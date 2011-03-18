/**
 * Utils for front-end form validation.
 * @author Justin Gitlin, Ryan Boyajian
 * @version 0.1
 */
public final class ValidateUtil 
{
	/**
	 * Checks to see if a string is a valid email. ( Original RegExp by Senocular [http://www.senocular.com/] )
	 * modified to include the "+" in the local-part by RB.
	 */
	public static function isValidEmail( email:String ):Boolean {
	    var emailExpression:RegExp = /^[a-z][+\w.-]+@\w[\w.-]+\.[\w.-]*[a-z][a-z]$/i;
	    return emailExpression.test(email);
	}
	
	/**
	 * Checks to see if a string is a valid email. ( Original RegExp by Senocular [http://www.senocular.com/] )
	 * modified to include the "+" in the local-part by RB.
	 */
	public static function isValidEmailJG( email:String ):Boolean {
	  var regex = new RegExp(/^([a-zA-Z0-9_.-])+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
    return regex.test(email);
	}
	
	/**
	 * Checks to see if a string is a proper formatted US zip code.
	 * 12345 and 12345-1234 will return true.
	 */
	public static function isValidUSZip( zip:String ):Boolean
	{
	    var zipExpression:RegExp = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
	    return zipExpression.test( zip );
	}
	
	/**
	 * Checks to see if a string is a proper formatted Canadian postal code.
	 * A1B2C3 or A1B 2C3 will return true.
	 */
	public static function isValidCanPostal( postal:String ):Boolean
	{
	    var postalExpression:RegExp = /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]\s?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/;
	    return postalExpression.test( postal );
	}
	
	/**
	 * Checks to see if the string is a valid phone number.
	 * 7777777, 777 7777, or 777-7777 will return true.
	 */
	public static function isValidPhoneNumber( number:String ):Boolean
	{
		var numberExpression:RegExp = /^\d{3}(-|\s)?\d{4}$/;
		return numberExpression.test( number );
	}
	
	/**
	 * Makes sure the string is a valid area code.
	 * 123 will return true.
	 */
	public static function isValidAreaCode( areaCode:String ):Boolean
	{
		var areaExpression:RegExp = /^\d{3}$/;
		return areaExpression.test( areaCode );
	}
	
	/**
	 * Checks to see if a form element is filled out
	 */
	public static function isNotEmpty( txt:String ):Boolean {
	    if( txt != '' && txt != null )
	    {
	    	return true;
	    }
	    else
	    {
	    	return false;
	    }
	}
}