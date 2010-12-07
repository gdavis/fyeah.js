String.prototype.toClassName = function() {
    var words = [];
    var arr = this.replace(/[_|\-]/gi, ' ').replace(/\s+/gi, ' ').split(' ');
    for (var i = 0; i < arr.length; i++) words.push(arr[i][0].toUpperCase() + arr[i].substr(1));
    return words.join('');
}

public static function convertTime( milliSeconds:Number ):String
   {
       var secs:Number = Math.floor(milliSeconds/1000);
       var mins:Number = Math.floor(secs/60);
       secs %= 60;
       
       var secsStr:String = String( secs );
       var minsStr:String = String( mins );
       
       if ( secs < 10 ) secsStr = "0"+secs; 
       if ( mins < 10)  minsStr = "0"+mins;
       
       // don't return if NaN
       if( minsStr == 'NaN' || secsStr == 'NaN' )
       {
           return( '' );
       }
       else
       {
           return( minsStr + ":" + secsStr );
       }
   }