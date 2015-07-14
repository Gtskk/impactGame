ig.module(
	'game.entities.mine'
	)
	.requires(
		'impact.entity',
		'impact.sound'
	)
	.defines(function() {
		EntityMine = ig.Entity.extend({
			animSheet: new ig.AnimationSheet('media/sprites/mine.png', 32, 32),
			size: {
				x: 18,
				y: 20
			},
			offset: {
				x: 4,
				y: 2
			},
			coinTimes: 0,
			deathSFX: new ig.Sound('media/sounds/death.*'),
			gravityFactor: 0,
			bounciness: 0.5,
			type: ig.Entity.TYPE.NONE,
			checkAgainst: ig.Entity.TYPE.A,
			collides: ig.Entity.COLLIDES.FIXED,
			init: function(x, y, settings) {
				this.parent(x, y, settings);
				this.addAnim( 'idle', 1, [0] );
			},
			check: function(other) {
				this.coinTimes++;
				if(this.coinTimes > Math.random() * 10) {
					this.kill();
				}
				ig.game.stats.coins++;
			},
			update: function() {
				this.parent();
			},
			kill: function() {
				this.deathSFX.play();
				this.parent();
				ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y);
			},
		});
	});