/*! rf.dots() Dots game builder using Raphael in JS. Authors & copyright (c) 2012: Ryan Fiorini. Dual MIT/BSD license */
window.rf = window.rf || {};

window.rf.dots = (function () {
    "use strict";
    var options1 = {
        MAX_ROWS: 5,
        MAX_COLS: 5,
        x: 310,
        y: 180,
        r: 10,

        playerUp: 1,
        player1Blocks: 0,
        player2Blocks: 0
    };

    var getRowCol = function (htmlDiv) {
        var id = htmlDiv.node.id;
        var locFirst = id.indexOf("_");
        var locSecond = id.lastIndexOf("_");

        var row = id.substring(locFirst + 1, locSecond);
        var col = id.substring(locSecond + 1, id.length);
        return { row: parseInt(row), col: parseInt(col) };
    };


    return {
        options: {
            MAX_ROWS: 5,
            MAX_COLS: 5,
            x: 310,
            y: 180,
            r: 10,

            playerUp: 1,
            player1Blocks: 0,
            player2Blocks: 0
        },
        board: {
            circles: null,
            lines: null,
            squares: null
        },

        Circle: function (row, col, selected) {
            return {
                row: row,
                col: col,
                selected: selected
            }
        },

        Square: function (row, col) {
            return {
                row: row,
                col: col,
                top: false,
                right: false,
                bottom: false,
                left: false,
                captured: false
            }
        },

        loadCircles: function () {
            this.board.circles = new Array(this.options.MAX_ROWS);

            // create the array of circles
            for (var i = 0; i < this.options.MAX_ROWS; i++) {
                this.board.circles[i] = new Array(this.options.MAX_COLS);
                for (var j = 0; j < this.options.MAX_COLS; j++) {
                    this.board.circles[i][j] = new this.Circle(i, j, false);

                    var anim = Raphael.animation({ cx: 50 * (i + 1), cy: 50 * (j + 1) }, 2e3);
                    //R.ball(10, 10, 10, Math.random()).animate(anim);
                    R.ball(10, 10, 10).attr({ id: "circle_" + i + "_" + j }).animate(anim);
                }
            }
        },

        loadSquares: function () {
            this.board.squares = new Array(this.options.MAX_ROWS - 1);

            // add the center squares.
            for (var i = 0; i < (this.options.MAX_ROWS - 1); i++) {
                this.board.squares[i] = new Array(this.options.MAX_COLS - 1);
                for (var j = 0; j < (this.options.MAX_COLS - 1); j++) {
                    this.board.squares[i][j] = new this.Square(i, j);
                    var anim = Raphael.animation({ x: (50 * (i + 1)) + 3, y: 50 * (j + 1) + 3 }, 2e3);

                    var squ = R.rect(10, 10, 44, 44).attr({ gradient: '90-#526c7a-#64a0c1' }).click(function () {
                        this.attr({ fill: "#000" })
                    }).animate(anim);

                    this.board.squares[i][j].box = squ;
                }
            }
        },

        loadClickLines: function () {
            var that = this;

            // add the Vertical lines to the document.
            for (var i = 0; i < (this.options.MAX_ROWS); i++) {
                for (var j = 0; j < (this.options.MAX_COLS - 1); j++) {
                    var anim = Raphael.animation({ x: (50 * (i + 1)) - 3, y: 50 * (j + 1) }, 2e3);

                    var t = R.rect(10, 10, 6, 50).attr({ fill: "#ccc" }).click(function () {
                        this.attr({ fill: "#f00", gradient: '90-#526c7a-#64a0c1' })
                    }).animate(anim);
                    t.node.id = "hline_" + i + "_" + j;
                }
            }

            // add the Horizontal lines to the document.
            for (var i = 0; i < (this.options.MAX_ROWS - 1); i++) {
                for (var j = 0; j < (this.options.MAX_COLS); j++) {
                    var anim = Raphael.animation({ x: 50 * (i + 1), y: 50 * (j + 1) - 3 }, 2e3);

                    var t = R.rect(10, 10, 50, 6).attr({ fill: "#ccc" }).click(function () {
                        that.handleHorizontalLineClick(this);
                    }).animate(anim);
                    t.node.id = "hline_" + i + "_" + j;
                }
            }
        },

        handleHorizontalLineClick: function (line) {
            line.attr({ gradient: '90-#526c7a-#64a0c1' });
            var captured = false;
            var rowcol = getRowCol(line);

            if (rowcol.row == 0) {
                this.board.squares[rowcol.row][rowcol.col].top = true;

                if (this.board.squares[rowcol.row][rowcol.col].top &&
                        this.board.squares[rowcol.row][rowcol.col].right &&
                        this.board.squares[rowcol.row][rowcol.col].bottom &&
                        this.board.squares[rowcol.row][rowcol.col].left) {
                    setCapturedSquare(rowcol.row, rowcol.col);
                    captured = true;
                }
            } else if (rowcol.row == (this.options.MAX_ROWS - 1)) {
                this.board.squares[rowcol.row - 1][rowcol.col].bottom = true;

                if (this.board.squares[rowcol.row - 1][rowcol.col].top &&
                        this.board.squares[rowcol.row - 1][rowcol.col].right &&
                        this.board.squares[rowcol.row - 1][rowcol.col].bottom &&
                        this.board.squares[rowcol.row - 1][rowcol.col].left) {
                    setCapturedSquare(rowcol.row - 1, rowcol.col);
                    captured = true;
                }
            } else {
                this.board.squares[rowcol.row][rowcol.col].top = true;
                this.board.squares[rowcol.row - 1][rowcol.col].bottom = true;

                if (this.board.squares[rowcol.row][rowcol.col].top &&
                        this.board.squares[rowcol.row][rowcol.col].right &&
                        this.board.squares[rowcol.row][rowcol.col].bottom &&
                        this.board.squares[rowcol.row][rowcol.col].left) {
                    setCapturedSquare(rowcol.row, rowcol.col);
                    captured = true;
                }

                if (this.board.squares[rowcol.row - 1][rowcol.col].top &&
                        this.board.squares[rowcol.row - 1][rowcol.col].right &&
                        this.board.squares[rowcol.row - 1][rowcol.col].bottom &&
                        this.board.squares[rowcol.row - 1][rowcol.col].left) {
                    setCapturedSquare(rowcol.row - 1, rowcol.col);
                    captured = true;
                }
            }

            if (!captured) {
                this.options.playerUp = (this.options.playerUp == 1) ? 2 : 1;
                $("#currentPlayer").html("Current Player: " + this.options.playerUp);
            }
        }

    };
})();
