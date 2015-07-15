ig.module(
	'game.entities.healthpotion'
)
.requires(
	'impact.entity'
)
.defines(function() {
	EntityHealthpotion = ig.Entity.extend({
		size: {x: 32, y: 32},
		collides: ig.Entity.COLLIDES.NONE,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		animSheet: new ig.AnimationSheet('media/healthpotion.png', 20, 25),
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
		},
		check: function(other) {
			other.receiveDamage(-20, this);
			this.kill();
		}
	});
});