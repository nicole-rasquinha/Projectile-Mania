var textBox = $('.control input'); //$ is the same as jQuery
var cannon = $('.cannon');
var cannonball = $('.cannonball');
var button = $('.control button');
var isLaunched = false;

var properties = {};

var og_props = {
	left: parseInt(cannon.css('left'), 10),
	bottom: parseInt(cannon.css('bottom'), 10)
};

var commandEntered = function(event) {
	event.preventDefault(); //prevent refresh

	cannonball.css(properties);
	var text = textBox.val();
	commandHandler(text);
};

button.on('click', commandEntered);

var commandHandler = function(cmd) {
	var words = cmd.split(' ');
	if (typeof eval(words[0]) === "number" && typeof eval(words[1]) === "number") {
		go(eval(words[0]), eval(words[1]));
	}
	else{
		wrongCommand();
	}

};

var go = function(v0, theta) {
	var g = -9.8;
	var pi = Math.PI;

	var angle = (theta/180) * pi;
	var vy_dir = Math.sin(angle);
	var y0 = 0;
	var vx_dir = Math.cos(angle);
	var vx = v0 * vx_dir;

	var a = 0.5*g;
	var b = v0 * vy_dir;
	var c = y0;

	var make_quadratic = function(){
		var f = function(t){
			return a*t*t + b*t + c;
		}
		return f;
	};

	var solve_quadratic = function(){
		var t = (-b - Math.sqrt(b*b - 4*a*c))/(2*a);
		return t;
	};

	var find_range = function(){
		var t_flight = solve_quadratic();
		var x_disp = vx * t_flight;
		x_disp = x_disp * 1000;
		x_disp = Math.round(x_disp);
		x_disp = x_disp/1000;
		return x_disp;
	};

	var find_max = function(){
		var t = -b/(2*a);
		var max_height = make_quadratic()(t);
		max_height = max_height * 1000;
		max_height = Math.round(max_height);
		max_height = max_height/1000;
		return max_height;
	};

	var displayRange = find_range();
	var maximum = find_max();
	textBox.val("Range: " + displayRange + " m" + "\tMaximum Height: " + maximum + " m");
	
	t_tot = solve_quadratic();
	var y = make_quadratic();

	var times = [];
	for (var k = 0.01; k < t_tot + 0.12; k+=0.01){
		times.push(k);
	}

	var ballLeftText = cannonball.css('left'); // ship.style.left;
  	var ballBottomText = cannonball.css('bottom'); // ship.style.bottom;
  	var ballLeftPosition = parseInt(ballLeftText, 10);
  	var ballBottomPosition = parseInt(ballBottomText, 10);

	for (var i = 0; i < times.length; i++){
		properties = {
			left: ballLeftPosition + (1/(5*v0))*2000*vx * times[i] + 'px',
			bottom: ballBottomPosition + (1/(5*v0))*3000 * y(times[i]) + 'px'
		};
		cannonball.animate(properties, 8);
	}

	properties = {
		left: ballLeftPosition + 'px',
		bottom: ballBottomPosition + 'px'
	};

};

var wrongCommand = function() {
	textBox.val('You entered the wrong command!');
	ship.attr('src', 'resources/explode.png');
};

