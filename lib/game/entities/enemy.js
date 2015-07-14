ig.module('game.entities.enemy').requires(
	'impact.entity',
	'game.words',
	'game.entities.particle'
).defines(function()
{
	EntityEnemy=ig.Entity.extend(
	{
		word:'none',
		remainingWord:'none',
		health:8,
		currentLetter:0,
		targeted: false,
		speed: 10,
		friction: {x:100,y:100},
		hitTimer: null,
		dead: false,
		angle: 0,
		soundHit: new ig.Sound('media/sounds/hit.ogg'),
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		init:function(x,y,settings)
		{
			this.parent(x,y,settings);
			this.word=this.getWordWithLength(this.health);
			this.remainingWord=this.word;
			this.hitTimer=new ig.Timer(0);
			this.dieTimer=new ig.Timer(0);
			ig.game.registerTarget(this.word.charAt(0),this);
			this.angle=this.angleTo(ig.game.player);
		},
		getWordWithLength:function(l)
		{
			var w='wtf';
			for(var i=0;i<20;i++)
			{
				if(l>=2&&l<=12)
				{
					w=WORDS[l].random();
				}
				else
				{
					w=String.fromCharCode('a'.charCodeAt(0)+(Math.random()*26).floor());
				}
				if(!ig.game.targets[w.charAt(0)].length)
				{
					return w;
				}
			}
			return w;
		},
		target:function()
		{
			this.targeted=true;
			ig.game.currentTarget=this;
			ig.game.unregisterTarget(this.word.charAt(0),this);
			ig.game.entities.erase(this);
			ig.game.entities.push(this);
		},
		draw:function()
		{
			ig.system.context.globalCompositeOperation='lighter';
			this.parent();
			ig.system.context.globalCompositeOperation='source-over';
		},
		drawLabel:function()
		{
			if(!this.remainingWord.length) return;
			var w=this.word.length;
			var x=(this.pos.x+6).limit(w+2,ig.system.width-1);
			var y=(this.pos.y+this.size.y-25).limit(2,ig.system.height-20);
			var bx=ig.system.getDrawPos(x-20);
			var by=ig.system.getDrawPos(y-18);
			var ctx=ig.system.context;
			ctx.fillStyle='rgba(0,0,0,0.3)';
			ctx.fillRect(bx,by,30,19);
			ctx.textAlign='center';
			ctx.fillStyle='rgb(255,255,255)';
			if(this.targeted)
			{
				ctx.save();
				ctx.fillStyle='rgb(200,100,100)';
				ctx.fillText(this.remainingWord,x,y);
			}
			ctx.fillText(this.remainingWord,x,y);
			ctx.restore();
		},
		kill:function()
		{
			ig.game.unregisterTarget(this.word.charAt(0),this);
			if(ig.game.currentTarget==this)
			{
				ig.game.currentTarget=null;
			}
			this.parent();
		},
		update:function()
		{
			if(this.hitTimer.delta()>0)
			{
				this.vel.x=Math.cos(this.angle)*this.speed;
				this.vel.y=Math.sin(this.angle)*this.speed;
			}
			this.parent();
			if(this.pos.x<-this.animSheet.width||this.pos.x>ig.system.width+10||this.pos.y>ig.system.height+10||this.pos.y<-this.animSheet.height-30)
			{
				this.kill();
			}
		},
		hit:function()
		{
			var numParticles=this.health<=1?10:4;
			for(var i=0;i<numParticles;i++)
			{
				ig.game.spawnEntity(EntityExplosionParticle,this.pos.x,this.pos.y);
			}
			this.vel.x=-Math.cos(this.angle)*20;
			this.vel.y=-Math.sin(this.angle)*20;
			this.hitTimer.set(0.3);
			this.receiveDamage(1);
			ig.game.lastKillTimer.set(0.3);
			this.soundHit.play();
		},
		isHitBy:function(letter)
		{
			if(this.remainingWord.charAt(0)==letter)
			{
				this.remainingWord=this.remainingWord.substr(1);
				if(this.remainingWord.length==0)
				{
					ig.game.currentTarget=null;
					ig.game.unregisterTarget(this.word.charAt(0),this);
					this.dead=true;
				}
				return true;
			}
			else
			{
				return false;
			}
		},
		check:function(other)
		{
			other.kill();
			this.kill();
		}
	});
	EntityExplosionParticle=EntityParticle.extend(
	{
		lifetime:0.5,
		fadetime:0.5,
		vel:{x:60,y:60},
		animSheet:new ig.AnimationSheet('media/sprites/explosion.png',32,32),
		init:function(x,y,settings)
		{
			this.addAnim('idle',5,[0,1,2]);
			this.parent(x,y,settings);
		},
		draw:function()
		{
			ig.system.context.globalCompositeOperation='lighter';
			this.parent();
			ig.system.context.globalCompositeOperation='source-over';
		},
		update:function()
		{
			this.currentAnim.angle+=0.1*ig.system.tick;
			this.parent();
		}
	});
});