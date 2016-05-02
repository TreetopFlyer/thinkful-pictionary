var drawing = function(inSocket, inJQCanvas) {
    
    var canvas, context;
    var handlerDown, handlerMove, handlerUp;
    var draw;
    
    canvas = inJQCanvas;
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
        context.fill();
    };
    inSocket.on('draw', draw);
    
    handlerDown = function(inEvent){
        canvas.unbind('mousedown', handlerDown);
        $(document).bind('mouseup', handlerUp);
        canvas.bind('mousemove', handlerMove);
    };
    handlerMove = function(inEvent){
        var offset = canvas.offset();
        var pos = {x:inEvent.pageX - offset.left, y:inEvent.pageY - offset.top};

        draw(pos);
        inSocket.emit('draw', pos);
    };
    handlerUp = function(inEvent){
        $(document).unbind('mouseup', handlerUp);
        canvas.unbind('mousemove', handlerMove);
        canvas.bind('mousedown', handlerDown);
    };
    handlerUp(null);
};

var guessing = function(inSocket, inJQGuess){
    
    var JQForm = inJQGuess.find("form");
    var JQInput = inJQGuess.find("input");
    var JQUL = inJQGuess.find("ul");
    
    function showGuess(inGuess){
        JQUL.append($("<li>"+inGuess+"</li>"));
    }
    
    JQForm.on('submit', function(inEvent){
        inEvent.preventDefault();
        var guess = JQInput.val();
        inSocket.emit('guess', guess);
        showGuess(guess);
    });
    
    inSocket.on('guess', showGuess);
    
};




$(document).ready(function() {
    var socket = io();
    drawing(socket, $('#canvas'));
    guessing(socket, $('#guess'));
});
