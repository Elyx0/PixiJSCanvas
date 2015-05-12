/**
 * Planet orbiting around a peripheral circle
 *
 *  It can build miniplanets (Small dots) and named planets with text depending on options
 *
 * @param Object options
 * @param PeripheralCircle peripheralCircle
 */
function Planet(options,peripheralCircle)
{
    this.miniPlanets = [];
    this.peripheralCircle = peripheralCircle;
    var container = new PIXI.Container();
    this.container = container;
    container.position.set(middle.x,middle.y);
    container.pivot.set(middle.x,middle.y);
    if (options.smallPlanets)
    {
        for(var i=0;i<options.smallPlanets;i++)
        {
            var miniPlanetSprite = this.createSprite(0.15,0.7);
            this.addToDraw(miniPlanetSprite);
            this.miniPlanets.push(miniPlanetSprite);
        }
    }
    if (options.name)
    {
        //We have a name, build sprite, arc, circle, and text
        var miniPlanetSprite = this.createSprite(0.3,1);
        var miniPlanetArc = this.createArc(miniPlanetSprite);
        var miniPlanetCircle = this.createCircle(miniPlanetSprite);
        var miniPlanetText = this.createText(options.name,miniPlanetArc);
        this.mainPlanet = {sprite:miniPlanetSprite,circle: miniPlanetCircle,arc:miniPlanetArc,text:miniPlanetText};
        //Add all to the container in the correct order
        this.container.addChild(miniPlanetSprite);
        this.container.addChild(miniPlanetCircle);
        this.container.addChild(miniPlanetArc);
        this.container.addChild(miniPlanetText);

        //Setup bindings on hover
        this.addBinds(miniPlanetArc);
        this.addBinds(miniPlanetText);

        this.addToDraw(this.container);
    }
}

/**
 * Updates planet position around the Peripheral circle x:cos(angle) y sin(angle)
 */
Planet.prototype.update = function()
{
   //Random point on circle.
   var angle = this.angle;

   var modifier = 0.06 /(this.peripheralCircle.id * 10);
   //console.log(angle,this.peripheralCircle.id,modifier);
   this.angle+= modifier;
   var point = new PIXI.Point(middle.x+this.peripheralCircle.r*Math.cos(angle),middle.y+this.peripheralCircle.r*Math.sin(angle));
   this.mainPlanet.sprite.position = point;
   this.mainPlanet.arc.position = point;
   this.mainPlanet.circle.position = point;
   this.mainPlanet.text.position.x = point.x;
   this.mainPlanet.text.position.y = point.y - this.r - this.mainPlanet.text.height/4 - 5;//

}

/**
 * Creates text above planet circle
 */
Planet.prototype.createText = function(word,circle)
{
    var px = this.peripheralCircle.tagInstance.text._style.font.split("px")[0] * 0.8;
    if (px < 25) px = 25;
    var text = new PIXI.Text(word, {font:"" + px + "px Lato", fill:"white"});
    text.resolution = window.devicePixelRatio;
    text.position.x = circle.position.x;// - text.getBounds().width/2;
    text.position.y = circle.position.y - this.r - text.height/4 - 5;// - text.getBounds().height/2;
    text.anchor.set(0.5);
    text.scale.set(0.5);
    return text;
};

/**
 * Adds to peripheral container for drawing
 * @param Object obj Pixi Drawable asset
 */
Planet.prototype.addToDraw = function(obj){
    this.peripheralCircle.container.addChild(obj);
};

/**
 * Creates circle with element as center
 * @param  Object element PIXI Asset acting as center
 */
Planet.prototype.createCircle = function(element)
{
    var center = element.position;
    var r = 4;

    var circle = new PIXI.Graphics();
    circle.beginFill(0xFFFFFF);
    circle.drawCircle(center.x, center.y, r);
    circle.endFill();

    var texture = circle.generateTexture(window.devicePixelRatio);
    var sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.position.set(center.x,center.y);
    sprite.alpha = 1;
    return sprite;
};

/**
 * Adds hover binding:
 *     On hover, lighten planet, and its peripheral circle
 * @param PixiObject element
 */
Planet.prototype.addBinds = function(element)
{
    element.buttonMode = true;
    element.interactive = true;
    var arc = this.mainPlanet.arc;
    var _prevAlpha = 0.1;
    var periphSprite = this.peripheralCircle.sprite;
    var _prevPeriphecalAlpha = 0.1;
    var dur = 1;
    element.mouseover = function()
    {
        TweenLite.to(arc,dur,{alpha:0.8});
        TweenLite.to(periphSprite,dur,{alpha:0.3});
    }
    element.mouseout = function()
    {
        console.log('mouseout');
        TweenLite.to(arc,dur,{alpha:_prevAlpha});
        TweenLite.to(periphSprite,dur,{alpha:_prevPeriphecalAlpha});
    }
}

/**
 * Creates arc with element as center
 * @param  PixiObject element
 */
Planet.prototype.createArc = function(element) {
    var center = element.position;
    var circle = new PIXI.Graphics();

    var distance = 20;
    this.r = distance;
    console.log(distance);
    circle.lineStyle(1,0xFFFFFF);
    circle.boundsPadding = 0;
    circle.arc(center.x,center.y,distance,0,2*Math.PI);
    circle.endFill();

    var texture = circle.generateTexture(window.devicePixelRatio);
    var sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.position.set(center.x,center.y);
    sprite.alpha = 0.1;
    sprite.interactive = true;
    sprite.buttonMode = true;
    return sprite;
}

/**
 * Creates random sprite on the planet peripheral circle
 * @param  Number scale
 * @param  Number alpha
 */
Planet.prototype.createSprite = function(scale,alpha)
{
    //Random point on circle.
    var angle = Math.random()*Math.PI*2;
    this.angle = angle;
    var point = new PIXI.Point(middle.x+this.peripheralCircle.r*Math.cos(angle),middle.y+this.peripheralCircle.r*Math.sin(angle));
    var sprite = new PIXI.Sprite(particleTexture);
    sprite.anchor.set(0.5);
    sprite.alpha = alpha;
    sprite.scale.set(scale);
    sprite.position = point;
    return sprite;
}

