describe('MartianRobots', function(){

    var test = null;
    var robotMock = null;

    var testInputData = {
        x: 500,
        y: 300,
        robotStartingPosition: {
            x: 200,
            y: 200,
            orientation: 'S'
        }
    }

    test = new MartianRobots(testInputData);

    test.begin('testCanvas');

    robotMock = new paper.Path.Circle(200, 200, 4);

    test.circle = robotMock;

    it('should get the orientation in cardinal direction', function () {

        test.angle = 180;

        var orientation = test.getOrientation();

        expect(orientation).toBe('W');
    });

    it('should normalise the angle to between 0 and 360 degrees', function () {

        test.angle = 820;

        test.normalizeAngle();

        expect(test.angle).toBe(100);
    });

    it('should return the robot\'s coordinates in an array', function () {

        var coordinates = test.getRobotCoordinates();

        expect(coordinates).toContain(200);
        expect(coordinates).toContain(100);
    });

    it('should return the angle based on the cardinal direction', function () {

        test.inputData.robotStartingPosition.orientation = 'S';

        var angle = test.getAngle();

        expect(angle).toEqual(90);

        test.inputData.robotStartingPosition.orientation = 'N';

        angle = test.getAngle();

        expect(angle).toEqual(-90);
    });

    it('should check if the robot is going outside the grid', function () {

        var isOutsideGrid = test.isOutsideGrid(200, 0);

        expect(isOutsideGrid).toBe(false);
    });


});
