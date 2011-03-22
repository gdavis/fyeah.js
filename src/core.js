
(function(global) {
  var fyeah = function() {
    return this;
  }
  fyeah.VERSION = '@VERSION';

  if (global.fyeah) {
    throw new Error('fyeah has already been defined');
  } else {
    global.fyeah = fyeah;
    if (typeof exports !== 'undefined')
      exports.fyeah = fyeah;
  }

}(typeof window === 'undefined' ? this : window));

