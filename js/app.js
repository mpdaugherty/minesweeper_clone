require([
    'jquery',
    'js/minesweeper'
], function($, ms) {
    var board = new ms.Board(8, 10);
    board.init($('.board'));
});