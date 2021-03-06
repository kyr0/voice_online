'use strict';

var Note = require('../../src/client/js/Note.js');
var InvalidDurationError = require('../../src/client/js/customErrors.js').InvalidDurationError;


describe('Silent note Object', function() {

    beforeEach(function () {
        this.silentNote = new Note('-', '1/4');
    });

    it('should not transpose (up)', function () {
        expect(this.silentNote.transpose(2)).to.equal('-');
    });

    it('should not transpose (down)', function () {
        expect(this.silentNote.transpose(-2)).to.equal('-');
    });

    it('should not transpose (zero)', function () {
        expect(this.silentNote.transpose(0)).to.equal('-');
    });

    it('should not transpose (zero)', function () {
        expect(this.silentNote.transpose(0)).to.equal('-');
    });

    it('should set duration when passed in to constructor', function () {
        expect(this.silentNote.duration).to.equal('1/4');
    });

});

describe('Note Object', function() {

    beforeEach(function() {
        this.noteName = 'B2';
        this.note = new Note(this.noteName);
        this.silentNote = new Note('-');
    });

    it('should have passed in name, related frequency, and default duration of 1/1', function () {
        var expectNoteDuration = '1/1';
        var expectFrequency = 123.47;
        var noteObj = this.note;
        expect(noteObj.name).to.equal(this.noteName);
        expect(noteObj.duration).to.equal(expectNoteDuration);
        expect(noteObj.frequency).to.equal(expectFrequency);
    });

    it('should set duration when passed in to constructor', function () {
        var noteDuration = '1/8';
        var noteObj = new Note(this.noteName, noteDuration);
        expect(noteObj.duration).to.equal(noteDuration);
    });

    it('should convert duration of `1` to a note using a duration of `1/1`', function () {
        var noteDuration = '1';
        var expectedNoteObj = { name : this.noteName, duration : '1/1' };
        var noteObj = new Note(this.noteName, noteDuration);
        expect(noteObj.duration).to.equal(expectedNoteObj.duration);
    });

    it('should transpose the note accurately (up)', function () {
        expect(this.note.transpose(35)).to.equal('Bb5');
    });

    it('should transpose the note accurately (down)', function () {
        expect(this.note.transpose(-12)).to.equal('B1');
    });

    it('should transpose the note accurately (zero)', function () {
        expect(this.note.transpose(0)).to.equal('B2');
    });

    it('getDistanceToNote() should return the distance (negative)', function() {
        expect(this.note.getDistanceToNote('A2')).to.equal(-2);
    });

    it('getDistanceToNote() should return the distance (positive)', function() {
        expect(this.note.getDistanceToNote('D3')).to.equal(3);
    });

    it('getDistanceToNote() should return the distance (zero)', function() {
        expect(this.note.getDistanceToNote('B2')).to.equal(0);
    });

    it('getDistanceToNote() should return null for silentNote', function() {
        expect(this.note.getDistanceToNote('-')).to.be.null;
    });

    describe('', function() {

        it('should accept a note duration longer than a full measure', function () {
            var expectDuration = '2/1';
            var noteObj = new Note('A2', '2');
            expect(noteObj.duration).to.equal(expectDuration);
        });

        it('should accept any multiple of a full measure', function () {
            var expectDuration = '200/1';
            var noteObj = new Note('A2', '200');
            expect(noteObj.duration).to.equal(expectDuration);
        });

        it('should accept a note duration where numerator > 1 ', function () {
            var expectDuration = '3/32';
            var noteObj = new Note('A2', '3/32');
            expect(noteObj.duration).to.equal(expectDuration);
        });

        it ('should create a note if frequency is passed in instead of name', function () {
            expect(new Note(441).name).to.equal('A4');
        });

        it('should create the note with exact frequency input', function() {
            var freqC0 = 16.352;
            expect(new Note(freqC0).name).to.equal('C0');
        });

        it('should create accurate Note when frequency <= 50 cents off', function() {
            // NOTE: 50 cents equals .5 semitone
            var sharpA7Freq = 3623.1;
            expect(new Note(sharpA7Freq).frequency).to.equal(3520.0);
        });

        it('should create accurate Note when frequency <= 50 cents off', function() {
            // NOTE: 50 cents equals .5 semitone
            var flatA1Freq = 53.435;
            expect(new Note(flatA1Freq).frequency).to.equal(55.000);
        });

        it('should throw an error when frequency way too high', function() {
            var invalidFreq = 10000;
            var fn = function() {
                var dum = new Note(invalidFreq);
            }
            expect(fn).to.throw(/supplied frequency is invalid/);
        });
        
        it('should throw an error when frequency way too low', function() {
            var invalidFreq = 1;
            var fn = function() {
                var dum = new Note(invalidFreq);
            }
            expect(fn).to.throw(/supplied frequency is invalid/);
        });


    });

    describe('should throw an error when', function() {

        it('attempting to create a note with invalid duration (invalid numerator)', function () {
            var noteDuration = 'dummy/4';
            var fn = function(){
                var dum = new Note('-', noteDuration);
            };
            expect(fn).to.throw(InvalidDurationError);
        });

        it('attempting to create a note with invalid duration (invalid denominator)', function () {
            var noteDuration = '1/stuff';
            var fn = function(){
                var dum = new Note('-', noteDuration);
            };
            expect(fn).to.throw(InvalidDurationError);
        });

        it('attempting to create a note with invalid duration (string)', function () {
            var noteDuration = 'dummy';
            var fn = function(){
                var dum = new Note('-', noteDuration);
            };
            expect(fn).to.throw(InvalidDurationError);
        });

        it('attempting to create a note with invalid duration (array)', function () {
            var noteDuration = ['dummy', 4];
            var fn = function(){
                var dum = new Note('-', noteDuration);
            };
            expect(fn).to.throw(InvalidDurationError);
        });

    });


    describe('getCentsDiff()', function() {
        beforeEach(function(){
            this.note = new Note('Bb1');
        });

        it('should return zero cents for perfect pitch', function () {
            var incomingFreq = 58.270;
            expect(this.note.getCentsDiff(incomingFreq)).to.equal(0);
        });

        it('should give zero for near perfect pitch (slightly flat)', function () {
            expect(this.note.getCentsDiff(58.260)).to.equal(0);
        });

        it('should give zero for near perfect pitch (slightly sharp)', function () {
            expect(this.note.getCentsDiff(58.285)).to.equal(0);
        });

        it('should give null for diff = 1 semitone flat', function () {
            expect(this.note.getCentsDiff(55.000)).to.be.a('null');
        });

        it('should give null for diff > 1 semitone flat', function () {
            expect(this.note.getCentsDiff(54.000)).to.be.a('null');
        });

        it('should give null for diff slightly less than 1 semitone sharp', function () {
            expect(this.note.getCentsDiff(60.735)).to.be.a('null');
        });

        it('should give null for diff > 1 semitone sharp', function () {
            expect(this.note.getCentsDiff(62)).to.be.a('null');
        });

        // TODO think about these tests if they should live somewhere or not
        //it('should throw an error for flat notes below C0', function () {
        //    var errMsg = 'getCentsDiff(): the frequency is outside the threshold - Fq:16.351';
        //    expect(catchError('getCentsDiff', [16.351, 'C7'], this.note)).to.equal(errMsg);
        //});
        //
        //it('should throw an error for sharp notes above B8', function () {
        //    var errMsg = 'getCentsDiff(): the frequency is outside the threshold - Fq:7902.2';
        //    expect(catchError('getCentsDiff', [7902.2, 'B8'], this.note)).to.equal(errMsg);
        //});

        it('should calculate accurately when frequency <= 50 cents off', function () {
            // 3226.9 is 49 cents above the high cutoff
            this.note = new Note('G7');
            expect(this.note.getCentsDiff(3226.9)).to.equal(49);
        });

        it('should calculate accurately when frequency <= 50 cents off', function () {
            // 53.450 is -49 cents below A1 (low freq cutoff)50 cents below A1 (low freq cutoff)
            this.note = new Note('A1');
            expect(this.note.getCentsDiff(53.450)).to.equal(-49);
        });

        it('should calculate accurately when frequency <= 50 cents off', function () {
            // there is .31 unaccounted for between these edges of 49
            this.note = new Note('A4');
            expect(this.note.getCentsDiff(427.65)).to.equal(-49);
        });

        it('should calculate accurately when frequency <= 50 cents off', function () {
            // there is .31 unaccounted for between these edges of 49
            this.note = new Note('Ab4');
            expect(this.note.getCentsDiff(427.34)).to.equal(49);
        });

        it('should calculate accurately when frequency <= 50 cents off', function () {
            // the 50 cent overlaps in mysterious ways -- .23 overlap of the 50
            this.note = new Note('A4');
            expect(this.note.getCentsDiff(427.36)).to.equal(-50);
        });

        it('should calculate accurately when frequency <= 50 cents off', function () {
            // the 50 cent overlaps in mysterious ways -- .23 overlap of the 50
            this.note = new Note('Ab4');
            expect(this.note.getCentsDiff(427.59)).to.equal(50);
        });

    });

    
});
