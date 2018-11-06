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

$.get("/api/restaurants", function(data) {
    data = $.parseJSON(data);
    $("#myInput").autocomplete({
        source: data
    });
});

$("#myCanvas").click(function(event) {
    xCoord = event.pageX - $('#myCanvas').offset().left;
    yCoord = event.pageY - $('#myCanvas').offset().top;
    status = app.validateClick(xCoord,yCoord)
    if(status == "false"){
        return 
    } else{
        x = status.split(",")[0];
        y = status.split(",")[1];
        console.log(status);
        console.log("x: " + x + " y: " + y + " xcoord: " + xCoord + " ycoord: " + yCoord);
        app.addCircle(x, y)
        console.log(app.circles);
        console.log(app.lines);
    }
});

$("#myCanvas").mousemove(function(e) {
    app.calculateTempLine(e)
    app.drawCanvas()
});



var app = { // app is the class

    cards: ['.card-load', '.card-add-tables', '.card-add-walls', '.card-update', '.card-save', '.card-delete'],
    navOptions: ['.nav-load', '.nav-add-tables', '.nav-add-walls', '.nav-update', '.nav-save', '.nav-delete'],
    firstClick: 1,
    circles: [],
    lines: [],

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

    resizeTableOnInput: function() {
        var width = $('#table-width').val();
        var height = $('#table-height').val();
        if (width > 200) {
            var width = $('#table-width').val(200);
        }
        if (height > 200) {
            var width = $('#table-height').val(200);
        }
        if (width < 20) {
            var width = $('#table-width').val(20);
        }
        if (height < 20) {
            var width = $('#table-height').val(20);
        }
        $("#resizable").css({
            'width': width,
            'height': height
        })
    },

    addCircle: function(xCoord, yCoord) {
        var xc = parseInt(xCoord);
        var yc = parseInt(yCoord);
        this.circles.push({
            x: xc,
            y: yc
        });
    },

    addLine: function(lastx, lasty, newx, newy) {
        this.lines.push({
            lastx: lastx,
            lasty: lasty,
            newx: newx,
            newy: newy
        });
    },

    calculateTempLine: function(event) {
        xCoord = event.pageX - $('#myCanvas').offset().left;
        yCoord = event.pageY - $('#myCanvas').offset().top;
        this.removeTempLine()
        for (var key in this.circles) {
            x = this.circles[key]['x'];
            y = this.circles[key]['y'];
            if (xCoord > x - 6 && xCoord < x + 6) {
                this.addTempLine(x, y, x, yCoord)
            } else if (yCoord > y - 6 && yCoord < y + 6) {
                this.addTempLine(x, y, xCoord, y)
            }
        }
    },

    addTempLine: function(lastx, lasty, newx, newy) {
        let canvas = document.querySelector("canvas");
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(lastx, lasty);
        ctx.lineTo(newx, newy);
        ctx.stroke();
    },

    removeTempLine: function() {
        let canvas = document.querySelector("canvas");
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },

    drawCanvas: function() {
        for (var key in this.circles) {
            x = this.circles[key]['x'];
            y = this.circles[key]['y'];
            app.drawCircles(x, y)
        }
        for (var key in this.lines) {
            xlast = this.lines[key]['lastx'];
            ylast = this.lines[key]['lasty'];
            xnew = this.lines[key]['newx'];
            ynew = this.lines[key]['newy'];
            app.drawLines(xlast,ylast,xnew,ynew)
        }
    },

    drawCircles: function(x, y) {
        let canvas = document.querySelector("canvas");
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    },

    drawLines: function(xlast,ylast,xnew,ynew) {
        let canvas = document.querySelector("canvas");
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(xlast, ylast);
        ctx.lineTo(xnew, ynew);
        ctx.stroke();
    },

    validateClick: function(xCurrent, yCurrent) {
        if(app.firstClick > 0){
            app.addCircle(xCurrent,yCurrent)
            app.firstClick = 0;
            return ["false"]
        }
        console.log(this.circles);
        for (var key in this.circles) {
            x = this.circles[key]['x'];
            y = this.circles[key]['y'];
            console.log(x + " " + y);
            if (xCurrent > x - 6 && xCurrent < x + 6) {
                this.addLine(x,y,x,yCurrent)
                return [x,yCurrent]
            } 
            else if (yCurrent > y - 6 && yCurrent < y + 6) {
                this.addLine(x,y,xCurrent,y)
                return [xCurrent,y]
            } 
         }
            return ["false"]
    },



}