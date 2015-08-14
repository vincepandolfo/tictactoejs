$(document).ready(function () {
  var game;
  
  $('.choice').click(function () {
    game = new TicTacToe($(this).html());
    
    for(var i = 0; i < 9; i++)
      $('#' + i).html("");  
    
    $('.choice-group').fadeOut(500, function() {
      $('.board').fadeIn(500);
    });
    
    // X always begins. If the player has chose O,
    // then the AI has to make its first move
    if(game.agent === 'X')
      $('#' + game.getAgentAction()).html(game.agent);
  });
  
  $('.btn-board').click(function () {
    var cell = Number(this.id);
    
    if(game.setPlayerAction(cell)) {
      $(this).html(game.player);
      
      if(game.isFull()) { // if the board is full, it's a tie
        $('.board').fadeOut(500, function () {
          $('.tie').fadeIn(500);
        });

        return;
      } 

      $('#' + game.getAgentAction()).html(game.agent);

      if(game.whoIsWinning() === 1) { // check if the AI won
        $('.board').fadeOut(500, function() {
            $('.lose').fadeIn(500);
        });

        return;
      }

      if(game.isFull()) { // check again for full board
        $('.board').fadeOut(500, function () {
          $('.tie').fadeIn(500);
        });

        return;
      }
    }
  });
  
  $('.replay').click(function () {
    $(this).parent().fadeOut(500, function () {
      $('.choice-group').fadeIn(500);
    });
  });
});
