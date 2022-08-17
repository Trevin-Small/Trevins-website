export const Waves = (function createWaves() {
    'use strict';
    let raf_ID = 0;
    let CURVE_INTENSITY = 40;
    let SPEED_FACTOR = Math.random() * 0.015 + 0.01;
    let NUM_OF_CURVES = Math.round(Math.random() * 2 + 3);
    let NUM_MIN_MAX = Math.random() * 15 + 10;
    let DISTANCE_EXPONENT = 1.15;
    let MAX_MOUSE_MOTION = 150;
    let MOUSE_COEFFICIENT = 0.825;

    let colorScheme = Math.floor(Math.random() * 10) + 1;
    let mouseX = 0;
    let mouseY = 0;
    let siteTheme = 1;
    let siteColorThemes = {
        1: ["#4f0147", "#290025", "#11001c", "#ffffff"],
        2: ["#ece071", "#454545", "#dbdbdb", "#000000"]
    };

    function nextColorTheme(){
        siteTheme += 1;
        if (siteTheme > 2){
            siteTheme = 1;
        }
        document.getElementById('background').style.backgroundColor = siteColorThemes[siteTheme][2];
    }

    function newWaves(){
        NUM_OF_CURVES = Math.round(Math.random() * 1 + 5);
        NUM_MIN_MAX = Math.random() * 15 + 10;
        if (width < height) {
            NUM_MIN_MAX = Math.random() * 10 + 8;
        }
        colorScheme += 1;
        if (colorScheme > 10){
            colorScheme = 1;
        }
        generateShapes();
    }

    function getMousePos(evt) {
        let rect = canvas.getBoundingClientRect();
        mouseX = evt.clientX - rect.left;
        mouseY = evt.clientY - rect.top;
      }

    function Shape(points, color) {
        this.points = points;
        this.color = color;
    }

    Shape.prototype.render = function(ctx, width, height) {
        let self = this;
        ctx.save();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.80;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        this.points.forEach(function(point, i) {
            let distanceToMouse = 0;
            let changeY = 0;
            point.y = point.oldY + Math.sin(point.angle) * CURVE_INTENSITY;
            if (!isNaN(mouseY) && mouseY < point.y){
                let distanceY = Math.floor(Math.abs(point.y - mouseY));
                let distanceX = Math.floor(Math.abs(point.x - mouseX));
                distanceToMouse = Math.pow(Math.pow(distanceX, 2) + Math.pow(distanceY, 2), 0.5);
                changeY = distanceY * (MAX_MOUSE_MOTION / Math.pow(distanceToMouse, DISTANCE_EXPONENT)) * MOUSE_COEFFICIENT;
                point.y -= changeY;
            }

            point.angle += point.speed;
            let nextPoint = self.points[i + 1];
            if (nextPoint) {
                let ctrlPoint = {
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

    let colors = {
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

    let canvas = document.createElement('canvas');
    canvas.style.width = '102vw';
    canvas.style.height = '102vh';
    canvas.style.margin = '0';
    canvas.style.padding = '0';
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.zIndex = '-100';
    let topLayer = document.getElementById('top-layer');
    let ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let shapes = [];

    function generateShapes(num, spacing) {
        shapes = [];
        let yCenter = window.innerHeight / 2;
        for (let i = 0; i < NUM_OF_CURVES; i += 1) {
            let points = [];
            let offset = 0;
            for (let x = 0; x <= width + (width / 4); x += width / NUM_MIN_MAX) {
                let angle = Math.random() * 360;
                if (i === 0) offset = Math.random() * 200 + 210;
                if (i === 1) offset = Math.random() * 160 + 180;
                if (i === 2) offset = Math.random() * 130 + 150;
                if (i === 3) offset = Math.random() * 100 + 120;
                if (i === 4) offset = Math.random() * 80 + 90;
                if (i === 5) offset = Math.random() * 60 + 60;
                offset -= x / 20;
                let point = {
                    x: x,
                    y: yCenter + offset,
                    oldY: yCenter + offset,
                    angle: angle,
                    speed: SPEED_FACTOR
                };
                points.push(point);
            }
            let shape = new Shape(points, colors[colorScheme][i]);
            shapes.push(shape);
        }

    }

    function init(parent) {
        resize();
        parent.appendChild(canvas);
        canvas.setAttribute("class", "canvas");
        ctx.fillStyle = '#111';
        let on = true;
        newWaves();

        if (width < height) {
            NUM_MIN_MAX = Math.random() * 10 + 8;
        }

        topLayer.addEventListener('click', function(evt) {
            newWaves();
        }, false);

        topLayer.addEventListener('mousemove', function(evt) {
            getMousePos(evt);
        }, false);

        document.getElementById('switch-div').addEventListener('click', function(evt){
            let switchIcon = document.getElementsByName('switch')[0];
            let switchIconFile;
            let showText;
            if (on) {
                switchIconFile = './images/switch-off.svg';
                showText = 'hidden';
                on = false;
                enableMobileCurveMove();
            } else {
                switchIconFile = './images/switch-on.svg';
                showText = 'visible';
                on = true;
                enableScroll();
            }
            switchIcon.setAttribute('src', switchIconFile);
            document.getElementById('welcome').style.visibility = showText;
        }, false);

        document.addEventListener('keyup', function(evt) {
            switch (evt.code) {
                case 'ArrowLeft':
                case 'ArrowRight':
                case 'ArrowDown':
                case 'ArrowUp':
                    nextColorTheme();
                    break;
                default:
                    break;
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

    function detectTouchMove(evt) {
        preventDefault(evt);
        mouseX = evt.touches[0].pageX;
        mouseY = evt.touches[0].pageY;
    }

    function enableMobileCurveMove() {
        topLayer.addEventListener('touchmove',detectTouchMove, false);
    }

    function enableScroll() {
        topLayer.removeEventListener('touchmove', detectTouchMove);
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    return {
        init,
        resize,
        newWaves,
        startRender,
        stopRender
    };

})();