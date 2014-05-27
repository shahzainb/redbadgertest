/**
 * MartianRobots class handles the code for the movement of the robots across mars.
 * @param {object} inputData inputData is the object containing the information required such as grid coordinates and the robot's initial position.
 * @constructor
 */
var MartianRobots = function(inputData){

    this.inputData = inputData;
    this.output = null;
    this.circle = null;
    this.isLost = false;
    this.angle = 0;
    this.scents = [];
};

/**
 * begin() starts the running of the program by initialising the canvas and drawing the grid
 * @param {string} canvasId The ID of the canvas element
 */
MartianRobots.prototype.begin = function (canvasId) {

    var canvas = document.getElementById(canvasId);

    canvas.style.width = String(this.inputData.x) + 'px';
    canvas.style.height = String(this.inputData.y) + 'px';

    paper.setup(canvas);
    paper.view.draw();

    this.drawGrid();
};

/**
 * drawGrid() draws the cartesian grid based on the coordinates provided from the inputData
 */
MartianRobots.prototype.drawGrid = function () {

    var numberOfRectanglesX = this.inputData.x / 100;
    var numberOfRectanglesY = this.inputData.y / 100;
    var boundingRectangle   = paper.view.bounds;

    var widthPerRectangle   = boundingRectangle.width / numberOfRectanglesX;
    var heightPerRectangle  = boundingRectangle.height / numberOfRectanglesY;

    for (var i = 0; i <= numberOfRectanglesX; i++) {

        var xPosition   = boundingRectangle.left + i * widthPerRectangle;
        var topPoint    = new paper.Point(xPosition, boundingRectangle.top);
        var bottomPoint = new paper.Point(xPosition, boundingRectangle.bottom);
        var aLine       = new paper.Path.Line(topPoint, bottomPoint);

        aLine.strokeColor = 'black';
    }

    for (var i = 0; i <= numberOfRectanglesY; i++) {

        var yPosition   = boundingRectangle.top + i * heightPerRectangle;
        var leftPoint   = new paper.Point(boundingRectangle.left, yPosition);
        var rightPoint  = new paper.Point(boundingRectangle.right, yPosition);
        var aLine       = new paper.Path.Line(leftPoint, rightPoint);

        aLine.strokeColor = 'black';
    }

    paper.view.update();
};

/**
 * drawRobot() draws the robot onto the grid.
 */
MartianRobots.prototype.drawRobot = function () {

    //Removing any current robots
    if (this.circle) {
        this.circle.remove();
        this.isLost = false;
    }

    var xCoordinate = this.inputData.robotStartingPosition.x;

    //Canvas draws the y-axis as inverted, so to follow the traditional mathematical cartesian graph axis, subtraction needs to be done to invert it
    var yCoordinate = paper.view.bounds.height - this.inputData.robotStartingPosition.y;

    this.circle = new paper.Path.Circle(xCoordinate, yCoordinate, 4);
    this.circle.fillColor = 'red';

    paper.view.update();

    //Getting the orientation
    this.angle = this.getAngle();

};

/**
 * runInstructions() processes the instructions provides.
 * @param {string} instructions The instructions to move the robot from the input box
 * @param {HTMLFormElement} output It's the textarea element so that the output can be written into it.
 */
MartianRobots.prototype.runInstructions = function (instructions, output) {

    this.output = output;

    for (var i = 0; i < instructions.length; i++) {

        this.normalizeAngle();

        switch (instructions.charAt(i)) {

            case 'L':
                this.angle -= 90;
                break;

            case 'R':
                this.angle += 90;
                break;

            case 'F':
                this.moveRobot();
                break;

            default:
                break;
        }
    }

    this.writeOutput();
};

/**
 * writeOutput() writes the last position of the robot into the textarea
 */
MartianRobots.prototype.writeOutput = function () {

    var xCoordinate = String(this.circle.position.x / 100);
    var yCoordinate = String((this.inputData.y - this.circle.position.y) / 100);

    var outputText = '\n' + xCoordinate + ' ' + yCoordinate + ' ' + this.getOrientation();

    this.output.value += outputText;

    if (this.isLost){
        this.output.value += ' LOST';
    }
};

/**
 * moveRobot() moves the robot based on the instructions provided
 */
MartianRobots.prototype.moveRobot = function () {

    //dX = change in X axis
    //dY = change in Y axis
    var dX = 0;
    var dY = 0;

    switch (this.angle){

        case 90:
        case -270:
            dY = 100;
            break;

        case -90:
        case 270:
            dY = -100;
            break;

        case 180:
        case -180:
            dX = -100;
            break;

        case 0:
        case 360:
            dX = 100;
            break;

        default:
            break;
    }

    if (this.isOutsideGrid(dX, dY)){
        return;
    }
    else {

        this.circle.position.x += dX;
        this.circle.position.y += dY;

        paper.view.update();
    }
};

/**
 * getOrientation() returns the orientation in cardinal direction style based on the angle.
 * @returns {string} orientation in N, S, W, or E.
 */
MartianRobots.prototype.getOrientation = function () {

    var orientation = '';

    this.normalizeAngle();

    switch (this.angle) {

        case 90:
        case -270:
            orientation = 'S';
            break;

        case -90:
        case 270:
            orientation = 'N';
            break;

        case 180:
        case -180:
            orientation = 'W';
            break;

        case 0:
        case 360:
            orientation = 'E';
            break;

        default:
            break;
    }

    return orientation;
};

/**
 * isOutsideGrid() checks whether the robot is outside the grid and if it is, adds the last known grid point to the scent
 * so that other robots don't fall off this same point.
 * @param dX {number} change in position along the X-axis
 * @param dY {number} change in position along the Y-axis
 * @returns {boolean} true or false whether the robot is outside grid or no.
 */
MartianRobots.prototype.isOutsideGrid = function (dX, dY) {

    var currentCoordinates = this.getRobotCoordinates();
    var nextCoordinates = [0, 0];

    nextCoordinates[0] = currentCoordinates[0] + dX;
    nextCoordinates[1] = currentCoordinates[1] - dY;

    nextCoordinates = nextCoordinates.map(String);
    nextCoordinates = nextCoordinates.join(',');

    if (currentCoordinates[0] < 0 || currentCoordinates[1] < 0 || currentCoordinates[0] > this.inputData.x || currentCoordinates[1] > this.inputData.y) {

        var scent = String(currentCoordinates[0]) + ',' + String(currentCoordinates[1]);

        this.isLost = true;

        this.scents.push(scent);

    }

    if (this.scents.indexOf(nextCoordinates) > -1) {
        return true;
    }

    return false;

};

/**
 * Normalises the angle to within 0-360 degress.
 */
MartianRobots.prototype.normalizeAngle = function () {
    (this.angle %= 360) >= 0 ? this.angle : (this.angle + 360);
};

/**
 * Gets the coordinates of the robot as an array
 * @returns {Array}
 */
MartianRobots.prototype.getRobotCoordinates = function () {

    var coordinates = [0, 0];

    var xCoordinate = this.circle.position.x;
    coordinates[0] = xCoordinate;

    var yCoordinate = this.inputData.y - this.circle.position.y;
    coordinates[1] = yCoordinate;

    return coordinates;
};

/**
 * Gets the angle based on the cardinal direction
 * @returns {number}
 */
MartianRobots.prototype.getAngle = function () {

    var angle = 0;

    switch (this.inputData.robotStartingPosition.orientation) {

        case 'N':
            angle = -90;
            break;

        case 'S':
            angle = 90;
            break;

        case 'E':
            angle = 0;
            break;

        case 'W':
            angle = 180;
            break;

        default:
            angle = 0;
            break;
    }

    return angle;
};