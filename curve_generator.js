var Curves = (function newCurves() {
    'use strict';
    var raf_ID = 0;
    var CURVE_INTENSITY = 35;
    var SPEED_FACTOR = 0.02;
    var NUM_OF_CURVES = Math.round(Math.random() * 1 + 5);
    var NUM_MIN_MAX = Math.random() * 15 + 15;
    var DISTANCE_EXPONENT = 1.25;
    var MAX_MOUSE_MOTION = 100;
    var HEADER_HEIGHT = 90;

    var colorScheme = Math.floor(Math.random() * 10) + 1;
    var mouseX = 0; 
    var mouseY = 0;

    function newWaves(){
        NUM_OF_CURVES = Math.round(Math.random() * 1 + 5);
        NUM_MIN_MAX = Math.random() * 15 + 15;
        colorScheme += 1;
        if (colorScheme > 10){
            colorScheme = 1;
        }
        console.log("Color Scheme: " + colorScheme);
        shapes = generateShapes();
    }

    function getMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        mouseX = evt.clientX - rect.left;
        mouseY = evt.clientY - rect.top;
      }

    function Shape(points, color) {
        this.points = points;
        this.color = color;
    }
    
    Shape.prototype.render = function(ctx, width, height) {
        var self = this;
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        this.points.forEach(function(point, i) {
            var distanceToMouse = 0;
            var changeY = 0;
            point.y = point.oldY + Math.sin(point.angle) * CURVE_INTENSITY;
            if (!isNaN(mouseY) && mouseY < point.y){
                var distanceY =Math.floor(Math.abs(point.y - mouseY));
                var distanceX = Math.floor(Math.abs(point.x - mouseX));
                distanceToMouse = Math.pow(Math.pow(distanceX, 2) + Math.pow(distanceY, 2), 0.5);
                changeY = distanceY * (MAX_MOUSE_MOTION / Math.pow(distanceToMouse, DISTANCE_EXPONENT));
                point.y -= changeY;
            }

            point.angle += point.speed;
            var nextPoint = self.points[i + 1];
            if (nextPoint) {
                var ctrlPoint = {
                    x: (point.x + nextPoint.x) / 2,
                    y: (point.y + nextPoint.y) / 2
                }; 
                ctx.quadraticCurveTo(point.x, point.y, ctrlPoint.x, ctrlPoint.y);
            }
        });
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();
        
        ctx.restore();
    };
        
    var colors = {
        1: ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557', '#6c757d'],
        2: ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c', '#6c757d'],
        3: ['#e76f51', '#f4a261', '#e9c46a', '#2a9d8f', '#264653', '#6c757d'],
        4: ['#f07167', '#fed9b7', '#fdfcdc', '#00afb9', '#0081a7', '#6c757d'],
        5: ['#eaac8b', '#e56b6f', '#b56576', '#6d597a', '#355070', '#6c757d'],
        6: ['#78290f', '#ff7d00', '#ffecd1', '#15616d', '#001524', '#6c757d'],
        7: ['#4cc9f0', '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#6c757d'],
        8: ['#cfdbd5', '#e8eddf', '#f5cb5c', '#242423', '#333533', '#6c757d'],
        9: ['#a2d2ff', '#bde0fe', '#ffafcc', '#ffc8dd', '#cdb4db', '#6c757d'],
        10: ['#ff9b54', '#ff7f51', '#ce4257', '#720026', '#4f000b', '#6c757d']
    };
    
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width = window.innerWidth;
    var height = window.innerHeight - HEADER_HEIGHT;
    var shapes = generateShapes();

    function generateShapes(num, spacing) {
        var shapes = [];
        var yCenter = window.innerHeight / 2;
        for (var i = 0; i < NUM_OF_CURVES; i += 1) {
            var points = [];
            var offset = 0;
            for (var x = 0; x <= width + (width / 4); x += width / NUM_MIN_MAX) {
                var angle = Math.random() * 360;
                if (i === 0) offset = Math.random() * 200 + 200;
                if (i === 1) offset = Math.random() * 160 + 140;                
                if (i === 2) offset = Math.random() * 130 + 90;                
                if (i === 3) offset = Math.random() * 100 + 40;
                if (i === 4) offset = Math.random() * 80 - 10;                
                if (i === 5) offset = Math.random() * 60 - 60;
                if (i === 6) offset = Math.random() * 30 - 120;
                if (i === 7) offset = Math.random() * 20 - 190;
                offset -= x / 20;
                var point = { 
                    x: x, 
                    y: yCenter + offset + 10 + Math.random() * 20,
                    oldY: yCenter + offset,
                    angle: angle,
                    speed: SPEED_FACTOR
                };
                points.push(point);
            }
            var shape = new Shape(points, colors[colorScheme][i]);
            shapes.push(shape);
        }
        return shapes;
    }
    
    function init(parent) {
        canvas.width = width;
        canvas.height = height;
        parent.appendChild(canvas);
        ctx.fillStyle = '#111';

        window.onresize = function() {
            stopRender();
            resize();
            shapes = generateShapes();
            startRender();
        }; 

        document.addEventListener('keyup', event => {
            if (event.code === 'Space') {
            newWaves();
            }
        });

        document.addEventListener('click', event => {
            newWaves();
        });

        canvas.addEventListener('touchstart', function(evt) {
            newWaves();
        });

        canvas.addEventListener('touchmove', function(evt) {
            mouseX = evt.touches[0].pageX;
            mouseY = evt.touches[0].pageY;
        });

        canvas.addEventListener('mousemove', function(evt) {
            getMousePos(evt);
        }, false);

        startRender();
    }
    var checkedLastIteration = false;
    function render() { // Recrusive Animation loop 
        raf_ID = window.requestAnimationFrame(render);
        ctx.clearRect(0, 0, width, height);
        shapes.slice().reverse().forEach(function(shape) {
            shape.render(ctx, width, height);
        });
        checkedLastIteration = !checkedLastIteration;
    }
    function startRender() {
        render();
    }

    function stopRender() {
        window.cancelAnimationFrame(raf_ID);
    }
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight - HEADER_HEIGHT;
    }

    return {
        init: init,
        startRender: startRender, 
        stopRender: stopRender
    };

})();

window.onload = function() {
Curves.init(document.body);
}

function copyEmail() {  
    navigator.clipboard.writeText("trevincub03@gmail.com");
  
    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
}

function hideElement(id){
    var element = document.getElementById(id);
    element.style.display = "none";
}

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        hideElement('spacebar-message');
    }
}