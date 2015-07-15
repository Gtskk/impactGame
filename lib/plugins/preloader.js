ig.module(
    'plugins.preloader'
)
.requires(
    'impact.loader'
)
.defines(function(){

ig.ImpactSplashLoader = ig.Loader.extend({
    
    endTime: 0,
    fadeToWhiteTime: 1000,
    fadeToGameTime: 1500,
    
    end: function() {
        this.parent();
        this.endTime = Date.now();
        ig.system.setDelegate( this );
    },
    run: function() {    
        var t = Date.now() - this.endTime;
        var alpha = 1;
        if( t < this.fadeToWhiteTime ) {
            this.draw();
            alpha = t.map( 0, this.fadeToWhiteTime, 0, 1);
        }
        else if( t < this.fadeToGameTime ) {
            ig.game.run();
            alpha = t.map( this.fadeToWhiteTime, this.fadeToGameTime, 1, 0);
        }
        else {
            ig.system.setDelegate( ig.game );
            return;
        }
        ig.system.context.fillStyle = 'rgba(0,0,0,'+alpha+')';
        ig.system.context.fillRect( 0, 0, ig.system.realWidth, ig.system.realHeight );
    },
    
    
    draw: function() {
        this.parent();
        var ctx = ig.system.context;
        var w = ig.system.realWidth;
        var h = ig.system.realHeight;
        var image = new Image();
        image.src = "https://mmbiz.qlogo.cn/mmbiz/a4hb3tiaYZK8ax1qxGYXZUNfW3R1Qia2HvQibM3f1ZAZ44UFlkrfwzQZCPgwSSneHjweicSky8rK8JSgOXpoRxwshQ/0?wxfmt=jpeg";
        
        ctx.drawImage(image, w/3 + 25, h/5, 55, 55);

        // URL
        ctx.fillStyle = 'rgb(128,128,128)';
        ctx.textAlign = 'right';
        ctx.font = '10px Arial';
        ctx.fillText( 'http://gtskk.tumblr.com', w - 10, h - 10 );
        ctx.textAlign = 'left';
        
        
        ctx.save();
    }
});
});