/*global fyeah */
(function() {

  if (typeof require !== 'undefined') {
    require.paths.push('./dist');
    fyeah = require('fyeah');
  }

  describe('fyeah.core', function() {

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('fyeah is associated with the global space', function() {
      it('should find fyeah attached to window', function() {
        if (typeof require !== 'undefined')
          expect(fyeah).toBeDefined();
        else
          expect(window.fyeah).toBeDefined();
      });

      it('should find fyeah as a global object', function() {
        expect(fyeah).toBeDefined();
      });
    });

    describe('#VERSION', function() {
      it('should have a version associated with it that converts to a number', function() {
        expect(typeof Number(fyeah.VERSION)).toEqual('number');
      });
    });

  });

}());

