ig.module(
	'game.entities.monster'
)
ig.requires(
		'impact.entity',
		'impact.sound'
	)
	.defines(function() {
		EntityMonster = ig.Entity.extend({
			name: "enemy",
			animSheet: new ig.AnimationSheet('media/zombie.png', 16, 16),
			speed: 50,
			size: {
				x: 8,
				y: 14
			},
			offset: {
				x: 4,
				y: 2
			},
			maxVel: {
				x: 100,
				y: 100
			},
			health: 100,
			maxHealth: 100,
			deathSFX: new ig.Sound('media/sounds/death.*'),
			flip: true,
			friction: {
				x: 150,
				y: 0
			},
			speed: 14,
			type: ig.Entity.TYPE.B,
			collides: ig.Entity.COLLIDES.PASSIVE,
			checkAgainst: ig.Entity.TYPE.A,
			check: function(other) {
				other.receiveDamage(10, this);
				// this.parent();
			},
			receiveDamage: function(value) {
				this.parent(value);
				if (this.health > 0) {
					ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {
						particles: 2,
						colorOffset: 1
					});
				}
			},
			kill: function() {
				this.deathSFX.play();
				this.parent();
				ig.game.stats.kills++;
				ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {
					colorOffset: 1
				});
			},
			init: function(x, y, settings) {
				this.parent(x, y, settings);
				this.addAnim('walk', 0.07, [0, 1, 2, 3, 4, 5]);

				if(!ig.global.wm) {
					// 不是weltmeister环境下才添加血条
					ig.game.spawnEntity(EntityHealthBar, this.pos.x, this.pos.y, {Unit: this});
				}
			},
			update: function() {
				//near a edge? return!
				if (!ig.game.collisionMap.getTile(this.pos.x + (this.flip ? +4 : this.size.x - 4), this.pos.y + this.size.y + 1)) {
					this.flip = !this.flip;
				}
				var xdir = this.flip ? -1 : 1;
				this.vel.x = this.speed * xdir;
				this.currentAnim.flip.x = this.flip;

				this.parent();
			},
			handleMovementTrace: function(res) {
				this.parent(res);
				if (res.collision.x) {
					this.flip = !this.flip;
				}
			},
		});
	});