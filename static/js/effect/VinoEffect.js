/**
 * Ribbons Class File.
 * Creates low-poly ribbons background effect inside a target container.
 */
(function (name, factory)
{
    if (typeof window === "object")
    {
        window[name] = factory();
    }

})("Ribbons", function ()
{
    var _w = window,
        _b = document.body,//返回html dom中的body节点 即<body>
        _d = document.documentElement;//返回html dom中的root 节点 即<html>

    // random helper
    var random = function ()
    {
        if (arguments.length === 1) // only 1 argument
        {
            if (Array.isArray(arguments[0])) // extract index from array
            {
                var index = Math.round(random(0, arguments[0].length - 1));
                return arguments[0][index];
            }
            return random(0, arguments[0]); // assume numeric
        } else
        if (arguments.length === 2) // two arguments range
        {
            return Math.random() * (arguments[1] - arguments[0]) + arguments[0];
        }
        return 0; // default
    };

    // screen helper
    var screenInfo = function (e)
    {
        var width = Math.max(0, _w.innerWidth || _d.clientWidth || _b.clientWidth || 0),
            height = Math.max(0, _w.innerHeight || _d.clientHeight || _b.clientHeight || 0),
            scrollx = Math.max(0, _w.pageXOffset || _d.scrollLeft || _b.scrollLeft || 0) - (_d.clientLeft || 0),
            scrolly = Math.max(0, _w.pageYOffset || _d.scrollTop || _b.scrollTop || 0) - (_d.clientTop || 0);

        return {
            width: width,
            height: height,
            ratio: width / height,
            centerx: width / 2,
            centery: height / 2,
            scrollx: scrollx,
            scrolly: scrolly };

    };

    // mouse/input helper
    var mouseInfo = function (e)
    {
        var screen = screenInfo(e),
            mousex = e ? Math.max(0, e.pageX || e.clientX || 0) : 0,
            mousey = e ? Math.max(0, e.pageY || e.clientY || 0) : 0;

        return {
            mousex: mousex,
            mousey: mousey,
            centerx: mousex - screen.width / 2,
            centery: mousey - screen.height / 2 };

    };

    // point object
    var Point = function (x, y)
    {
        this.x = 0;
        this.y = 0;
        this.set(x, y);
    };
    Point.prototype = {
        constructor: Point,

        set: function (x, y)
        {
            this.x = x || 0;
            this.y = y || 0;
        },
        copy: function (point)
        {
            this.x = point.x || 0;
            this.y = point.y || 0;
            return this;
        },
        multiply: function (x, y)
        {
            this.x *= x || 1;
            this.y *= y || 1;
            return this;
        },
        divide: function (x, y)
        {
            this.x /= x || 1;
            this.y /= y || 1;
            return this;
        },
        add: function (x, y)
        {
            this.x += x || 0;
            this.y += y || 0;
            return this;
        },
        subtract: function (x, y)
        {
            this.x -= x || 0;
            this.y -= y || 0;
            return this;
        },
        clampX: function (min, max)
        {
            this.x = Math.max(min, Math.min(this.x, max));
            return this;
        },
        clampY: function (min, max)
        {
            this.y = Math.max(min, Math.min(this.y, max));
            return this;
        },
        flipX: function ()
        {
            this.x *= -1;
            return this;
        },
        flipY: function ()
        {
            this.y *= -1;
            return this;
        } };


    // class constructor
    var Factory = function (options)
    {
        this._canvas = null;
        this._context = null;
        this._sto = null;
        this._width = 0;
        this._height = 0;
        this._scroll = 0;
        this._ribbons = [];
        this._options = {
            // ribbon color HSL saturation amount
            colorSaturation: "80%",
            // ribbon color HSL brightness amount
            colorBrightness: "60%",
            // ribbon color opacity amount
            colorAlpha: 0.83,
            // how fast to cycle through colors in the HSL color space
            colorCycleSpeed: 6,
            // where to start from on the Y axis on each side (top|min, middle|center, bottom|max, random)
            verticalPosition: "center",
            // how fast to get to the other side of the screen
            horizontalSpeed: 200,
            // how many ribbons to keep on screen at any given time
            ribbonCount: 3,
            // add stroke along with ribbon fill colors
            strokeSize: 0,
            // move ribbons vertically by a factor on page scroll
            /*parallaxAmount: -0.5,*/
            // add animation effect to each ribbon section over time
            animateSections: true };

        this._onDraw = this._onDraw.bind(this);
        this._onResize = this._onResize.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this.setOptions(options);
        this.init();
    };

    // class prototype
    Factory.prototype = {
        constructor: Factory,

        // Set and merge local options
        setOptions: function (options)
        {
            if (typeof options === "object")
            {
                for (var key in options)
                {
                    if (options.hasOwnProperty(key))
                    {
                        this._options[key] = options[key];
                    }
                }
            }
        },

        // Initialize the ribbons effect
        init: function ()
        {
            try
            {
                this._canvas = document.createElement("canvas");
                this._canvas.style["display"] = "inline-block"
                this._canvas.style["position"] = "fixed";
                /* this._canvas.style["margin"] = "0";
                 this._canvas.style["padding"] = "0";
                 this._canvas.style["border"] = "0";
                 this._canvas.style["outline"] = "0";*/
                this._canvas.style["left"] = "0";
                this._canvas.style["top"] = "0";
                this._canvas.style["width"] = "100%";
                this._canvas.style["height"] = "100%";
                this._canvas.style["z-index"] = "-1";
                this._canvas.id = "bgCanvas";
                this._onResize();

                this._context = this._canvas.getContext("2d");
                this._context.clearRect(0, 0, this._width, this._height);
                this._context.globalAlpha = this._options.colorAlpha;

                window.addEventListener("resize", this._onResize);
                window.addEventListener("scroll", this._onScroll);
                document.body.appendChild(this._canvas);
            }
            catch (e) {
                console.warn("Canvas Context Error: " + e.toString());
                return;
            }
            this._onDraw();
        },

        // Create a new random ribbon and to the list
        addRibbon: function ()
        {
            // movement data
            var dir = Math.round(random(1, 9)) > 5 ? "right" : "left",
                stop = 1000,
                hide = 200,
                min = 0 - hide,
                max = this._width + hide,
                movex = 0,
                movey = 0,
                startx = dir === "right" ? min : max,
                starty = Math.round(random(0, this._height));

            // asjust starty based on options
            if (/^(top|min)$/i.test(this._options.verticalPosition))
            {
                starty = 0 + hide;
            } else
            if (/^(middle|center)$/i.test(this._options.verticalPosition))
            {
                starty = this._height / 2;
            } else
            if (/^(bottom|max)$/i.test(this._options.verticalPosition))
            {
                starty = this._height - hide;
            }

            // ribbon sections data
            var ribbon = [],
                point1 = new Point(startx, starty),
                point2 = new Point(startx, starty),
                point3 = null,
                color = Math.round(random(0, 360)),
                delay = 0;

            // buils ribbon sections
            while (true)
            {
                if (stop <= 0) break;stop--;

                movex = Math.round((Math.random() * 1 - 0.2) * this._options.horizontalSpeed);
                movey = Math.round((Math.random() * 1 - 0.5) * (this._height * 0.25));

                point3 = new Point();
                point3.copy(point2);

                if (dir === "right")
                {
                    point3.add(movex, movey);
                    if (point2.x >= max) break;
                } else
                if (dir === "left")
                {
                    point3.subtract(movex, movey);
                    if (point2.x <= min) break;
                }
                // point3.clampY( 0, this._height );

                ribbon.push({ // single ribbon section
                    point1: new Point(point1.x, point1.y),
                    point2: new Point(point2.x, point2.y),
                    point3: point3,
                    color: color,
                    delay: delay,
                    dir: dir,
                    alpha: 0,
                    phase: 0 });


                point1.copy(point2);
                point2.copy(point3);

                delay += 4;
                color += this._options.colorCycleSpeed;
            }
            this._ribbons.push(ribbon);
        },

        // Draw single section
        _drawRibbonSection: function (section)
        {
            if (section)
            {
                if (section.phase >= 1 && section.alpha <= 0)
                {
                    return true; // done
                }
                if (section.delay <= 0)
                {
                    section.phase += 0.02;
                    section.alpha = Math.sin(section.phase) * 1;
                    section.alpha = section.alpha <= 0 ? 0 : section.alpha;
                    section.alpha = section.alpha >= 1 ? 1 : section.alpha;

                    if (this._options.animateSections)
                    {
                        var mod = Math.sin(1 + section.phase * Math.PI / 2) * 0.1;

                        if (section.dir === "right")
                        {
                            section.point1.add(mod, 0);
                            section.point2.add(mod, 0);
                            section.point3.add(mod, 0);
                        } else {
                            section.point1.subtract(mod, 0);
                            section.point2.subtract(mod, 0);
                            section.point3.subtract(mod, 0);
                        }
                        section.point1.add(0, mod);
                        section.point2.add(0, mod);
                        section.point3.add(0, mod);
                    }
                } else
                {section.delay -= 0.5;}

                var s = this._options.colorSaturation,
                    l = this._options.colorBrightness,
                    c = "hsla(" + section.color + ", " + s + ", " + l + ", " + section.alpha + " )";

                this._context.save();

                if (this._options.parallaxAmount !== 0)
                {
                    this._context.translate(0, this._scroll * this._options.parallaxAmount);
                }
                this._context.beginPath();
                this._context.moveTo(section.point1.x, section.point1.y);
                this._context.lineTo(section.point2.x, section.point2.y);
                this._context.lineTo(section.point3.x, section.point3.y);
                this._context.fillStyle = c;
                this._context.fill();

                if (this._options.strokeSize > 0)
                {
                    this._context.lineWidth = this._options.strokeSize;
                    this._context.strokeStyle = c;
                    this._context.lineCap = "round";
                    this._context.stroke();
                }
                this._context.restore();
            }
            return false; // not done yet
        },

        // Draw ribbons
        _onDraw: function ()
        {
            // cleanup on ribbons list to rtemoved finished ribbons
            for (var i = 0, t = this._ribbons.length; i < t; ++i)
            {
                if (!this._ribbons[i])
                {
                    this._ribbons.splice(i, 1);
                }
            }

            // draw new ribbons
            this._context.clearRect(0, 0, this._width, this._height);

            for (var a = 0; a < this._ribbons.length; ++a) // single ribbon
            {
                var ribbon = this._ribbons[a],
                    numSections = ribbon.length,
                    numDone = 0;

                for (var b = 0; b < numSections; ++b) // ribbon section
                {
                    if (this._drawRibbonSection(ribbon[b]))
                    {
                        numDone++; // section done
                    }
                }
                if (numDone >= numSections) // ribbon done
                {
                    this._ribbons[a] = null;
                }
            }
            // maintain optional number of ribbons on canvas
            if (this._ribbons.length < this._options.ribbonCount)
            {
                this.addRibbon();
            }
            requestAnimationFrame(this._onDraw);
        },

        // Update container size info
        _onResize: function (e)
        {
            var screen = screenInfo(e);
            this._width = screen.width;
            this._height = screen.height;

            if (this._canvas)
            {
                this._canvas.width = this._width;
                this._canvas.height = this._height;

                if (this._context)
                {
                    this._context.globalAlpha = this._options.colorAlpha;
                }
            }
        },

        // Update container size info
        _onScroll: function (e)
        {
            var screen = screenInfo(e);
            this._scroll = screen.scrolly;
        } };
    // export
    return Factory;
});
new Ribbons();
/**************** 光标渲染 *******************/

class Circle {
    constructor({ origin, speed, color, angle, context }) {
        this.origin = origin
        this.position = { ...this.origin }
        this.color = color
        this.speed = speed
        this.angle = angle
        this.context = context
        this.renderCount = 0
    }

    draw() {
        this.context.fillStyle = this.color
        this.context.beginPath()
        this.context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2)
        this.context.fill()
    }

    move() {
        this.position.x = (Math.sin(this.angle) * this.speed) + this.position.x
        this.position.y = (Math.cos(this.angle) * this.speed) + this.position.y + (this.renderCount * 0.3)
        this.renderCount++
    }
}

class Boom {
    constructor({ origin, context, circleCount = 10, area }) {
        this.origin = origin
        this.context = context
        this.circleCount = circleCount
        this.area = area
        this.stop = false
        this.circles = []
    }

    randomArray(range) {
        const length = range.length
        const randomIndex = Math.floor(length * Math.random())
        return range[randomIndex]
    }

    randomColor() {
        const range = ['8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        return '#' + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range)
    }

    randomRange(start, end) {
        return (end - start) * Math.random() + start
    }

    init() {
        for (let i = 0; i < this.circleCount; i++) {
            const circle = new Circle({
                context: this.context,
                origin: this.origin,
                color: this.randomColor(),
                angle: this.randomRange(Math.PI - 1, Math.PI + 1),
                speed: this.randomRange(1, 6)
            })
            this.circles.push(circle)
        }
    }

    move() {
        this.circles.forEach((circle, index) => {
            if (circle.position.x > this.area.width || circle.position.y > this.area.height) {
                return this.circles.splice(index, 1)
            }
            circle.move()
        })
        if (this.circles.length == 0) {
            this.stop = true
        }
    }

    draw() {
        this.circles.forEach(circle => circle.draw())
    }
}

class CursorSpecialEffects {
    constructor() {
        this.computerCanvas = document.createElement('canvas')
        this.renderCanvas = document.createElement('canvas')

        this.computerContext = this.computerCanvas.getContext('2d')
        this.renderContext = this.renderCanvas.getContext('2d')

        this.globalWidth = window.innerWidth
        this.globalHeight = window.innerHeight

        this.booms = []
        this.running = false
    }

    handleMouseDown(e) {
        const boom = new Boom({
            origin: { x: e.clientX, y: e.clientY },
            context: this.computerContext,
            area: {
                width: this.globalWidth,
                height: this.globalHeight
            }
        })
        boom.init()
        this.booms.push(boom)
        this.running || this.run()
    }

    handlePageHide() {
        this.booms = []
        this.running = false
    }

    init() {
        const style = this.renderCanvas.style
        style.position = 'fixed'
        style.top = style.left = 0
        style.zIndex = '999999999999999999999999999999999999999999'
        style.pointerEvents = 'none'

        style.width = this.renderCanvas.width = this.computerCanvas.width = this.globalWidth
        style.height = this.renderCanvas.height = this.computerCanvas.height = this.globalHeight

        document.body.append(this.renderCanvas)

        window.addEventListener('mousedown', this.handleMouseDown.bind(this))
        window.addEventListener('pagehide', this.handlePageHide.bind(this))
    }

    run() {
        this.running = true
        if (this.booms.length == 0) {
            return this.running = false
        }

        requestAnimationFrame(this.run.bind(this))

        this.computerContext.clearRect(0, 0, this.globalWidth, this.globalHeight)
        this.renderContext.clearRect(0, 0, this.globalWidth, this.globalHeight)

        this.booms.forEach((boom, index) => {
            if (boom.stop) {
                return this.booms.splice(index, 1)
            }
            boom.move()
            boom.draw()
        })
        this.renderContext.drawImage(this.computerCanvas, 0, 0, this.globalWidth, this.globalHeight)
    }
}

const cursorSpecialEffects = new CursorSpecialEffects()
cursorSpecialEffects.init()

var RENDERER = {
    POINT_INTERVAL : 5,
    FISH_COUNT : 3,
    MAX_INTERVAL_COUNT : 50,
    INIT_HEIGHT_RATE : 0.5,
    THRESHOLD : 50,

    init : function(){
        this.setParameters();
        this.reconstructMethods();
        this.setup();
        this.bindEvent();
        this.render();
    },
    setParameters : function(){
        this.$window = $(window);
        this.$container = $('#jsi-flying-fish-container');
        this.$canvas = $('<canvas />');
        this.context = this.$canvas.appendTo(this.$container).get(0).getContext('2d');
        this.points = [];
        this.fishes = [];
        this.watchIds = [];
    },
    createSurfacePoints : function(){
        var count = Math.round(this.width / this.POINT_INTERVAL);
        this.pointInterval = this.width / (count - 1);
        this.points.push(new SURFACE_POINT(this, 0));

        for(var i = 1; i < count; i++){
            var point = new SURFACE_POINT(this, i * this.pointInterval),
                previous = this.points[i - 1];

            point.setPreviousPoint(previous);
            previous.setNextPoint(point);
            this.points.push(point);
        }
    },
    reconstructMethods : function(){
        this.watchWindowSize = this.watchWindowSize.bind(this);
        this.jdugeToStopResize = this.jdugeToStopResize.bind(this);
        this.startEpicenter = this.startEpicenter.bind(this);
        this.moveEpicenter = this.moveEpicenter.bind(this);
        this.reverseVertical = this.reverseVertical.bind(this);
        this.render = this.render.bind(this);
    },
    setup : function(){
        this.points.length = 0;
        this.fishes.length = 0;
        this.watchIds.length = 0;
        this.intervalCount = this.MAX_INTERVAL_COUNT;
        this.width = this.$container.width();
        this.height = this.$container.height();
        this.fishCount = this.FISH_COUNT * this.width / 500 * this.height / 500;
        this.$canvas.attr({width : this.width, height : this.height});
        this.reverse = false;

        this.fishes.push(new FISH(this));
        this.createSurfacePoints();
    },
    watchWindowSize : function(){
        this.clearTimer();
        this.tmpWidth = this.$window.width();
        this.tmpHeight = this.$window.height();
        this.watchIds.push(setTimeout(this.jdugeToStopResize, this.WATCH_INTERVAL));
    },
    clearTimer : function(){
        while(this.watchIds.length > 0){
            clearTimeout(this.watchIds.pop());
        }
    },
    jdugeToStopResize : function(){
        var width = this.$window.width(),
            height = this.$window.height(),
            stopped = (width == this.tmpWidth && height == this.tmpHeight);

        this.tmpWidth = width;
        this.tmpHeight = height;

        if(stopped){
            this.setup();
        }
    },
    bindEvent : function(){
        this.$window.on('resize', this.watchWindowSize);
        this.$container.on('mouseenter', this.startEpicenter);
        this.$container.on('mousemove', this.moveEpicenter);
        this.$container.on('click', this.reverseVertical);
    },
    getAxis : function(event){
        var offset = this.$container.offset();

        return {
            x : event.clientX - offset.left + this.$window.scrollLeft(),
            y : event.clientY - offset.top + this.$window.scrollTop()
        };
    },
    startEpicenter : function(event){
        this.axis = this.getAxis(event);
    },
    moveEpicenter : function(event){
        var axis = this.getAxis(event);

        if(!this.axis){
            this.axis = axis;
        }
        this.generateEpicenter(axis.x, axis.y, axis.y - this.axis.y);
        this.axis = axis;
    },
    generateEpicenter : function(x, y, velocity){
        if(y < this.height / 2 - this.THRESHOLD || y > this.height / 2 + this.THRESHOLD){
            return;
        }
        var index = Math.round(x / this.pointInterval);

        if(index < 0 || index >= this.points.length){
            return;
        }
        this.points[index].interfere(y, velocity);
    },
    reverseVertical : function(){
        this.reverse = !this.reverse;

        for(var i = 0, count = this.fishes.length; i < count; i++){
            this.fishes[i].reverseVertical();
        }
    },
    controlStatus : function(){
        for(var i = 0, count = this.points.length; i < count; i++){
            this.points[i].updateSelf();
        }
        for(var i = 0, count = this.points.length; i < count; i++){
            this.points[i].updateNeighbors();
        }
        if(this.fishes.length < this.fishCount){
            if(--this.intervalCount == 0){
                this.intervalCount = this.MAX_INTERVAL_COUNT;
                this.fishes.push(new FISH(this));
            }
        }
    },
    render : function(){
        requestAnimationFrame(this.render);
        this.controlStatus();
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillStyle = 'rgba(135,206,250,0.76)';

        for(var i = 0, count = this.fishes.length; i < count; i++){
            this.fishes[i].render(this.context);
        }
        this.context.save();
        this.context.globalCompositeOperation = 'xor';
        this.context.beginPath();
        this.context.moveTo(0, this.reverse ? 0 : this.height);

        for(var i = 0, count = this.points.length; i < count; i++){
            this.points[i].render(this.context);
        }
        this.context.lineTo(this.width, this.reverse ? 0 : this.height);
        this.context.closePath();
        this.context.fill();
        this.context.restore();
    }
};
var SURFACE_POINT = function(renderer, x){
    this.renderer = renderer;
    this.x = x;
    this.init();
};
SURFACE_POINT.prototype = {
    SPRING_CONSTANT : 0.03,
    SPRING_FRICTION : 0.9,
    WAVE_SPREAD : 0.3,
    ACCELARATION_RATE : 0.01,

    init : function(){
        this.initHeight = this.renderer.height * this.renderer.INIT_HEIGHT_RATE;
        this.height = this.initHeight;
        this.fy = 0;
        this.force = {previous : 0, next : 0};
    },
    setPreviousPoint : function(previous){
        this.previous = previous;
    },
    setNextPoint : function(next){
        this.next = next;
    },
    interfere : function(y, velocity){
        this.fy = this.renderer.height * this.ACCELARATION_RATE * ((this.renderer.height - this.height - y) >= 0 ? -1 : 1) * Math.abs(velocity);
    },
    updateSelf : function(){
        this.fy += this.SPRING_CONSTANT * (this.initHeight - this.height);
        this.fy *= this.SPRING_FRICTION;
        this.height += this.fy;
    },
    updateNeighbors : function(){
        if(this.previous){
            this.force.previous = this.WAVE_SPREAD * (this.height - this.previous.height);
        }
        if(this.next){
            this.force.next = this.WAVE_SPREAD * (this.height - this.next.height);
        }
    },
    render : function(context){
        if(this.previous){
            this.previous.height += this.force.previous;
            this.previous.fy += this.force.previous;
        }
        if(this.next){
            this.next.height += this.force.next;
            this.next.fy += this.force.next;
        }
        context.lineTo(this.x, this.renderer.height - this.height);
    }
};
var FISH = function(renderer){
    this.renderer = renderer;
    this.init();
};
FISH.prototype = {
    GRAVITY : 0.4,

    init : function(){
        this.direction = Math.random() < 0.5;
        this.x = this.direction ? (this.renderer.width + this.renderer.THRESHOLD) : -this.renderer.THRESHOLD;
        this.previousY = this.y;
        this.vx = this.getRandomValue(4, 10) * (this.direction ? -1 : 1);

        if(this.renderer.reverse){
            this.y = this.getRandomValue(this.renderer.height * 1 / 10, this.renderer.height * 4 / 10);
            this.vy = this.getRandomValue(2, 5);
            this.ay = this.getRandomValue(0.05, 0.2);
        }else{
            this.y = this.getRandomValue(this.renderer.height * 6 / 10, this.renderer.height * 9 / 10);
            this.vy = this.getRandomValue(-5, -2);
            this.ay = this.getRandomValue(-0.2, -0.05);
        }
        this.isOut = false;
        this.theta = 0;
        this.phi = 0;
    },
    getRandomValue : function(min, max){
        return min + (max - min) * Math.random();
    },
    reverseVertical : function(){
        this.isOut = !this.isOut;
        this.ay *= -1;
    },
    controlStatus : function(context){
        this.previousY = this.y;
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.ay;

        if(this.renderer.reverse){
            if(this.y > this.renderer.height * this.renderer.INIT_HEIGHT_RATE){
                this.vy -= this.GRAVITY;
                this.isOut = true;
            }else{
                if(this.isOut){
                    this.ay = this.getRandomValue(0.05, 0.2);
                }
                this.isOut = false;
            }
        }else{
            if(this.y < this.renderer.height * this.renderer.INIT_HEIGHT_RATE){
                this.vy += this.GRAVITY;
                this.isOut = true;
            }else{
                if(this.isOut){
                    this.ay = this.getRandomValue(-0.2, -0.05);
                }
                this.isOut = false;
            }
        }
        if(!this.isOut){
            this.theta += Math.PI / 20;
            this.theta %= Math.PI * 2;
            this.phi += Math.PI / 30;
            this.phi %= Math.PI * 2;
        }
        this.renderer.generateEpicenter(this.x + (this.direction ? -1 : 1) * this.renderer.THRESHOLD, this.y, this.y - this.previousY);

        if(this.vx > 0 && this.x > this.renderer.width + this.renderer.THRESHOLD || this.vx < 0 && this.x < -this.renderer.THRESHOLD){
            this.init();
        }
    },
    render : function(context){
        context.save();
        context.translate(this.x, this.y);
        context.rotate(Math.PI + Math.atan2(this.vy, this.vx));
        context.scale(1, this.direction ? 1 : -1);
        context.beginPath();
        context.moveTo(-30, 0);
        context.bezierCurveTo(-20, 15, 15, 10, 40, 0);
        context.bezierCurveTo(15, -10, -20, -15, -30, 0);
        context.fill();

        context.save();
        context.translate(40, 0);
        context.scale(0.9 + 0.2 * Math.sin(this.theta), 1);
        context.beginPath();
        context.moveTo(0, 0);
        context.quadraticCurveTo(5, 10, 20, 8);
        context.quadraticCurveTo(12, 5, 10, 0);
        context.quadraticCurveTo(12, -5, 20, -8);
        context.quadraticCurveTo(5, -10, 0, 0);
        context.fill();
        context.restore();

        context.save();
        context.translate(-3, 0);
        context.rotate((Math.PI / 3 + Math.PI / 10 * Math.sin(this.phi)) * (this.renderer.reverse ? -1 : 1));

        context.beginPath();

        if(this.renderer.reverse){
            context.moveTo(5, 0);
            context.bezierCurveTo(10, 10, 10, 30, 0, 40);
            context.bezierCurveTo(-12, 25, -8, 10, 0, 0);
        }else{
            context.moveTo(-5, 0);
            context.bezierCurveTo(-10, -10, -10, -30, 0, -40);
            context.bezierCurveTo(12, -25, 8, -10, 0, 0);
        }
        context.closePath();
        context.fill();
        context.restore();
        context.restore();
        this.controlStatus(context);
    }
};
$(function(){
    RENDERER.init();
});