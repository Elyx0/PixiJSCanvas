/**
 * Self explatory RGB to Hex
 */
function rgbToHex(r,g,b){return "0x" + [r,g,b].reduce(function(x,y){ return x + y.toString(16).toUpperCase() },''); }
