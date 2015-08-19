describe('Core specs', function() {

  var counter = 0

  after(function() {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  })
  afterEach(function() {
    counter = 0
    route.stop()
  })

  it('it detecs the hash params', function() {

    route(function(first, second) {
      counter++
      expect(first).to.be('mummypowder')
      expect(['logo-and-key', 'http%3A%2F%2Fxxx.yyy']).to.contain(second)
    })

    route('mummypowder/logo-and-key')
    route('mummypowder/http%3A%2F%2Fxxx.yyy')

    route.exec(function(first, second) {
      counter++
      expect(first).to.be('mummypowder')
      expect(second).to.be('http%3A%2F%2Fxxx.yyy')
    })

    expect(counter).to.be(3)

  })

  it('custom parser', function() {

    route.parser(function(path) {
      var raw = path.slice(2).split('?'),
          uri = raw[0].split('/'),
          qs = raw[1],
          params = {}

      if (qs) {
        qs.split('&').forEach(function(v) {
          var c = v.split('=')
          params[c[0]] = c[1]
        })
      }

      uri.push(params)
      return uri
    })

    route(function(first, second, params) {
      counter++
      expect(first).to.be('user')
      expect(second).to.be('activation')
      expect(JSON.stringify(params)).to.be(JSON.stringify({ token: 'xyz' }))
    })

    route('!/user/activation?token=xyz')

    expect(counter).to.be(1)

  })
})
