ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'game.levels.dorm1',
	'game.levels.dorm2', 
	'impact.font',
	'plugins.button',
	'game.zoom',
	'plugins.impact-splash-loader',
	'impact.debug.debug'
)

.defines(function(){

MyGame = ig.Game.extend({
	gravity: 300,
	instructText: new ig.Font('media/04b03.font.png'),
	statText: new ig.Font('media/04c03.font.png'),
	showStat: false,
	playSound: true,
	paused: false,
	statMatte: new ig.Image('media/stat-matte.png'),
	levelTimer: new ig.Timer(),
	levelExit: false,
	stats: {time: 0, kills: 0, deaths: 0, coins: 0},
	lives: 1,
    lifeSprite: new ig.Image('media/life-sprite.png'),
    gameState: 'mainmenu',
    gameMode: 'easy',
	loadLevel: function(data){
		this.parent(data);
		this.levelTimer.reset();
	},
	toggleStats: function(levelExit){
		this.showStats = true;
		this.stats.time = Math.round(this.levelTimer.delta());
		this.levelExit = levelExit;
	},
	check: function(other){
		if(other instanceof EntityPlayer){
			this.toggleStats(other);
		}
	},
	init: function() {

		// Bind keys
		ig.input.bind(ig.KEY.UP_ARROW, 'up');
        ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind(ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind(ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind(ig.KEY.X, 'jump' );
		ig.input.bind(ig.KEY.C, 'shoot' );
		ig.input.bind(ig.KEY.TAB, 'switch');
		ig.input.bind(ig.KEY.SPACE, 'continue');
		ig.input.bind(ig.KEY.ENTER, 'select');
		ig.input.bind(ig.KEY.MOUSE1, 'click');
		ig.input.bind(ig.KEY.P, 'pause');
		ig.input.bind(ig.KEY.M, 'sound');
		ig.input.bind(ig.KEY.MWHEEL_UP, 'zoomplus');
		ig.input.bind(ig.KEY.MWHEEL_DOWN, 'zoomminus');

		window.onresize=function(event){
			ig.system.resize(window.innerWidth,window.innerHeight,1);
		};
		this.screen.zoom=1;

		// 初始化设置页面
		this.mainMenu();
		
		//Add music
		ig.music.add('media/sounds/theme.*');
		ig.music.volume = 0.5;
		// ig.music.play();

	},
	/* 主菜单屏幕 */
	mainMenu: function() {
		ig.game.gameState = 'mainmenu';
		ig.game.spawnEntity(Button, ig.system.width / 2 - 35, 75, {
			text: ['Easy'],
			textPos: {x: 37, y: 9},
			textAlign: ig.Font.ALIGN.CENTER,
			state: 'active',
			size: {x: 150, y: 45},
			optionSelected: function() {
				ig.game.gameMode = 'easy';
				ig.game.levelOne();
			}
		});

		ig.game.spawnEntity(Button, ig.system.width / 2 - 35, 100, {
			text: ['Medium'],
			textPos: {x: 37, y: 9},
			textAlign: ig.Font.ALIGN.CENTER,
			size: {x: 150, y: 45},
			optionSelected: function() {
				ig.game.gameMode = 'medium';
				ig.game.levelOne();
			}
		});

		ig.game.spawnEntity(Button, ig.system.width /2 - 35, 125, {
			text: ['Hard'],
			textPos: {x: 37, y: 9},
			textAlign: ig.Font.ALIGN.CENTER,
			size: {x: 150, y: 45},
			optionSelected: function() {
				ig.game.gameMode = 'hard';
				ig.game.levelOne();
			}
		});
	},
	levelOne: function() {
		ig.game.gameState = 'levelOne';
		this.loadLevel( LevelDorm1 );
		this.screen.zoom = 1;

		if(ig.game.gameMode == 'easy') {
			// 什么也不做，保持默认
		} else if (ig.game.gameMode == 'medium') {
			// 提升每个敌人的伤害10点
			var monsters = ig.game.getEntitiesByType(EntityMonster);
			for(var i = 0; i < monsters.length; i++) {
				var monster = monsters[i];
				monster.check = function(other) {
					other.receiveDamage(20, this);
				}
			}
		} else if(ig.game.gameMode == 'hard') {
			ig.game.spawnEntity(EntityMonster, 468, 324);
			ig.game.spawnEntity(EntityMonster, 468, 84);
			ig.game.spawnEntity(EntityMonster, 84, 324);
		}
	},

	update: function() {
		/* Toggle Sounds */
		if( ig.input.pressed('sound') )
		{
			ig.game.playSound = false;
		}

		/* 菜单选择 */
		if(this.gameState == 'mainmenu') {
			var buttons = ig.game.getEntitiesByType(Button);
			if(ig.input.pressed('continue') || ig.input.pressed('select') || ig.input.pressed('click')) {
				for(var x = 0; x < buttons.length; x++) {
					if(buttons[x].state == 'active') {
						buttons[x].optionSelected();
						break;
					}
				}
			}

			if(ig.input.pressed('down')) {
				for(var x = 0; x < buttons.length; x++) {
					if(buttons[x].state == 'active') {
						if(!buttons[x+1]) {
							buttons[x].state = 'idle';
							buttons[x].setState('idle');
							buttons[0].state = 'active';
							buttons[0].setState('active');
						} else {
							buttons[x].state = 'idle';
							buttons[x].setState('idle');
							buttons[x+1].state = 'active';
							buttons[x+1].setState('active');
						}
						break;
					}
				}
			}

			if(ig.input.pressed('up')) {
				for(var x = 0; x < buttons.length; x++) {
					if(buttons[x].state == 'active') {
						if(!buttons[x-1]) {
							buttons[x].state = 'idle';
							buttons[x].setState('idle');
							buttons[2].state = 'active';
							buttons[2].setState('active');
						} else {
							buttons[x].state = 'idle';
							buttons[x].setState('idle');
							buttons[x-1].state = 'active';
							buttons[x-1].setState('active');
						}
						break;
					}
				}
			}
		}

		if(!this.paused && this.gameState != 'mainmenu') {
			//screen follows the player
			var player = this.getEntitiesByType(EntityPlayer)[0];
			if(player){
				this.screen.x = (player.pos.x + (player.size.x/2)) - Math.round(ig.system.width/2);
				this.screen.y = (player.pos.y + (player.size.y/2)) - Math.round(ig.system.height/2);
				if(player.accel.x > 0 && this.instructText){
					this.instructText = null;
				}
			}

			if(!this.showStats){
				// Update all entities and backgroundMaps
				this.parent();
			}else{
				if(ig.input.pressed('continue')){
					this.showStats = false;
					this.levelExit.nextLevel();
					this.screen.zoom = 1;
					this.parent();
				}
			}
		}

		// 伸缩屏幕
		if(ig.input.state('zoomplus')) {
			this.screen.zoom += 1;
		} else if(ig.input.state('zoomminus')) {
			this.screen.zoom -= 1;
		}
		console.log(this.screen.zoom);
		if(this.screen.zoom < 1){
			this.screen.zoom = 1;
		}

	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();

		if(this.instructText){
			var x = ig.system.width/2, y = ig.system.height - 50;
			this.instructText.draw("Left/Right Moves, X Jumps, \nC Fires & Tab Switches Weapons.", x, y, ig.Font.ALIGN.CENTER);
		}

		if(this.showStats){
			this.statMatte.draw(0, 0);
			var x = ig.system.width/2, y = ig.system.height/2;
			ig.system.context.fillStyle = '#ffffff';
			ig.system.context.font = '25px Verdana';
			ig.system.context.fillText( '过关', x, y + 20 );
			ig.system.context.fillText( '硬币: '+this.stats.coins, x, y + 50 );
			ig.system.context.fillText( '击杀: '+this.stats.kills, x, y + 80 );
			ig.system.context.fillText( '死亡: '+this.stats.deaths, x, y + 110 );
			ig.system.context.fillText( '点击空格继续', x, y + 150 );
		}
	},
	gameOver: function() {
		ig.finalStats = ig.game.stats;
		ig.system.setGame(GameOverScreen);
	}
});

StartScreen = ig.Game.extend({
	instructText: new ig.Font('media/04b03.font.png'),
	background: new ig.Image('media/screen-bg.png'),
	mainCharacter: new ig.Image('media/screen-main-character.png'),
	title: new ig.Image('media/game-title.png'),
	init: function(){
		ig.input.bind(ig.KEY.SPACE, 'space');
	},
	update: function(){
		if(ig.input.pressed('space')){
			ig.system.setGame(MyGame);
		}
	},
	draw: function(){
		this.parent();
		this.background.draw(0, 0);
		this.mainCharacter.draw(0, 0);
		this.title.draw(ig.system.width  - this.title.width, 0);
		var x = ig.system.width/2, y = ig.system.height/2;
		this.instructText.draw('Made by Gtskk', x + 50, y - 10, ig.Font.ALIGN.CENTER);
		ig.system.context.fillStyle = '#ffffff';
		ig.system.context.font = '20px Verdana';
		ig.system.context.fillText( '点击空格继续', x + 195, y + 140 );
	},
});

// 游戏结束界面
GameOverScreen = ig.Game.extend({
	instructText: new ig.Font('media/04c03.font.png'),
	background: new ig.Image('media/screen-bg.png'),
	gameOver: new ig.Image('media/game-over.png'),
	stats: {},
	init: function() {
		ig.input.bind(ig.KEY.SPACE, 'start');
		this.stats = ig.finalStats;
	},
	update: function() {
		if(ig.input.pressed('start')) {
			ig.system.setGame(StartScreen);
		}
		this.parent();
	},
	draw: function() {
		this.parent();
		this.background.draw(0, 0);
		var x = ig.system.width/2,
			y = ig.system.height/2 - 20;
		this.gameOver.draw(x - (this.gameOver.width*.5), y - 40);
		var score = (this.stats.kills * 100) - (this.stats.deaths * 50);
		ig.system.context.fillStyle = '#ffffff';
		ig.system.context.fillText( '硬币: ' + this.stats.coins, x, y + 120 );
		ig.system.context.fillText( '击杀: ' + this.stats.kills, x, y + 140 );
		ig.system.context.fillText( '死亡: ' + this.stats.deaths, x, y + 160 );
		ig.system.context.fillText( '得分: ' + score, x, y + 180 );
		ig.system.context.fillText( '点击空格继续', x, y + 200 );
	}
});

//if mobile, stop all music
if(ig.ua.mobile){
	ig.Sound.enabled = false;
}

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', StartScreen, 60, 320, 240, 1, ig.ImpactSplashLoader);

});
