define([
    'jquery'
], function ($) {

    var Cell = function() {};
    Cell.prototype.init = function(row) {
        this.$row = $(row);
        this.$row.append('<div class="cell"></div>');
    };


    var Board = function(size) {
        this.rows = [];
        var row;

        for (var i=0; i<size; i++) {
            row = [];
            this.rows.push(row);
            for (var j=0; j<size; j++) {
                row.push(new Cell(i, j));
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

    var exports = {};
    exports.Board = Board;
    return exports;
});