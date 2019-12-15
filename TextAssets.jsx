// #target photoshop

(function(){
    'use strict';

    /**
     * text result
     */
    var result = '';
    
    /**
     * save file
     * @param {string} content
     */
    var saveFile = function(content) {

        var name = app.activeDocument.name.replace(/\.[^\.]+$/,'');
        var path = app.activeDocument.path + '/' + name + '.text-assets.txt';
        var file = File(path);
        
        file.encoding = 'UTF8';
        file.open('w')
        file.writeln(content);
        file.close();

        alert('The file ' + path + ' is created.');
    };

    /**
     * get all layers data
     * recursive
     * @param {object} parent
     */
    var getLayersData = function (parent) {

        if(!parent || parent.visible === false) return;

        // http://jongware.mit.edu/pscs5js_html/psjscs5/pc_TextItem.html
        if(parent.typename === 'ArtLayer' && parent.kind === LayerKind.TEXT && parent.visible){

			try{
				result += parent.textItem.contents + '\n';
			}
			catch(ex){}
			
			try{
				result += 'font-family: ' + parent.textItem.font + ';\n';
			}
			catch(ex){}
			
			try{
				result += 'font-size: ' + Math.round(parent.textItem.size.value) + parent.textItem.size.type + ';\n';
			}
			catch(ex){}
			
			try{
				var color = parent.textItem.color.rgb;
				result += 'color: rgba(' + Math.round(color.red) + ', ' + Math.round(color.green) + ', ' + Math.round(color.blue) + ', ' + (Math.round(parent.opacity / 100)) + ')' + ';\n';
			}
			catch(ex){}

            try{
                if(parent.textItem.fauxBold){
                    result += 'text-decoration: bold; \n';
                }
            }
            catch(ex){}

            try{
                if(parent.textItem.fauxItalic){
                    result += 'font-style: italic: \n';
                }
            }
            catch(ex){}

            try{
                if(parent.textItem.underline != UnderlineType.UNDERLINEOFF) {
                    // http://jongware.mit.edu/pscs5js_html/psjscs5/pe_UnderlineType.html
                    result += 'text-decoration: underline; \n';
                }
            }
            catch(ex){}

            try{
                if(parent.textItem.strikeThru != StrikeThruType.STRIKEOFF) {
                    // http://jongware.mit.edu/pscs5js_html/psjscs5/pe_StrikeThruType.html
                    result += 'text-decoration: line-through; \n';
                }
            }
            catch(ex){}

            try{
                if(parent.textItem.capitalization === Case.ALLCAPS){
                    result += 'text-transform: uppercase; \n';
                }
            }
            catch(ex){}

            try{
                if(parent.textItem.capitalization === Case.SMALLCAPS){
                    result += 'text-transform: lowercase; \n';
                }
            }
            catch(ex){}

            result += '\n\n';
        }

        if(parent.layers) {
            for(var i=0, count = parent.layers.length; i < count; i++){
                getLayersData(parent.layers[i]);
            }
        }
        
        /*
        // handle parent layers sets list
        if(parent.layerSets) {
            for(var ls=0, count = parent.layerSets.length; ls<count; ls++){
                getLayersData(parent.layerSets[ls]);
            }
        }*/

        /*
        // handle parent linked layers        
        if(parent.linkedLayers) {
            for(var ll=0, count = parent.linkedLayers.length; ll<count; ll++){
                getLayersData(parent.linkedLayers[ll]);
            }
        }*/
    };

    // entry point
    result = '';
    getLayersData(app.activeDocument);

    // save file
    saveFile(result);

})();

