'use strict';


function Caption (captionText, captionLength){

    this.setCaptionLength = function(captionLength){

        function _getDenominator(nLen){
            return nLen.split('/')[1];
        }
        function _getNumerator(nLen){
            return nLen.split('/')[0];
        }

        var newCaptionLength = captionLength;

        // handle whole numbers eg. 1, 2, 10
        if (!isNaN(captionLength)) { newCaptionLength = captionLength + '/1'; }
        else if (typeof captionLength === 'undefined') { newCaptionLength = '1/1'; }

        if ((newCaptionLength.indexOf('/') === -1) ||
            (isNaN(_getDenominator(newCaptionLength))) ||
            (isNaN(_getNumerator(newCaptionLength))))
        {
            // TODO factor this into customErrors
            throw new Error('Caption(): the supplied length is invalid: ' + captionLength);
        }
        return newCaptionLength;
    };

    this.text = captionText;
    this.length = this.setCaptionLength(captionLength);
}

module.exports = Caption;





