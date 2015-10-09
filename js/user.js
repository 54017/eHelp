$(function() {

	var width = 950,
		height = 450,
		$canvas, canvas, context;
	var datas = [{month: 3, receive: 10}, {month: 4, receive: 1},{month: 5, receive: 34},{month: 6, receive: 20},{month: 7, receive: 12}];

	var myCanvas = {
		distance: 0, 
		spacing: 0,
		startX: 30,
		endX: 950,
		startY: 380,
		endY: 80,
		lineNum: 6,
		monthNum: 5,
		positionX: [],
		positionY: [],
		data: [],
		draw: function(datas) {
			this.pretreat(datas);
			var tempSpaceY = (this.startY-this.endY)/(this.lineNum - 1);
			for (var i = 0; i < this.lineNum; ++i) {
				if (i == 0) {
					context.strokeStyle = '#C0C0C0';
					context.lineWidth = 2;
					context.beginPath();
					context.moveTo(this.startX, this.startY);
					context.lineTo(this.endX, this.startY);
					context.stroke();
					context.strokeStyle = '#E8E8E8';
					context.lineWidth = 1;
					context.font = "18px microsoft yahei";
					context.fillStyle = "#ff851b";
					context.fillText(0, this.startX - 25, this.startY);
				} else {
					context.beginPath();
					context.moveTo(this.startX, this.startY-tempSpaceY*i);
					context.lineTo(this.endX, this.startY-tempSpaceY*i);
					context.stroke();
					context.fillText(this.spacing*i, this.startX - 25, this.startY-tempSpaceY*i);
				}
			}
			this.drawNum(datas);
			myCanvas.drawLines();
		},
		translate: function(data) {
			var tempSpaceX = (this.endX-this.startX)/this.monthNum;
			var x, y;
			for (var i = 0; i < data.length; ++i) {
				y = this.startY - (data[i].receive/this.distance*(this.startY - this.endY));
				x = this.startX + tempSpaceX*i + 30;
				this.positionX.push(x);
				this.positionY.push(y);
				this.data.push(data[i].receive);
			}
		},
		pretreat: function(data) {
			var temp = 0;
			for (var i = 0; i < data.length; ++i) {
				if (data[i].receive > temp) {
					temp = data[i].receive;
				}
			}
			this.spacing = Math.ceil(temp/(this.lineNum - 1));
			this.distance = this.spacing*(this.lineNum - 1);
			this.translate(data);
		},
		drawNum: function(data) {
			//x轴月份
			var tempSpaceX = (this.endX-this.startX)/this.monthNum;
			context.font = "18px microsoft yahei";
			context.fillStyle = "#FF9999";
			for (var i = 0; i < this.monthNum; ++i) {
				context.fillText(data[i].month, this.startX + tempSpaceX*i + 25, this.startY + 25);
			}
		},
		drawCircles: function() {
			context.lineWidth = 1;	
			for (var i = 0; i < this.monthNum; ++i) {
				context.strokeStyle = "#00CCFF";
				context.beginPath();
				context.arc(this.positionX[i], this.positionY[i], 5,0,2*Math.PI);
				context.stroke();
				context.fillStyle = "white";
				context.arc(this.positionX[i], this.positionY[i], 4,0,2*Math.PI);
				context.fill();
			}
		},
		drawLines: function() {
			context.beginPath();
			context.strokeStyle = "#00CCFF";
			for (var i = 0; i < this.monthNum - 1; ++i) {
				context.moveTo(this.positionX[i], this.positionY[i]);
				context.lineTo(this.positionX[i + 1], this.positionY[i + 1]);
				context.stroke();
			}
			this.drawCircles();
		},
		listener: function() {
			var mouseX = e.pageX || e.offsetX;
			var mouseY = e.pageY || e.offsetY;
			var canvasX = $('.my-canvas').offset().left;
			var canvasY = $('.my-canvas').offset().top;
			var x = mouseX - canvasX;
			var y = mouseY - canvasY;
			for (var i = 0; i < myCanvas.monthNum; ++i) {
				if (Math.sqrt(Math.pow(x - myCanvas.positionX[i], 2) + Math.pow(y - myCanvas.positionY[i], 2)) < 50) {
					console.log(myCanvas.data[i]);
				}
			}
		}
	}

	var initCanvas = function() {
		$canvas = $('.my-canvas');
		canvas = $canvas.get(0);
		$canvas.attr('width', width);
		$canvas.attr('height', height);
		context = canvas.getContext('2d');
		context.fillStyle = "white";
		context.fillRect(0, 0, width, height);
		myCanvas.draw(datas);
	}

	var init = function() {
		$(window).on('scroll', watcher);
		
		$('.ui.dropdown').dropdown();

		$(document).on('click', 'a.reply', function() {
			var secondComment = $(this).parent().parent().next();
			if (secondComment.hasClass('second')) {
				secondComment.toggleClass('hide');
			}
			
		});

		$(document).on('click', 'a.cancel', function() {
			$('form.reply').remove();
		})

		$('.types button').click(function() {
			$('.types button').removeClass('active');
			$(this).addClass('active');
			if ($(this).hasClass('question-bt')) {
				$('.map').hide();
				$('.my-message').show();
				$('.state').text('提问动态');
				$('.buttons button').eq(0).text('提问');
				$('.buttons button').eq(1).text('回答');
				$('.reply').show();
				$('.response, .go-to-help, distance').hide();
			} else {
				$('.map').show();
				$('.my-message').hide();
				$('.reply').hide();
				$('.response, .go-to-help, .distance').show();
				$('.go-to-help').css('display', 'inline-block');
				if ($(this).hasClass('save-bt')) {
					$('.state').text('求救动态');
					$('.buttons button').eq(0).text('求救');
					$('.buttons button').eq(1).text('施救');
				} else {
					$('.state').text('求助动态');
					$('.buttons button').eq(0).text('求助');
					$('.buttons button').eq(1).text('施助');
				}
			}
		})
	}

	var fixTab = function() {
		$('.types').addClass('fixed');
	}

	var releaseTab = function() {
		$('.types').removeClass('fixed');
	}


	var changeTabPosition = function(top) {
		if (top >= 110) {
			$('.ghost').show();
			fixTab();
		} else {
			$('.ghost').hide();
			releaseTab();
		}
	}


	var watcher = function() {
		var top = $('body').scrollTop();
		changeTabPosition(top);
	}

	var buttonChange = function() {
		$('.buttons .button').click(function() {
			$('.buttons .button').removeClass('positive');
			$(this).addClass('positive');
		})
	}

	init();
	initCanvas();
	buttonChange();
});

