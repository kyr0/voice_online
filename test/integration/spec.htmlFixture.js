'use strict';

describe('', function() {

    beforeEach(function() {
        document.body.innerHTML = '<div id="content"></div>';
    });

    it('should be able to access innerHTML', function () {
        expect(document.getElementById('content')).to.exist;
    });

    it('should be able to use sinon methods', function () {
        function once(fn) {
            var returnValue, called = false;
            return function () {
                if (!called) {
                    called = true;
                    returnValue = fn.apply(this, arguments);
                }
                return returnValue;
            };
        }

        var callback = sinon.spy();
        var proxy = once(callback);

        proxy();

        expect(callback.called).to.be.true;
    });

});
