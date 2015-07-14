<?php
$year = date('Y'); 
echo <<<EOT
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>ImpactJs -- Gtskk</title>
<style type="text/css">
html,body {
	background-color: #25272b;
	background-image: url(phobos.png);
	background-position: 54px 105px;
	background-attachment: fixed;
	background-repeat: no-repeat;
	color: #fff;
	font-family: helvetica, arial, sans-serif;
	margin: 0;
	padding: 0;
	font-size: 12pt;
}
#canvas {
	border: 1px solid #555;
	position: absolute;
	left: 0;
	top: 0;
	width: 360px;
	height: 640px;
	background-color: #000;
}
#game {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	margin: auto;
	width: 360px;
	height: 640px;
}
#nocanvas {
	width: 360px;
	margin: 150px auto;
}
a {
	color: #F47920;
	text-decoration: none;
}
a:hover {
	color: #ff9536;
	text-shadow: #F47920 0px 0px 2px;
}
#ad {
	width: 160px;
	height: 600px;
	position: absolute;text-align: center;
	left: 32px;
	top: 0;
	bottom: 0;
	margin: auto;
}
#cr {
	position: absolute;
	text-align: center;
	bottom: 32px;
	right: 32px;
}
#cr span {
	font-size: 140%;
	margin: 0 0 2.5em 0;
}
</style>
<meta name="description" content="用 ImpactJS 制作的打字射击游戏"/>
<script type="text/javascript" src="lib/impact/impact.js"></script>
<script type="text/javascript" src="lib/game/main.js"></script>
</head>
<body>
	<p id="cr"><span>Z-Type</span><br/><br/><span>打字射击！</span><br/><br/>Copyright &copy; 2005-$year <a href="http://www.kilofox.net">Kilofox.Net</a>. All rights reserved.</p>
	<div id="game">
		<canvas id="canvas">
			<div id="noCanvas">
				<p>您的浏览器不支持 HTML5。</p>
				<p>您需要有一个好一点儿的浏览器，比如：
					<a href="http://www.google.com/chrome/" target="_blank">Chrome</a> 或
					<a href="http://www.mozilla.com/firefox/" target="_blank">Firefox</a>。
				</p>
			</div>
		</canvas>
	</div>
</body>
</html>
EOT;
?>