define([
    'jquery'
], function ($) {

    var Cell = function(board, x, y) {
        this.board = board;
        this.x = x;
        this.y = y;
    };
    Cell.prototype.init = function(row) {
        this.$elt = $('<div class="cell">' +
        '<div class="flag">' +
          '<div class="top">' +
          '</div>' +
          '<div class="pole"></div>' +
        '</div></div>');

        this.$row = $(row);
        this.$row.append(this.$elt);

        this.$elt.mouseup(
            function (event) {
                if (event.which == 1) {
                    this.clear();
                }
                if (event.which > 1) {
                    this.toggleFlag();
                }

                event.preventDefault();
            }.bind(this));
        // We have to disable the context menu so right clicks work
        this.$elt.bind('contextmenu', function (e) { e.preventDefault(); return false; });
    };
    Cell.prototype.addBomb = function() {
        var changed = !this.hasBomb;
        this.hasBomb = true;

        return changed;
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
    Cell.prototype.getNumber = function () {
        var count = 0;
        var neighbors = this.getNeighbors();
        for (var i=0; i < neighbors.length; i++) {
            count += neighbors[i].hasBomb ? 1 : 0;
        }
        return count;
    };
    Cell.prototype.clear = function () {
        if (this.$elt.hasClass('revealed') || this.flagged) {
            // This cell has already been opened once or is flagged,
            // so skip it.
            return;
        }

        this.$elt.addClass('revealed');

        var number = this.getNumber();
        var neighbors = this.getNeighbors();
        if (!number && !this.hasBomb) {
            for (var i=0; i<neighbors.length; i++) {
                neighbors[i].clear();
            }
        } else if (this.hasBomb) {
            this.$elt.addClass('exploded');
            this.board.lose();
            return;
        } else if (number) {
            var $numElt = $('<div class="number">'+number+'</div>');
            this.$elt.append($numElt);
        }

//        this.board.checkWin();
    };
    Cell.prototype.toggleFlag = function () {
        this.flagged = !this.flagged;
        this.$elt.find('.flag').toggle();
    };


    var Board = function(size, numBombs) {
        this.size = size;
        // Just in case the numBombs is impossible to fulfill
        this.numBombs = Math.min(numBombs, size*size);
        this.rows = [];
        var row;

        for (var i=0; i<size; i++) {
            row = [];
            this.rows.push(row);
            for (var j=0; j<size; j++) {
                row.push(new Cell(this, j, i));
            }
        }

        var changed = false;
        for (i=0; i<numBombs; i++) {
            changed = false;
            while (!changed) {
                var randX = Math.floor(Math.random() * this.size);
                var randY = Math.floor(Math.random() * this.size);
                changed = this.getCell(randX, randY).addBomb();
            }
        }
    };
    Board.prototype.init = function Board_init(element){
        this.$elt = $(element);
        var row, $rowdiv;

        var i, j;
        for (i=0; i<this.rows.length; i++) {
            $rowdiv = $('<div class="row"></div>');
            this.$elt.append($rowdiv);
            row = this.rows[i];
            for (j=0; j<row.length; j++) {
                row[j].init($rowdiv);
            }
        }
    };
    Board.prototype.getCell = function(x, y) {
        return this.rows[y][x];
    };
    Board.prototype.lose = function () {
        if (this.lost) {
            return;
        }
        this.lost = true;

        $.each(this.rows, function () {
            $.each(this, function() {
                this.clear();
            });
        });

        alert('you lose!');
    };
    Board.checkWin = function () {
        if (this.lost) {
            return;
        }

        var numUncleared = 0;
        for (var x = 0; x < this.size(); x++) {
            for (var y = 0; y < this.size(); y++) {
                numUncleared += this.getCell(x, y).isCleared ? 0 : 1;
                if (numUncleared > this.numBombs) {
                    alert(numUncleared);
                    return false;
                }
            }
        }

        alert('you win!');
        return true;
    };

    var exports = {};
    exports.Board = Board;
    return exports;
});