function randomize_array( array ) {
  array.sort(function() {return 0.5 - Math.random()}) //Array elements now scrambled
}
