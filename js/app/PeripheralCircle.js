function PeripheralCircle(options,TagInstance)
{
    this.options = options;
    this.container = new PIXI.Container();
    this.container.position.x = this.container.pivot.x = middle.x;
    this.container.position.y = this.container.pivot.y = middle.y;
    this.planets = [];

    this.tagInstance = TagInstance;
    var nbCircle = TagInstance.peripheralArray.length + 1;
    this.id = nbCircle;
    var r = ~~(TagInstance.mainCircle.getBounds().width / 2); //Mult scale ? base r
    var circle = new PIXI.Graphics();

    var distance = nbCircle == 1 ? r + 15 : ~~(r + 15  + ((nbCircle-1) * Math.min(cw,ch)/14));
    this.r = distance;
    console.log(distance);
    circle.lineStyle(1,0xFFFFFF);
    circle.boundsPadding = 0;
    circle.arc(middle.x,middle.y,distance,0,2*Math.PI);
    circle.endFill();

    var text = circle.generateTexture(window.devicePixelRatio);
    var sprite = new PIXI.Sprite(text);
    sprite.anchor.set(0.5);
    sprite.position.set(middle.x,middle.y);
    sprite.alpha = 0.1;
    sprite.tint = config.mainCircleNormal;

    this.container.addChild(sprite);
    TagInstance.addToDraw(this.container);

    this.sprite = sprite;
    var that = this;
    if (this.options.planets)
    {
        this.options.planets.forEach(function(planet){
          that.createPlanet(planet);
        });
    }
    return this;
    // Question parents !
};


PeripheralCircle.prototype.update = function()
{

};

PeripheralCircle.prototype.addToDraw = function(obj)
{
    this.container.addChild(obj);
}

PeripheralCircle.prototype.createPlanet = function(planet)
{
    var planetObj = new Planet(planet,this);
    this.planets.push(planetObj);
};