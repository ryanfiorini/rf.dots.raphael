var MAX_ROWS = 5;
var MAX_COLS = 5;
var x = 310, y = 180, r = 10

var playerUp = 1;
var player1Blocks = 0;
var player2Blocks = 0;

var circles = null;
var lines = null;
var squares = null;

function Circle(row, col, selected) {
    return {
        row: row,
        col: col,
        selected: selected
    }
}

// Square Class
function Square(row, col) {
    return {
        row: row,
        col: col,
        top: false,
        right: false,
        bottom: false,
        left: false,
        captured: false
    }
}

function loadCircles() {
    circles = new Array(MAX_ROWS);


    // create the array of circles
    for (var i = 0; i < MAX_ROWS; i++) {
        circles[i] = new Array(MAX_COLS);
        for (var j = 0; j < MAX_COLS; j++) {
            circles[i][j] = new Circle(i, j, false);

            var anim = Raphael.animation({cx: 50 * (i + 1), cy: 50 * (j + 1)}, 2e3);
            //R.ball(10, 10, 10, Math.random()).animate(anim);
            R.ball(10, 10, 10).attr({id:"circle_" + i + "_" + j}).animate(anim);
        }
    }
}

function loadSquares() {
    squares = new Array(MAX_ROWS - 1);

    // add the center squares.
    for (var i = 0; i < (MAX_ROWS-1); i++) {
        squares[i] = new Array(MAX_COLS - 1);
        for (var j = 0; j < (MAX_COLS-1); j++) {
            squares[i][j] = new Square(i, j);
            var anim = Raphael.animation({x: (50 * (i + 1))+3, y: 50 * (j + 1)+3}, 2e3);

            var squ = R.rect(10, 10, 44, 44).attr({gradient: '90-#526c7a-#64a0c1'}).click(function () {
                this.attr({fill: "#000"})
            }).animate(anim);  

            squares[i][j].box = squ;
        }
    }

}

function loadClickLines() {
    // add the Vertical lines to the document.
    for (var i = 0; i < (MAX_ROWS); i++) {
        for (var j = 0; j < (MAX_COLS-1); j++) {
            var anim = Raphael.animation({x: (50 * (i + 1))-3, y: 50 * (j + 1)}, 2e3);

            var t = R.rect(10, 10, 6, 50).attr({fill: "#ccc"}).click(function () {
                this.attr({fill: "#f00",gradient: '90-#526c7a-#64a0c1'})
            }).animate(anim);  
            t.node.id = "hline_" + i + "_" + j;
        }
    }

    // add the Horizontal lines to the document.
    for (var i = 0; i < (MAX_ROWS-1); i++) {
        for (var j = 0; j < (MAX_COLS); j++) {
            var anim = Raphael.animation({x: 50 * (i + 1), y: 50 * (j + 1)-3}, 2e3);

            var t = R.rect(10, 10, 50, 6).attr({fill: "#ccc"}).click(function () {
                //this.attr({gradient: '90-#526c7a-#64a0c1'})
                handleHorizontalLineClick(this);
            }).animate(anim);
            t.node.id = "hline_" + i + "_" + j;
        }
    }
}

function handleHorizontalLineClick(line) {
    debugger;
    //$("#" + this.id).unbind("click");
    line.attr({ gradient: '90-#526c7a-#64a0c1' });
    var captured = false;
    var rowcol = getRowCol(line);

    if (rowcol.row == 0) {
        squares[rowcol.row][rowcol.col].top = true;

        if (squares[rowcol.row][rowcol.col].top &&
                squares[rowcol.row][rowcol.col].right &&
                squares[rowcol.row][rowcol.col].bottom &&
                squares[rowcol.row][rowcol.col].left) {
            /*$("#" + squares[rowcol.row][rowcol.col].box.id).addClass((playerUp == 1) ? "box_player1" : "box_player2");
            if (playerUp == 1) {
            player1Blocks += 1;
            $("#player1Blocks").html("Player 1 Blocks: " + player1Blocks);
            } else {
            player2Blocks += 1;
            $("#player2Blocks").html("Player 2 Blocks: " + player2Blocks);
            }*/
            setCapturedSquare(rowcol.row, rowcol.col);
            captured = true;
        }
    } else if (rowcol.row == (MAX_ROWS - 1)) {
        squares[rowcol.row - 1][rowcol.col].bottom = true;

        if (squares[rowcol.row - 1][rowcol.col].top &&
                squares[rowcol.row - 1][rowcol.col].right &&
                squares[rowcol.row - 1][rowcol.col].bottom &&
                squares[rowcol.row - 1][rowcol.col].left) {
            setCapturedSquare(rowcol.row - 1, rowcol.col);
            captured = true;
        }
    } else {
        squares[rowcol.row][rowcol.col].top = true;
        squares[rowcol.row - 1][rowcol.col].bottom = true;

        if (squares[rowcol.row][rowcol.col].top &&
                squares[rowcol.row][rowcol.col].right &&
                squares[rowcol.row][rowcol.col].bottom &&
                squares[rowcol.row][rowcol.col].left) {
            setCapturedSquare(rowcol.row, rowcol.col);
            captured = true;
        }

        if (squares[rowcol.row - 1][rowcol.col].top &&
                squares[rowcol.row - 1][rowcol.col].right &&
                squares[rowcol.row - 1][rowcol.col].bottom &&
                squares[rowcol.row - 1][rowcol.col].left) {
            setCapturedSquare(rowcol.row - 1, rowcol.col);
            captured = true;
        }
    }

    if (!captured) {
        playerUp = (playerUp == 1) ? 2 : 1;
        $("#currentPlayer").html("Current Player: " + playerUp);
    }
}

function getRowCol(htmlDiv) {
    var id = htmlDiv.node.id;
    var locFirst = id.indexOf("_");
    var locSecond = id.lastIndexOf("_");

    var row = id.substring(locFirst + 1, locSecond);
    var col = id.substring(locSecond + 1, id.length);
    return { row: parseInt(row), col: parseInt(col) };
}
