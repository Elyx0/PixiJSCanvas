/**
 * MainTag from a cloud word.
 * @param String word  Center cloud word
 * @param Array terms Terms correlated with the word
 */
function MainTag(word,terms)
{
    this.cloudContainer = new PIXI.Container();
    this.cloudContainer.pivot.set(middle.x,middle.y);
    this.cloudContainer.position.set(middle.x,middle.y);
    container.addChild(this.cloudContainer);
    this.word = word;
    this.buildText();

    this.buildMainCircle();

    this.peripheralArray = [];
    this.buildPeripheralCircle({});
    var that = this;
    terms.forEach(function(keyword,i){
        that.buildPeripheralCircle({planets:[{name:keyword.term.toUpperCase(),smallPlanets:i>3 ? 3 : 2}]});
    });

    this.addToDraw(this.text);

    this.cloudContainer.alpha = 0;
    this.spawn();
}

/**
 * Spawn cloud animation using TweenMax.
 * Rotates each circles and zoom + opacity to 1
 */
MainTag.prototype.spawn = function(){
    this.cloudContainer.scale.set(0);
    this.cloudContainer.alpha = 1;
    var t = this.t = new TimelineMax();

    this.peripheralArray.forEach(function(peripheral,i){
        peripheral.planets.forEach(function(planet){
            planet.container.alpha = 0;
        });

        function showPlanet()
        {
            peripheral.planets.forEach(function(planet){
                TweenMax.to(planet.container,2,{alpha:1});
            });
        }

        t.insert(TweenMax.fromTo(peripheral.container.scale,1,{x:-1},{
            x:1,
            repeat:2,
            yoyo:true,
            delay:i/10+0.3,
            onComplete:showPlanet,
            ease: Back.easeOut.config(1.7)
        }));
    });
    t.insert(TweenMax.to(this.cloudContainer.scale,3,{x:1,y:1, ease: Back.easeOut.config(1.7),delay:1.2}));
};

/**
 * Kills current cloud and removes it from PIXI main container
 */
MainTag.prototype.die = function()
{
    var deferred = $.Deferred();
    var that = this;
    this.t.tweenTo(0, {onComplete:function(){
        //that.cloudContainer
        container.removeChild(that.cloudContainer);
        deferred.resolve(true);
    }});
    return deferred.promise();
};

/**
 * Builds center text with max size set up
 */
MainTag.prototype.buildText = function()
{
    var max = ~~(Math.min(cw,ch)/4);
    var current = max;
    console.log(max);
    var text;
    // Calculate max size by looping until it fits
    do { current--;  text = new PIXI.Text(this.word, {font:current + "px Lato", fill:"#2b2b36"}); }
    while (current > 0 && text.getBounds().width > max);

    // Double the text size
    var mult = current*2;
    text = new PIXI.Text(this.word, {font:"" + mult + "px Lato", fill:"#2b2b36"});
    text.resolution = window.devicePixelRatio; // Sets resolution for retina
    //Adjusts position, anchor and scale.
    text.position.x = middle.x;
    text.position.y = middle.y;
    text.anchor.set(0.5);
    text.scale.set(0.5);
    this.text = text;
};

/**
 * Creates big white circle around the text, and positions the glowing particle under
 */
MainTag.prototype.buildMainCircle = function()
{
    var particleSprite = new PIXI.Sprite(particleTexture);
    particleSprite.position.set(middle.x,middle.y);
    particleSprite.anchor.set(0.5);
    particleSprite.scale.set(4);
    particleSprite.alpha = 0.1;


    tl = new TimelineMax({yoyo:true,repeat:-1});
    tl.insert(TweenMax.to(particleSprite,10,{alpha:0.2,ease: Bounce.easeOut}));
    tl.insert(TweenMax.to(particleSprite.scale,10,{x:4.5,y:4.5,ease:Bounce.easeOut}));

    this.mainParticle = particleSprite;
    this.mainParticleTimeline = tl;

    this.addToDraw(particleSprite);

    var r = ~~(this.text.getBounds().width/2 * 1.2 * this.text.scale.x);
    var mainCircle = new PIXI.Graphics();

    mainCircle.beginFill(0xFFFFFF);
    mainCircle.drawCircle(middle.x, middle.y, r);
    mainCircle.endFill();

    mainCircle.interactive = true;
    mainCircle.buttonMode = true;
    mainCircle.tint = 0xFFFFFF;

    mainCircle.hitShape = new PIXI.Circle(middle.x,middle.y,r);
    this.mainCircle = mainCircle;

    var texture = mainCircle.generateTexture(window.devicePixelRatio);
    var sprite = new PIXI.Sprite(texture);
    spriteCircle = sprite;
    spriteCircle.anchor.set(0.5);
    spriteCircle.position.set(middle.x,middle.y);

    this.addToDraw(spriteCircle);
};

/**
 * Builds one peripheral circle for current cloud
 * @param Object options Options for the current peripheral circle (mini planets / mainPlanet)
 */
MainTag.prototype.buildPeripheralCircle = function(options)
{
    var peripheral = new PeripheralCircle(options,this);
    this.peripheralArray.push(peripheral);

};

/**
 * Adds to the main cloud rendering container
 * @param Object element Pixi Drawable element
 */
MainTag.prototype.addToDraw = function(element){
    this.cloudContainer.addChild(element);
};