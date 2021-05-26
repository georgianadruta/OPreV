function tweakLib() {
    C2S.prototype.getContext = function (contextId) {
        if (contextId === "2d" || contextId === "2D") {
            return this;
        }
        return null;
    }

    C2S.prototype.style = function () {
        return this.__canvas.style
    }

    C2S.prototype.getAttribute = function (name) {
        return this[name];
    }

    C2S.prototype.addEventListener = function (type, listener, eventListenerOptions) {
        console.log("canvas2svg.addEventListener() not implemented.")
    }
}

function download_svg_file(elementID) {

    tweakLib();
    // canvas2svg 'mock' context
    var svgContext = C2S(600, 300);
    // new chart on 'mock' context fails:
    var mySvg = new Chart(svgContext, tempData);
    // // Failed to create chart: can't acquire context from the given item
    // svgContext.getSerializedSvg(true);


    //make a mock canvas context using canvas2svg. We use a C2S namespace for less typing:
    var ctx = new C2S(500, 500); //width, height of your desired svg file


    //ok lets serialize to SVG:
    var mySvg = ctx.getSerializedSvg(true); //true here will replace any named entities with numbered ones.
    //Standalone SVG doesn't support most named entities.
}
