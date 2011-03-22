
var fixture_html = 'fixtures/core_fixture.html';

describe('fyeah.core', function() {

  beforeEach(function() {
    loadFixtures(fixture_html);
  });

  afterEach(function() {
  });

  // This is just a quick test that we have some inserted blocks of html...
  describe('DOM insertion', function() {
    it('should find the id in the dom', function() {
      var div = document.getElementById('div_id');
      expect(div).toHaveId('div_id');
    });
  });

  describe('fyeah is associated with the global space', function() {
    it('should find fyeah attached to window', function() {
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


