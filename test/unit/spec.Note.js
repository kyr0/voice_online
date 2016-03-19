'use strict';

var Note = require('../../src/client/js/Note.js');

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

    it('should set length when passed in to constructor', function () {
        expect(this.silentNote.noteLength).to.equal('1/4');
    });

});

describe('Note Object', function() {

    beforeEach(function() {
        this.noteName = 'B2';
        this.note = new Note(this.noteName);
        this.silentNote = new Note('-');
    });

    it('should have passed in name, related frequency, and default length of 1/1', function () {
        var expectNoteLength = '1/1';
        var expectFrequency = 123.47;
        var noteObj = this.note;
        expect(noteObj.name).to.equal(this.noteName);
        expect(noteObj.noteLength).to.equal(expectNoteLength);
        expect(noteObj.frequency).to.equal(expectFrequency);
    });

    it('should set length when passed in to constructor', function () {
        var noteLength = '1/8';
        var noteObj = new Note(this.noteName, noteLength);
        expect(noteObj.noteLength).to.equal(noteLength);
    });

    it('should convert length of "1" to a note using a length of "1/1"', function () {
        var noteLength = '1';
        var expectedNoteObj = { name : this.noteName, noteLength : '1/1' };
        var noteObj = new Note(this.noteName, noteLength);
        expect(noteObj.noteLength).to.equal(expectedNoteObj.noteLength  );
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

    describe('Note Object', function() {

        it('should accept a note length longer than a full measure', function () {
            var expectLength = '2/1';
            var noteObj = new Note('A2', '2');
            expect(noteObj.noteLength).to.equal(expectLength);
        });

        it('should accept any multiple of a full measure', function () {
            var expectLength = '200/1';
            var noteObj = new Note('A2', '200');
            expect(noteObj.noteLength).to.equal(expectLength);
        });

        it('should accept a note length where numerator > 1 ', function () {
            var expectLength = '3/32';
            var noteObj = new Note('A2', '3/32');
            expect(noteObj.noteLength).to.equal(expectLength);
        });

    });

    describe('should throw an error when', function() {

        beforeEach(function() {
            this.createNote = function (name, noteLength) {
                return new Note(name, noteLength);
            };
        });

        it('attempting to create a note with invalid length (invalid numerator)', function () {
            var noteLength = 'dummy/4';
            var errMsg = 'Note(): the supplied note length is invalid: ' + noteLength;
            expect(catchError(this.createNote, [this.noteName, noteLength])).to.equal(errMsg);
        });

        it('attempting to create a note with invalid length (invalid denominator)', function () {
            var noteLength = '1/stuff';
            var errMsg = 'Note(): the supplied note length is invalid: ' + noteLength;
            expect(catchError(this.createNote, [this.noteName, noteLength])).to.equal(errMsg);
        });

        it('attempting to create a note with invalid length (string)', function () {
            var noteLength = 'dummy';
            var errMsg = 'Note(): the supplied note length is invalid: ' + noteLength;
            expect(catchError(this.createNote, [this.noteName, noteLength])).to.equal(errMsg);
        });

        it('attempting to create a note with invalid length (array)', function () {
            var noteLength = ['dummy', 4];
            var errMsg = 'Note(): the supplied note length is invalid: ' + noteLength;
            expect(catchError(this.createNote, [this.noteName, noteLength])).to.equal(errMsg);
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
