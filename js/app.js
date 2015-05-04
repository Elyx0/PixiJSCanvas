
var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms

// align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );




var wrapper = document.getElementsByClassName('canvasWrapper')[0];

var container,renderer,bgContainer;

var cw,ch,middle,App,app;
var config = {
    mainCircleNormal: rgbToHex(255,255,255),
    mainCircleHover: rgbToHex(255,255,255)
}

// //Heating cache
//  $.getJSON("http://darwintrend.herokuapp.com/trends.json");

function App()
{
  this.clouds = [];
  this.resize();
  //renderer = new PIXI.CanvasRenderer(cw, ch,{resolution: 2});
  //renderer = PIXI.autoDetectRenderer(cw,ch,null,true,true);
  //renderer = PIXI.autoDetectRenderer(cw,ch); //

  //this.createGradient();
  particleTexture = new PIXI.Texture.fromImage('particle_sprite.png');

  //barTween = TweenLite.to($('.bottomBar')[0],25,{width:cw + 'px',onComplete:nextCloud,delay:10});
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

      // renderer = new PIXI.CanvasRenderer(cw, ch,{
      //   view: canvas,
      //   resolution: window.devicePixelRatio
      // });

    renderer = new PIXI.WebGLRenderer(cw, ch,{
        view: canvas,
        antialiasing:true,
        resolution: window.devicePixelRatio,
        transparent: true
      });
}

App.prototype.fetchDatas = function()
{
    var $datas = $('.d1');
    var that = this;
    var $div = $('<div>').addClass('sub-data');
    $datas.append($div);
    var $divLoc = $('<div>').addClass('sub-data location');
    $datas.append($divLoc);
    $div.typed({
            strings: ["Detecting location..."],
            typeSpeed: 0,
            callback: function(){ setTimeout(function(){that.getLocation()},1000) }
    });

};

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
                        strings: ["Fetching " + json.country + " trends..."],
                        typeSpeed: 0,
                        callback: function(){ setTimeout(function(){that.getTrends()},1000) }
                });

            }
    });
}

App.prototype.getTrends = function()
{
    var that = this;
    $.getJSON("http://darwintrend.herokuapp.com/trends.json",function(json){
        if (json.error) return that.showError();
        $('.typed-cursor').remove();
        mainJSON = json;
        console.log(json);
        $('.d2 .location').typed({
            strings: ["DONE <b>✓</b>"],
            typeSpeed: 0,
            callback: function(){
                setTimeout(function(){
                    that.setup(json);
                },1000);
            }
        });
    }).error(function(){
        that.showError();
    });
};

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

App.prototype.nextCloud = function(){
    var that = this;
    this.jsonIndex++;
    if (this.jsonIndex > mainJSON.length) this.jsonIndex = 0;
    var json = mainJSON[this.jsonIndex];
    var currentTag = this.clouds[this.current];
    currentTag.die().then(function(){
        that.clouds = [new MainTag(json.tag.toUpperCase(),json.apiKeywords)];
        setTimeout(function(){
            that.tweenTimer.restart();
        },4000);
    });
}

App.prototype.setup = function()
{
    this.current = 0;
    this.jsonIndex = 0;
    var that = this;

    TweenLite.to($('.loader')[0],0.5,{opacity:0,onComplete:function(){
        var json = mainJSON[that.jsonIndex];
        that.clouds.push(new MainTag(json.tag.toUpperCase(),json.apiKeywords));
        barTween = TweenLite.to($('.bottomBar')[0],10,{width:cw + 'px',onComplete:function(){
            that.nextCloud();
            that.tweenTimer = barTween;
        },delay:10});
    }});
};

app = new App();
app.fetchDatas();

//$('.loader').hide();
//app.setup();
render();

//clouds.push(new MainTag('BATMAN'));

function render() {
    requestAnimationFrame( render );

    app.clouds.forEach(function(cloud){
        cloud.peripheralArray.forEach(function(peripheral){
            peripheral.planets.forEach(function(planet){
                if (planet.mainPlanet) planet.update();
            });
        });
    });

    renderer.render(container);

    // update stats
    stats.update();
}



// App.prototype.createGradient = function(){
//     bgContainer = new PIXI.Container();
//     var canvasElem = document.createElement("canvas");
//     var ctx = canvasElem.getContext("2d");

//     // I fix the width/height, but you can also compute it from the input string
//     canvasElem.width  = cw;
//     canvasElem.height = ch;

//     // e.g. "20pt Arial"
//     ctx.font = "20px Arial";

//     // default values
//     ctx.fillStyle = "white";
//     ctx.strokeStyle = "white";
//     ctx.lineWidth = 0;

//     // pixi default, although usual default is "alphabetic"
//     ctx.textBaseline = "top";

//     // pixi default, although usual is "start"
//     ctx.textAlign = "left";

//     // draw the text
//     // the coordinates specify where to start drawing from
//     ctx.fillText("your text here",0,0);

//     // optionally, draw text outline too
//     // by default pixi doesn't do this
//     ctx.strokeText("your text here",0,0);

//     var grd=ctx.createLinearGradient(cw/2,0,cw/2,ch);
//     // grd.addColorStop(0,"rgb(32, 27, 69)");
//     // grd.addColorStop(1,"rgb(32, 29, 58)");

//     grd.addColorStop(0,"#d2d2d3");
//     grd.addColorStop(1,"#ffffff");

//     ctx.fillStyle=grd;
//     ctx.fillRect(0,0,cw,ch);

//     var texture = PIXI.Texture.fromCanvas(canvasElem);
//     gradient  = new PIXI.Sprite(texture);
//     gradient.alpha = 0.5;
//     container.addChild(bgContainer);
//     bgContainer.addChild(gradient);
// }

