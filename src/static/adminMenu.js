$(document).ready( function() {
  $( "#resizable" ).resizable();
  setTimeout( function(){ 
    app.init()
  }  , 500 );
});

$(window).resize(function(){
  app.roomplanPosition()
  app.displayWidthHeight()
});


$('.navbar-toggler').click(function(){
  setTimeout( function(){ 
    app.roomplanPosition()
  }  , 500 );
});

$('.navbar').click(function(){
    app.roomplanPosition()
});


var app = { // app is the class
  
  cards:  ['.card-load', '.card-add-tables','.card-add-walls', '.card-update', '.card-save', '.card-delete'],
  navOptions:  ['.nav-load', '.nav-add-tables','.nav-add-walls', '.nav-update', '.nav-save', '.nav-delete'],
  
  
  init: function(){ 
    app.roomplanPosition() 
    for(i = 0; i<this.navOptions.length; i++){
      $(this.navOptions[i]).on( "click", { card: this.cards[i] }, this.viewBox );
    }
  },

  viewBox: function(event){
    app.hideAllBoxes()
    $(event.data.card).css({'display' : 'initial'})
  },
  
  hideAllBoxes: function(){
    $('.card-new').css({'display' : 'none'})
    for(i = 0; i<this.cards.length; i++){
      $(this.cards[i]).css({'display' : 'none'})

    }
  },
  roomplanPosition: function(){
    $("#InteractiveSVGWrapper").css({'display' : 'initial'})
    var element = $('.admin-panel').height();
    $("#InteractiveSVGWrapper").css({ 'top' : element+20});
  },

  displayWidthHeight: function(){
    var width = $('#resizable').width();
    var height = $('#resizable').height();
    $('#table-width').html(width);
    $('#table-height').html(height);
  },
}

