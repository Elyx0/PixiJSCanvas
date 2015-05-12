//Stats block FPS counter - Hidden in css.
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms
// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );



// Global vars
var wrapper = document.getElementsByClassName('canvasWrapper')[0];

var container,renderer,bgContainer, particleTexture,cw,ch,middle,App,app;

// Config colors
var config = {
    mainCircleNormal: rgbToHex(255,255,255),
    mainCircleHover: rgbToHex(255,255,255)
}

function App()
{
  this.clouds = [];
  this.resize();

  // Particle texture for planets
  particleTexture = new PIXI.Texture.fromImage('particle_sprite.png');
}

App.prototype.resize = function()
{
  if (wrapper.children.length) wrapper.children[0].remove();
  cw  = document.body.clientWidth;
  ch  = document.body.clientHeight;
  middle = {x: cw/2,y:ch/2};
  container = new PIXI.Container();
  container.pivot.set(middle.x,middle.y);
  container.position.set(middle.x,middle.y);

  var canvas =  window.document.createElement("canvas");
  canvas.style.width = cw;
  canvas.style.height = ch;
  wrapper.appendChild(canvas);

  // Init pixi renderer, with double resolution for retinas.
  renderer = new PIXI.WebGLRenderer(cw, ch,{
    view: canvas,
    antialiasing:true,
    resolution: window.devicePixelRatio,
    transparent: true
});
}

// Initialize loader
App.prototype.fetchDatas = function()
{
    TweenLite.to($('.loader')[0],0.5,{opacity:1});
    $('.datas').empty();
    var $datas = $('.d1');
    var that = this;
    var $div = $('<div>').addClass('sub-data');
    $datas.append($div);
    var $divLoc = $('<div>').addClass('sub-data location');
    $datas.append($divLoc);
    $div.typed({
        strings: ["Streaming trends from..."],
        typeSpeed: 0,
        callback: function(){ setTimeout(function(){that.getLocation()},1000) }
    });

};

// Fetches geolocation from telize
App.prototype.getLocation = function(){
    var that = this;
    $('.typed-cursor').remove();
    $.getJSON("http://www.telize.com/geoip?callback=?",
              function(json) {
                console.log(json);
                that.setLocation(json);
            }
            ).error(function(){
                that.setLocation({country:'Default',country_code:'US'});
            });
        };

// Outputs location text using typed.js
App.prototype.setLocation = function(json)
{
    var that = this;
    $('.location').typed({
        strings: [json.country + " <b>✓</b>"],
        typeSpeed: 0,
        callback: function(){
            $('.typed-cursor').remove();
            var $datas = $('.d2');
            var $div = $('<div>').addClass('sub-data');
            $datas.append($div);
            var $divLoc = $('<div>').addClass('sub-data location');
            $datas.append($divLoc);
            $div.typed({
                strings: ["Analyzing human expressions..."],
                typeSpeed: 0,
                callback: function(){ setTimeout(function(){that.getTrends(json)},1000) }
            });

        }
    });
}

// Fetches mainJSON then Outputs text info using typed.js
App.prototype.getTrends = function(json)
{
    var that = this;
    $.getJSON("http://darwintrend.herokuapp.com/trends/"+json.country_code,function(json){
        if (json.error) return that.showError();
        $('.typed-cursor').remove();
        mainJSON = json;
        console.log(json);
        $('.d2 .location').typed({
            strings: ["DONE <b>✓</b>"],
            typeSpeed: 0,
            callback: function(){
                setTimeout(function(){
                    that.correlatePattern();
                },1500);
            }
        });
    }).error(function(){
        that.showError();
    });
};

// Outputs text info using typed.js
App.prototype.correlatePattern = function()
{
    var that = this;
    $('.typed-cursor').remove();
    var $datas = $('.d3');
    var $div = $('<div>').addClass('sub-data');
    $datas.append($div);
    var $divLoc = $('<div>').addClass('sub-data location');
    $datas.append($divLoc);
    $div.typed({
        strings: ["Correlating the patterns... ^2000 DONE <b>✓</b>"],
        typeSpeed: 0,
        callback: function(){ setTimeout(function(){
            $('.typed-cursor').remove();
            var $datas = $('.d4');
            var $div = $('<div>').addClass('sub-data');
            $datas.append($div);
            var $divLoc = $('<div>').addClass('sub-data location');
            $datas.append($divLoc);
            $div.typed({
                strings: ["Delivering awareness... ^3000"],
                typeSpeed: 0,
                callback: function(){
                    setTimeout(function(){
                        that.setup();
                    },1000);
                }
            });
        },500) }
    });
};

/**
 * Displays error from geoloc / trends fetching
 */
 App.prototype.showError = function()
 {
    $('.datas').empty();
    $('.d1').typed({
        strings: ["ERROR FETCHING TRENDS <i> ✖ </i>"],
        typeSpeed: 0,
        callback: function(){
            $('.typed-cursor').remove();
        }
    });
    $('.d2').typed({
        strings: ["PLEASE RETRY LATER"],
        typeSpeed: 0,
        callback: function(){
            $('.typed-cursor').remove();
        }
    });
};

/**
 * Calls die on current cloud tag, (MainTag.prototype.die) and inits the next one.
 */
 App.prototype.nextCloud = function(){
    var that = this;
    this.jsonIndex++;
    if (this.jsonIndex >= mainJSON.length) {
        this.jsonIndex = 0;
        $('.slide').removeClass('active');
        var currentTag = this.clouds[this.current];
        currentTag.die().then(function(){
                 //Reload app to fetch potentially new data
                 document.location.reload();
             });
        return;

    }
    $('.slide').removeClass('active');
    $('.slide').eq(this.jsonIndex).addClass('active');
    var json = mainJSON[this.jsonIndex];
    var currentTag = this.clouds[this.current];
    currentTag.die().then(function(){
        that.clouds = [new MainTag(json.tag.toUpperCase(),json.apiKeywords)];
        setTimeout(function(){
            //that.tweenTimer.restart();
            that.nextCloud();
        },10000);
    });
}


/**
 * Setup slides at bottom, then launch first word cloud
 */
 App.prototype.setup = function()
 {
    this.current = 0;
    this.jsonIndex = 0;
    var that = this;
    var $bw = $('.bottomWrapper');
    for (var i = 0;i < mainJSON.length;i++)
    {
        var $slide = $('.slide').first().clone();
        $bw.append($slide);
    }
    $('.slide').first().addClass('active');
    this.loader = TweenLite.to($('.loader')[0],0.5,{opacity:0,onComplete:function(){
        var json = mainJSON[that.jsonIndex];
        $bw.removeClass('hidden');
        that.clouds.push(new MainTag(json.tag.toUpperCase(),json.apiKeywords));
        setTimeout(function(){
            that.nextCloud();
        },10000);
    }});
};


//Setting up new app
app = new App();

//Fetching datas
app.fetchDatas();

//Render loop
render();

function render() {
    requestAnimationFrame(render);
    //Update each planet position around its circle axis
    app.clouds.forEach(function(cloud){
        cloud.peripheralArray.forEach(function(peripheral){
            peripheral.planets.forEach(function(planet){
                if (planet.mainPlanet) planet.update();
            });
        });
    });

    //Render pixi container
    renderer.render(container);

    // update stats
    stats.update();
}


//Reload app on resize
$(window).on('resize',function(){
    document.location.reload();
});


