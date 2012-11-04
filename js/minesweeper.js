define([
    'jquery'
], function ($) {

    var Cell = function(board, x, y) {
        this.board = board;
        this.x = x;
        this.y = y;
    };
    Cell.prototype.init = function(row) {
        this.$elt = $('<div class="cell"></div>');

        this.$row = $(row);
        this.$row.append(this.$elt);

        this.$elt.click(this.clear.bind(this));
    };
    Cell.prototype.addBomb = function() {
        this.hasBomb = true;
    };
    Cell.prototype.getNeighbors = function() {
        var neighbors = [];
        var i, j;
        for (i = this.x-1; i <= this.x+1; i++) {
            for (j = this.y-1; j <= this.y+1; j++) {
                if ((i >= 0) && (i < this.board.size) && (j >= 0) && (j < this.board.size)) {
                    neighbors.push(this.board.getCell(i, j));
                }
            }
        }

        return neighbors;
    };
    Cell.prototype.clear = function () {
        if (this.$elt.hasClass('revealed')) {
            // This cell has already been opened once, so skip it.
            return;
        }

        this.$elt.addClass('revealed');
        var neighbors = this.getNeighbors();
        if (!this.number && !this.hasBomb) {
            for (var i=0; i<neighbors.length; i++) {
                neighbors[i].clear();
            }
        }
    };


    var Board = function(size) {
        this.size = size;
        this.rows = [];
        var row;

        for (var i=0; i<size; i++) {
            row = [];
            this.rows.push(row);
            for (var j=0; j<size; j++) {
                row.push(new Cell(this, j, i));
            }
        }
    };
    Board.prototype.init = function Board_init(element){
        this.$elt = $(element);
        var row, $rowdiv;

        for (var i=0; i<this.rows.length; i++) {
            $rowdiv = $('<div class="row"></div>');
            this.$elt.append($rowdiv);
            row = this.rows[i];
            for (var j=0; j<row.length; j++) {
                row[j].init($rowdiv);
            }
        }
    };
    Board.prototype.getCell = function(x, y) {
        return this.rows[y][x];
    };

    var exports = {};
    exports.Board = Board;
    return exports;
});