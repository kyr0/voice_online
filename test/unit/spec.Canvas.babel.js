import Canvas from '../../src/client/js/Canvas.babel.js';

describe('Canvas', () => {

    let canvas;

    beforeEach(() => {
        document.body.innerHTML = '<div id="content"></div>';
        canvas = new Canvas(document.getElementById('content'));
    });

    it('should have destroy() remove renderer, all child nodes, and stage', () => {
        // Arrange
        const rendererMock = {
            destroy: sinon.stub(),
        };
        const stageMock = {
            removeChild: sinon.stub(),
        };
        canvas.graphics = 'dummy';
        canvas.renderer = rendererMock;
        canvas.stage = stageMock;

        const dummyNode = document.createElement('p');
        const dummyNode2 = document.createElement('p');
        canvas.canvasDiv.appendChild(dummyNode);
        canvas.canvasDiv.appendChild(dummyNode2);
        expect(canvas.canvasDiv.children.length).to.equal(2);

        // Act
        canvas.destroy();

        expect(canvas.stage.removeChild.callCount).to.equal(1);
        expect(canvas.renderer.destroy.callCount).to.equal(1);
        expect(canvas.canvasDiv.children.length).to.equal(0);
    });

    it('should call initialize when setWidth() is called', () => {
        const dummyWidth = 1000;
        canvas.initialize = sinon.stub();
        canvas.setWidth(dummyWidth);
        expect(canvas.initialize).to.have.been.calledOnce;
    });

    it('should call initialize when setUser() is called', () => {
        const dummyUser = {
            lower_range: 'C3',
            upper_range: 'C4',
        };
        canvas.initialize = sinon.stub();
        canvas.setUser(dummyUser);
        expect(canvas.initialize).to.have.been.calledOnce;
    });

    it('should call initialize when setLesson() is called', () => {
        const dummyLesson = {
            bpm: 142,
            title: 'dummy',
            notes: [['C3', '1/4']],
            captions: [['-', '1/4']],
        };
        canvas.initialize = sinon.stub();
        canvas.setLesson(dummyLesson);
        expect(canvas.initialize).to.have.been.calledOnce;
    });
});
