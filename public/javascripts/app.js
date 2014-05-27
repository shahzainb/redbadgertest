var redBadger = (function(){

    //This will hold the instantiation of the MartianRobots class
    var test = null;

    //Default data from inputs
    var inputData = {
        x: 5,
        y: 3,
        robotStartingPosition: {
            x: 1,
            y: 1,
            orientation: 'E'
        }
    };


    var canvasId = 'martianCanvas';

    var drawGridButton = document.getElementById('drawGrid');

    var gridCoordinatesInput = document.getElementById('gridCoordinates');

    var robotPositionInput = document.getElementById('robotPosition');

    var robotPositionButton = document.getElementById('drawRobot');

    var instructionsButton = document.getElementById('runInstructions');

    var instructionsInput = document.getElementById('instructions');

    var output = document.getElementById('outputData');

    return {
        initialise: function () {

            //Adding click handler on to button
            drawGridButton.addEventListener('click', this.onDrawGridClick, false);
            instructionsButton.addEventListener('click', this.onRunInstructionsClick, false);
            robotPositionButton.addEventListener('click', this.onDrawRobotClick, false);
        },

        onDrawGridClick: function () {

            var gridCoordinates = gridCoordinatesInput.value;

            if (gridCoordinates.match(/[0-9]+,[0-9]+/) == null) {
                toastr.error('Please type the coordinates like 5,3', 'Error');
                return;
            }
            gridCoordinates = gridCoordinates.split(',');
            gridCoordinates = gridCoordinates.map(Number);

            inputData.x = gridCoordinates[0] * 100;
            inputData.y = gridCoordinates[1] * 100;

            test = new MartianRobots(inputData);

            test.begin(canvasId);
        },

        onDrawRobotClick: function () {

            var robotPosition = robotPositionInput.value.toUpperCase();

            if (robotPosition.match(/[0-9]+,[0-9]+,[nNsSwWeE]/) == null){

                toastr.error('Please type the coordinates like 1,1,E. Only N, S, W, E are allowed for orientation.','Error');
                return;
            }
            else if (test == null) {

                toastr.error('Please enter Grid Coordinates first and click on \'Draw Grid\'.','Error');
                return;
            }

            robotPosition = robotPosition.split(',');

            inputData.robotStartingPosition.x           = parseInt(robotPosition[0], 10) * 100;
            inputData.robotStartingPosition.y           = parseInt(robotPosition[1], 10) * 100;
            inputData.robotStartingPosition.orientation = robotPosition[2];

            test.inputData = inputData;

            test.drawRobot();
        },

        onRunInstructionsClick: function () {

            var instructions = instructionsInput.value.toUpperCase();
            test.runInstructions(instructions, output);
        }
    }

})();

redBadger.initialise();