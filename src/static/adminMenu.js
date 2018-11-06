$(document).ready(function() {
  $("#resizable").resizable();
  setTimeout(function() {
      app.init()
  }, 500);
});

$(window).resize(function() {
  app.roomplanPosition()
  app.displayWidthHeight()
});

$('.navbar-toggler').click(function() {
  setTimeout(function() {
      app.roomplanPosition()
  }, 500);
});

$('.navbar').click(function() {
  app.roomplanPosition()
});

$('#table-width, #table-height').change(function() {
  app.resizeTableOnInput()
 });

 $.get("/api/restaurants", function(data){
    data = $.parseJSON(data);
    $("#myInput").autocomplete({
        source:data
  });
 });





var app = { // app is the class

  cards: ['.card-load', '.card-add-tables', '.card-add-walls', '.card-update', '.card-save', '.card-delete'],
  navOptions: ['.nav-load', '.nav-add-tables', '.nav-add-walls', '.nav-update', '.nav-save', '.nav-delete'],


  init: function() {
      app.roomplanPosition()
      $("#InteractiveSVGWrapper").css({
          'display': 'initial'
      })
      $("#InteractiveSVGWrapper").css({
          'visibility': 'visible'
      })
      for (i = 0; i < this.navOptions.length; i++) {
          $(this.navOptions[i]).on("click", {
              card: this.cards[i]
          }, this.viewBox);
      }
  },

  viewBox: function(event) {
      app.hideAllBoxes()
      $(event.data.card).css({
          'display': 'initial'
      })
  },

  hideAllBoxes: function() {
      $('.card-new').css({
          'display': 'none'
      })
      for (i = 0; i < this.cards.length; i++) {
          $(this.cards[i]).css({
              'display': 'none'
          })
      }
  },
  roomplanPosition: function() {
      var element = $('.admin-panel').height();
      $("#InteractiveSVGWrapper").css({
          'top': element + 20
      });
  },

  displayWidthHeight: function() {
      var width = $('#resizable').width();
      var height = $('#resizable').height();
      $('#table-width').val(width);
      $('#table-height').val(height);
  },

  resizeTableOnInput: function(){
    var width = $('#table-width').val();
    var height = $('#table-height').val();
    if(width > 200){
      var width = $('#table-width').val(200);
    }
    if(height > 200){
      var width = $('#table-height').val(200);
    }
    if(width < 20){
        var width = $('#table-width').val(20);
      }
    if(height < 20){
    var width = $('#table-height').val(20);
    }
    $("#resizable").css({
      'width': width,
       'height': height
        })
  },
}