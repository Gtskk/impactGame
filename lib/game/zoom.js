//Copyright 2015 - Andrew Mast

ig.module(
	'game.zoom'
).requires(
    'impact.game'
).defines(function () {
    ig.Game.inject({
        draw: function() {
            if (this.screen.zoom != undefined) { // Checks if "this.screen.zoom" is defined.
                // The following code is from Dominic on ImpactJs Forums: http://impactjs.com/forums/help/zoom-out-to-see-wider-map-area/page/1
                
                ig.system.context.save();
                ig.system.context.scale(this.screen.zoom, this.screen.zoom);
                
                this.parent();
                
                ig.system.width = ig.system.realWidth / this.screen.zoom;
                ig.system.height = ig.system.realHeight / this.screen.zoom;
                
                ig.system.context.restore();
                
                // Ending code from Dominic
                
                if (this.screen.zoom > 1) { // Checks if the zoom is greater than 1.
                    // Makes the canvas not use image smoothing.
                    ig.system.context.imageSmoothingEnabled       = false;
                    ig.system.context.mozImageSmoothingEnabled    = false;
                    ig.system.context.oImageSmoothingEnabled      = false;
                    ig.system.context.msImageSmoothingEnabled     = false;
                    ig.system.context.webkitImageSmoothingEnabled = false;
                } else { // Otherwise..
                    // Makes the canvas use image smoothing.
                    ig.system.context.imageSmoothingEnabled       = true;
                    ig.system.context.mozImageSmoothingEnabled    = true;
                    ig.system.context.oImageSmoothingEnabled      = true;
                    ig.system.context.msImageSmoothingEnabled     = true;
                    ig.system.context.webkitImageSmoothingEnabled = true;
                }
            } else { // Else, runs usual draw cycle.
                this.parent();
            }
        }
    });
});
