/// <reference path="jquery-1.7.2-vsdoc.js" />

// Circle Class
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

var MAX_ROWS;
var MAX_COLS;
var firstCircle = null;
var secondCircle = null;
var firstCirclePosition = null;
var secondCirclePosition = null;
var playerUp = 1;
var player1Blocks = 0;
var player2Blocks = 0;

var circles = null;
var lines = null;
var squares = null;

/* This function runs once the page is loaded, but appMobi is not yet active */
var init = function () {

};

/* This code prevents users from dragging the page */
var preventDefaultScroll = function (event) {
    event.preventDefault();
    window.scroll(0, 0);
    return false;
};
document.addEventListener('touchmove', preventDefaultScroll, false);

/* This code is used to run as soon as appMobi activates */
var onDeviceReady = function () {
    //bark();
    //use AppMobi viewport
    //AppMobi.display.useViewport(768, 1024);
    AppMobi.display.useViewport(1024, 768);

    //lock orientation
    AppMobi.device.setRotateOrientation("landscape");
    AppMobi.device.setAutoRotate(false);

    //detect the initial orientation of the device
    if (AppMobi.device.initialOrientation == "90" || AppMobi.device.initialOrientation == "-90") {
        //landscape
        MAX_ROWS = 2;
        MAX_COLS = 2;

        MAX_ROWS += 1;
        MAX_COLS += 1;
    }
    else {
        //portrait
        MAX_ROWS = 2;
        MAX_COLS = 2;

        MAX_ROWS += 1;
        MAX_COLS += 1;
    }

    //manage power
    AppMobi.device.managePower(true, false);

    AMUi = new aUX.ui();
    //AMUi.addContentDiv("splashScreen");

    buildBoardGame();

    addStyles();
};

function addStyles() {
    for (var i = 0; i < 10; i++) {
        addStyle(".row" + i, "top: " + i + "00px;");
        addStyle(".col" + i, "left: " + i + "00px;");
        addStyle(".vRow" + i + ", .hRow" + i, "top: " + i + "30px;");
        addStyle(".vCol" + i + ", .hCol" + i, "left: " + i + "30px;");
        addStyle(".bCol" + i, "left: " + i + "75px;");
        addStyle(".bRow" + i, "top: " + i + "75px;");
        addStyle(".bCol" + i + "C", "left: " + i + "35px;");
        addStyle(".bRow" + i + "C", "top: " + i + "35px;");
        addStyle(".vClickCol" + i, "left: " + i + "20px;");
        addStyle(".hClickCol" + i, "left: " + i + "40px;");
        addStyle(".vClickRow" + i, "top: " + i + "40px;");
        addStyle(".hClickRow" + i, "top: " + i + "20px;");
    }
}

document.addEventListener("appMobi.device.ready", onDeviceReady, false);

$(document).ready(function () {
    onDeviceReady();
});

function addStyle(tag, style) {
    document.styleSheets[0].addRule(tag, style)
}

function clearScore() {
    playerUp = 1;
    $("#currentPlayer").html("Current Player: " + playerUp);
    player1Blocks = 0;
    $("#player1Blocks").html("Player 1 Blocks: " + player1Blocks);
    player2Blocks = 0;
    $("#player2Blocks").html("Player 2 Blocks: " + player2Blocks);
}

function buildBoardGame() {
    //debugger;
    $("#Lines").empty();
    $("#ClickLines").empty();
    $("#Circles").empty();
    $("#Squares").empty();

    //hide splash screen
    AppMobi.device.hideSplashScreen();
    loadCircles();
    loadLines();
    loadSquares();
    loadClickLines();

    $("#player1Blocks").html("Player 1 Blocks: " + player1Blocks);
    $("#player2Blocks").html("Player 2 Blocks: " + player2Blocks);

    $(".hclickline").bind("click", function () {
        $("#" + this.id.replace("hclickline_", "hline_")).addClass((playerUp == 1) ? "hselected1" : "hselected2");
        $("#" + this.id).unbind("click");

        var captured = false;
        var rowcol = getRowCol(this);

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

        if ($("#chkVibrate")[0].checked)
            AppMobi.notification.vibrate();
    });

    $(".vclickline").bind("click", function () {
        $("#" + this.id.replace("vclickline_", "vline_")).addClass((playerUp == 1) ? "vselected1" : "vselected2");
        $("#" + this.id).unbind("click");

        var captured = false;
        var rowcol = getRowCol(this);

        if (rowcol.col == 0) {
            squares[rowcol.row][rowcol.col].left = true;

            if (squares[rowcol.row][rowcol.col].top &&
                    squares[rowcol.row][rowcol.col].right &&
                    squares[rowcol.row][rowcol.col].bottom &&
                    squares[rowcol.row][rowcol.col].left) {
                setCapturedSquare(rowcol.row, rowcol.col);
                captured = true;
            }
        } else if (rowcol.col == (MAX_COLS - 1)) {
            squares[rowcol.row][rowcol.col - 1].right = true;

            if (squares[rowcol.row][rowcol.col - 1].top &&
                    squares[rowcol.row][rowcol.col - 1].right &&
                    squares[rowcol.row][rowcol.col - 1].bottom &&
                    squares[rowcol.row][rowcol.col - 1].left) {
                setCapturedSquare(rowcol.row, rowcol.col - 1);
                captured = true;
            }
        } else {
            squares[rowcol.row][rowcol.col].left = true;
            squares[rowcol.row][rowcol.col - 1].right = true;

            if (squares[rowcol.row][rowcol.col].top &&
                    squares[rowcol.row][rowcol.col].right &&
                    squares[rowcol.row][rowcol.col].bottom &&
                    squares[rowcol.row][rowcol.col].left) {
                setCapturedSquare(rowcol.row, rowcol.col);
                captured = true;
            }

            if (squares[rowcol.row][rowcol.col - 1].top &&
                    squares[rowcol.row][rowcol.col - 1].right &&
                    squares[rowcol.row][rowcol.col - 1].bottom &&
                    squares[rowcol.row][rowcol.col - 1].left) {
                setCapturedSquare(rowcol.row, rowcol.col - 1);
                captured = true;
            }
        }

        if (!captured) {
            playerUp = (playerUp == 1) ? 2 : 1;
            $("#currentPlayer").html("Current Player: " + playerUp);
        }

        if ($("#chkVibrate")[0].checked)
            AppMobi.notification.vibrate();
    });
}

function setCapturedSquare(row, col) {
    $("#" + squares[row][col].box.id).addClass((playerUp == 1) ? "box_player1" : "box_player2");
    $("#" + squares[row][col].box.id).addClass("bCol" + col + "C");
    $("#" + squares[row][col].box.id).addClass("bRow" + row + "C");
    if (playerUp == 1) {
        player1Blocks += 1;
        $("#player1Blocks").html("Player 1 Blocks: " + player1Blocks);
    } else {
        player2Blocks += 1;
        $("#player2Blocks").html("Player 2 Blocks: " + player2Blocks);
    }

    squares[row][col].captured = true;

    var gameComplete = true;

    for (var i = 0; i < (MAX_ROWS - 1); i++) {
        for (var j = 0; j < (MAX_COLS - 1); j++) {
            if (!squares[i][j].captured) {
                gameComplete = false;
            }
        }
    }

    if (gameComplete) {
        setTimeout(function () {
            $("#winnerMessage").html("Game is over. <br /><br /> Congratulation Player <strong>" + ((player1Blocks > player2Blocks) ? "1" : "2") + "</strong>");
            AMUi.loadContent("#pnlWinnerMessage", false, false, "fade");
        }, 1000);
    }
}

function loadCircles() {
    circles = new Array(MAX_ROWS);

    // create the array of circles
    for (var i = 0; i < MAX_ROWS; i++) {
        circles[i] = new Array(MAX_COLS);
        for (var j = 0; j < MAX_COLS; j++) {
            circles[i][j] = new Circle(i, j, false);

            // add the circles to the document.
            var div = document.createElement("div");
            div.id = "circle_" + i + "_" + j;
            div.className = "circle row" + i + " col" + j;
            div.onclick = function () {
                /*debugger;
                if (firstCircle) {
                secondCirclePosition = getRowCol(this);
                if (isSameCircle(firstCirclePosition, secondCirclePosition)) {
                $("#" + this.id).removeClass("clicked");
                firstCircle = null;
                firstCirclePosition = null;
                secondCircle = null;
                secondCirclePosition = null;
                } else if (isNextTo(firstCirclePosition, secondCirclePosition)) {
                $("#" + this.id).addClass("clicked");

                // draw a line

                firstCircle = null;
                firstCirclePosition = null;
                secondCircle = null;
                secondCirclePosition = null;
                } else {
                //firstCircle.className = (firstCircle == null) ? firstCircle.className : firstCircle.className.replace(" clicked", "");
                $("#" + firstCircle.id).removeClass("clicked");
                firstCircle = this;
                firstCirclePosition = getRowCol(this);
                $("#" + this.id).addClass("clicked");
                }
                } else {
                firstCircle = this;
                firstCirclePosition = getRowCol(this);
                $("#" + this.id).addClass("clicked");
                }

                if ($("#" + this.id).hasClass("clicked")) {
                          
                } else {
                         
                }*/
                /*this.className = (this.className.indexOf("clicked") > -1)
                ? this.className.replace(" clicked", "")
                : this.className = this.className + " clicked";*/
            };
            $("#Circles").prepend(div);
        }
    }
}

function loadLines() {
    // add the circles to the document.
    for (var i = 0; i < (MAX_ROWS - 1); i++) {
        for (var j = 0; j < (MAX_COLS); j++) {
            var div = document.createElement("div");
            div.id = "vline_" + i + "_" + j;
            div.className = "vline vRow" + i + " vCol" + j;
            /*div.onclick = function () {
            if ($("#" + this.id).hasClass("selected")) {
            $("#" + this.id).removeClass("selected");
            } else {
            $("#" + this.id).addClass("selected");
            }
            };*/
            $("#Lines").append(div);
        }
    }

    for (var i = 0; i < (MAX_ROWS); i++) {
        for (var j = 0; j < (MAX_COLS - 1); j++) {
            var div = document.createElement("div");
            div.id = "hline_" + i + "_" + j;
            div.className = "hline hRow" + i + " hCol" + j;
            /*div.onclick = function () {
            if ($("#" + this.id).hasClass("selected")) {
            $("#" + this.id).removeClass("selected");
            } else {
            $("#" + this.id).addClass("selected");
            }
            };*/
            $("#Lines").append(div);
        }
    }
}

function loadSquares() {
    squares = new Array(MAX_ROWS - 1);

    //debugger;
    // create the array of circles
    for (var i = 0; i < (MAX_ROWS - 1); i++) {
        squares[i] = new Array(MAX_COLS - 1);
        for (var j = 0; j < (MAX_COLS - 1); j++) {
            squares[i][j] = new Square(i, j);

            var div = document.createElement("div");
            div.id = "box_" + i + "_" + j;
            div.className = "box bRow" + i + " bCol" + j;
            squares[i][j].box = div;
            /*div.onclick = function () {
            };*/
            $("#Squares").append(div);
        }
    }
}

function loadClickLines() {
    // add the circles to the document.
    for (var i = 0; i < (MAX_ROWS - 1); i++) {
        for (var j = 0; j < (MAX_COLS); j++) {
            var div = document.createElement("div");
            div.id = "vclickline_" + i + "_" + j;
            div.className = "vclickline vClickRow" + i + " vClickCol" + j;
            $("#ClickLines").append(div);
        }
    }

    for (var i = 0; i < (MAX_ROWS); i++) {
        for (var j = 0; j < (MAX_COLS - 1); j++) {
            var div = document.createElement("div");
            div.id = "hclickline_" + i + "_" + j;
            div.className = "hclickline hClickRow" + i + " hClickCol" + j;
            /*div.onclick = function () {
            if ($("#" + this.id).hasClass("selected")) {
            $("#" + this.id).removeClass("selected");
            } else {
            $("#" + this.id).addClass("selected");
            }
            };*/
            $("#ClickLines").append(div);
        }
    }
}

function isSameCircle(firstCircle, secondCircle) {
    if (
            ((Math.abs(firstCircle.row - secondCircle.row) == 0) && (Math.abs(firstCircle.col - secondCircle.col) == 0))
            ) {
        return true;
    } else {
        return false;
    }
}

function isNextTo(firstCircle, secondCircle) {
    if (
            ((Math.abs(firstCircle.row - secondCircle.row) == 1) && (Math.abs(firstCircle.col - secondCircle.col) == 0)) ||
            ((Math.abs(firstCircle.row - secondCircle.row) == 0) && (Math.abs(firstCircle.col - secondCircle.col) == 1))
            ) {
        return true;
    } else {
        return false;
    }
}

function getRowCol(htmlDiv) {
    var id = htmlDiv.id;
    var locFirst = id.indexOf("_");
    var locSecond = id.lastIndexOf("_");

    var row = id.substring(locFirst + 1, locSecond);
    var col = id.substring(locSecond + 1, id.length);
    return { row: parseInt(row), col: parseInt(col) };
}

function bark() {
    try {
        AppMobi.player.playSound("sounds/bark02.mp3");
    }
    catch (e) { }
}

function Restart() {
    debugger;
    clearScore();
    buildBoardGame();
    AMUi.loadContent("#gameBoard", false, false, "fade");
}

function updateSetting() {
    MAX_ROWS = parseInt($("#txtRows").val());
    MAX_COLS = parseInt($("#txtCols").val());
    MAX_ROWS += 1;
    MAX_COLS += 1;

    clearScore();
    buildBoardGame();
    AMUi.loadContent("#gameBoard", false, false, "fade");
}

function cancel() {
    AMUi.loadContent("#gameBoard", false, false, "fade");
}

function showSettings() {
    $("#txtRows").val(MAX_ROWS-1);
    $("#txtCols").val(MAX_COLS-1);
    AMUi.loadContent("#settings", false, false, "fade");
}
