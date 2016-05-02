/*
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

var guessing = function(inSocket, inJQInput){
    
};




$(document).ready(function() {
    var socket = io();
    drawing(socket, $('#canvas'));
    guessing(socket, $('#guess'));
});
*/


var Pictionary = angular.module("Pictionary", []);
Pictionary.factory("FactorySocket", [function(){
    return io();
}]);
Pictionary.directive("ngDrawing", ["FactorySocket", function(inSocket){
    return {
        restrict:'A',
        link: function(inScope, inElement, inAttributes){
            
            console.log("matched")
            
            var canvas, context;
            var handlerDown, handlerMove, handlerUp;
            var interactivityEnable, interactivityDisable;
            var draw;

            canvas = $(inElement[0]);
            context = canvas.get(0).getContext('2d');
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
            
            
            interactivityDisable = function(){
                $(document).unbind('mouseup', handlerUp);
                canvas.unbind('mousemove', handlerMove);
                canvas.unbind('mousedown', handlerDown);
            };
            interactivityEnable = function(){
                interactivityDisable();
                canvas.bind('mousedown', handlerDown);
            };
            
            inScope.$watch(function(inScope){
                console.log(inAttributes);
                return inScope[inAttributes.ngInteractive];
            }, function(inNew, inOld){
                if(inNew){
                    interactivityEnable();
                }else{
                    interactivityDisable();
                }
            });
        }  
    };
}]);
Pictionary.controller("ControllerPictionary", ["$scope", function(inScope){

    inScope.interactiveCanvas = true;
    
}]);