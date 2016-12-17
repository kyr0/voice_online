import Canvas from '../../src/client/js/Canvas.babel.js';

describe('Canvas', () => {

    let canvas;

    beforeEach(() => {
        document.body.innerHTML = '<div id="content"></div>';
        canvas = new Canvas(document.getElementById('content'));
    });

    it('resetConnections() should remove renderer, child nodes, and stage', () => {
        // Arrange
        const rendererMock = {
            destroy: sinon.stub(),
        };
        const stageMock = {
            destroy: sinon.stub(),
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
        canvas.resetConnections();

        expect(stageMock.destroy.callCount).to.equal(1);
        expect(rendererMock.destroy.callCount).to.equal(1);
        expect(canvas.canvasDiv.children.length).to.equal(1);  // removes 2 children, then adds 1
    });

    it('should call initialize when setWidth() is called', () => {
        const dummyWidth = 1000;
        canvas.initialize = sinon.stub();
        canvas.setWidth(dummyWidth);
        expect(canvas.initialize).to.have.been.calledOnce;
    });

    it('should call initialize when setPlayer() is called', () => {
        const dummyPlayer = {};
        canvas.initialize = sinon.stub();
        canvas.setPlayer(dummyPlayer);
        expect(canvas.initialize).to.have.been.calledOnce;
    });
});
