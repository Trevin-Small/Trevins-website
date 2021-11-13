var Curves = (function newCurves() {
    'use strict';
    var raf_ID = 0;
    var CURVE_INTENSITY = 40;
    var SPEED_FACTOR = Math.random() * 0.015 + 0.01;
    var NUM_OF_CURVES = Math.round(Math.random() * 2 + 4);
    var NUM_MIN_MAX = Math.random() * 15 + 10;
    var DISTANCE_EXPONENT = 1.15;
    var MAX_MOUSE_MOTION = 150;
    var MOUSE_COEFFICIENT = 0.825;

    var colorScheme = Math.floor(Math.random() * 10) + 1;
    var mouseX = 0; 
    var mouseY = 0;
    var siteTheme = 1;
    var siteColorThemes = {
        1: ["#4f0147", "#290025", "#11001c", "#ffffff"],
        2: ["#ece071", "#454545", "#dbdbdb", "#000000"]
    };

    function nextColorTheme(){
        siteTheme += 1;
        if (siteTheme > 2){
            siteTheme = 1;
        }
        document.getElementById('header').style.backgroundColor = siteColorThemes[siteTheme][0];
        document.getElementById('header-divider').style.backgroundColor = siteColorThemes[siteTheme][1];
        document.getElementById('background').style.backgroundColor = siteColorThemes[siteTheme][2]; 
        document.getElementById('title-text').src = (siteTheme == 1) ? 'header-text-white.svg' : 'header-text-black.svg';
        document.getElementsByName('fractal-svg')[0].src = (siteTheme == 1) ? 'fractal_white.svg' : 'fractal_black.svg';

        var iconBoxes = document.getElementsByClassName('icon-box');
        for (var i = 0; i < iconBoxes.length; i++) {
            iconBoxes[i].style.color = siteColorThemes[siteTheme][3];
            iconBoxes[i].style.fill = siteColorThemes[siteTheme][3];
        };
    }

    function newWaves(){
        NUM_OF_CURVES = Math.round(Math.random() * 1 + 5);
        NUM_MIN_MAX = Math.random() * 15 + 15;
        colorScheme += 1;
        if (colorScheme > 10){
            colorScheme = 1;
        }
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
        ctx.globalAlpha = 0.60;
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
                changeY = distanceY * (MAX_MOUSE_MOTION / Math.pow(distanceToMouse, DISTANCE_EXPONENT)) * MOUSE_COEFFICIENT;
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
    var height = window.innerHeight;
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
                    y: yCenter + offset,
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
        var mouseMoveActive = false;
        var arrowsMessageShowing = false;
        var arrowsHasShown = false;
        var delayed = false;
        var count = 0;
        resize();

        window.onresize = function() {
            stopRender();
            resize();
            rescaleIcons(height);
            rescaleFont();
            shapes = generateShapes();
            startRender();
        }; 

        canvas.addEventListener('click', function(evt) {
            newWaves();
            count++;
            if (count == 2 && !mouseMoveActive){
                count = 0;
                hideElement('click-message');
                showElement('move-mouse-message', 'flex');
                mouseMoveActive = true;
            }
        }, false);

        canvas.addEventListener('mousemove', function(evt) { 
            if (mouseMoveActive){
                getMousePos(evt);
                setTimeout(() => {delayed = true}, 1500);
                if (delayed && !arrowsHasShown){
                    hideElement('move-mouse-message');
                    showElement('arrows-message', 'flex'); 
                    arrowsMessageShowing = true;
                }
            }
        }, false);

        canvas.addEventListener('touchmove', function(evt) {
            evt.preventDefault();
            if (mouseMoveActive){
                getMousePos(evt);
                setTimeout(() => {delayed = true}, 1500);
                if (delayed && !arrowsHasShown){
                    hideElement('move-mouse-message');
                    showElement('arrows-message', 'flex'); 
                    arrowsMessageShowing = true;
                }
            }
        }, false);

        canvas.addEventListener('touchmove', function(evt) {
            if (!spaceMessageShowing){
                mouseX = evt.touches[0].pageX;
                mouseY = evt.touches[0].pageY;
            }
        }, false);

        document.addEventListener('keyup', function(evt) {
            if (delayed) {
                switch (evt.code) {
                    case 'ArrowLeft':
                    case 'ArrowRight':
                    case 'ArrowDown':
                    case 'ArrowUp':
                    case 'KeyW':
                    case 'KeyA':
                    case 'KeyS':
                    case 'KeyD':
                        if (arrowsMessageShowing) {
                            hideElement('arrows-message');
                            arrowsMessageShowing = false;
                            arrowsHasShown = true;
                        }
                        nextColorTheme();
                        break;
                    default:
                        break;
                }
            }
        });

        startRender();
    }

    function render() { // Recrusive Animation loop 
        raf_ID = window.requestAnimationFrame(render);
        ctx.clearRect(0, 0, width, height);
        shapes.slice().reverse().forEach(function(shape) {
            shape.render(ctx, width, height);
        });
    }
    
    function startRender() {
        render();
    }

    function stopRender() {
        window.cancelAnimationFrame(raf_ID);
    }
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    return {
        init: init,
        startRender: startRender, 
        stopRender: stopRender
    };

})();

window.onload = function() {
    Curves.init(document.body);
    rescaleIcons(window.innerHeight);
    rescaleFont();
}

/*
function copyEmail() {  
    showElement('email-alert-box', "block");
    navigator.clipboard.writeText("someone@gmail.com");
    setTimeout(() => {hideElement('email-alert-box')}, 1500);
}*/

function hideElement(id){
    var element = document.getElementById(id);
    element.style.display = "none";
}

function showElement(id, displayType){
    var element = document.getElementById(id);
    element.style.display = displayType;
}

function rescaleIcons(){
    var icons = document.getElementsByName('icon-svg');
    var icon_boxes = document.getElementsByClassName("icon-box");
    var heightBasedSize = Math.floor(window.innerHeight * 0.065);
    var widthBasedSize = Math.floor(((window.innerWidth * 0.45) / 3) - 20);
    var size = ((0.4 * window.innerWidth) / 3) < (window.innerHeight * 0.1) ? widthBasedSize : heightBasedSize;
    for (var i = 0; i < icons.length; i++){
        icons[i].style.fontSize = size + 'px';
        icon_boxes[i].style.padding = "5px 7px 5px 7px";
    }
    var icons = document.getElementsByName('fractal-svg');
    icons[0].style.height = size + 'px';
    icons[0].style.padding = "0px";
}

function rescaleFont() {
    var messageBoxes = document.getElementsByClassName("message-box");
    for (var i = 0; i < messageBoxes.length; i++) {
        var smallerDimension = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
        if (smallerDimension < 1100) {
            messageBoxes[i].style.fontSize = smallerDimension * 0.035;
        } else {
            messageBoxes[i].style.fontSize = smallerDimension * 0.0275;
        }
    }
}