
// http://benchmarkjs.com/docs

var pre = document.getElementById('log');

function tracer(msg) {
  console.log(msg);
  pre.innerHTML += msg + '\n';
}

var suite = new Benchmark.Suite('Array');

suite.add('Array with brackets', function() {
  var a = [];
});

suite.add('Array with new', function() {
  var a = new Array();
});

suite.on('start', function() {
  tracer(Benchmark.platform.description);
  tracer('Starting ' + this.name + ' Benchmarks');
});

suite.on('cycle', function(bench) {
  tracer(String(bench));
});

suite.on('complete', function() {
  tracer('Fastest is ' + this.filter('fastest').pluck('name'));
  tracer('Slowest is ' + this.filter('slowest').pluck('name'));
  tracer(this.name + ' Benchmarks Complete');
});

suite.run(true);

/*
var suite = new Benchmark.Suite('array', {
  'onStart': Benchmark.log('onStart'),

  'onCycle': Benchmark.log('onCycle'),

  'onAbort': Benchmark.log('onAbort'),

  'onError': Benchmark.log('onError'),

  'onReset': Benchmark.log('onReset'),

  'onComplete': Benchmark.log('onComplete')

});

var bench = new Benchmark('foo', fn, {

  // displayed by Benchmark#toString if `name` is not available
  'id': 'xyz',

  // called when the benchmark starts running
  'onStart': onStart,

  // called after each run cycle
  'onCycle': onCycle,

  // called when aborted
  'onAbort': onAbort,

  // called when a test errors
  'onError': onError,

  // called when reset
  'onReset': onReset,

  // called when the benchmark completes running
  'onComplete': onComplete,

  // compiled/called before the test loop
  'setup': setup,

  // compiled/called after the test loop
  'teardown': teardown
});
*/
