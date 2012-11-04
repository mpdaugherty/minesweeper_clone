require([
    'jquery',
    'js/minesweeper'
], function($, ms) {
    x = new ms.Board(8, 10);
    x.init($('.board'));
});