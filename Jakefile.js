
/*global namespace desc task*/
var path = require('path'),
    fs = require('fs');

namespace('setup', function () {

  desc('ensures the environment has the correct settings for building this project');
  task('virgin', [], function () {
    console.log('setup:virgin task is not ready!');
  });

});


namespace('test', function () {

  desc('runs the entire suite of tests');
  task('all', [], function () {
    console.log('test:all task is not ready!');
  });

});


namespace('build', function () {

  desc('build js files for development');
  task('development', [], function () {
    console.log('build:development task is not ready!');
  });

  desc('build js files for production');
  task('production', [], function () {
    console.log('build:production task is not ready!');
  });

  desc('build js files for development and production');
  task('all', ['build:development', 'build:production'], function () {
    console.log('build:all task is not ready!');
  });

});


desc('Runs setup:virgin');
task('default', ['setup:virgin'], function () {});

