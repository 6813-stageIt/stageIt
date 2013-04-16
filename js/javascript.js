$('#stages li').click(function(){
    $(this).addClass('stage-selected').siblings().removeClass('stage-selected');
});

$('#props li').click(function(){
    $(this).addClass('prop-selected').siblings().removeClass('prop-selected');
});

$('#editStage').click(function(){
	$('#chooseStage').modal();

});

// things that need to be reset when stageModal is hidden
$('#chooseStage').on('hidden', function(){
	$('#stages li').removeClass('stage-selected');
	$('#stageHelper').css("display", "none");
	$('.hidden').css("display", "inline");
});

$('#choosePropModal').on('hidden', function(){
	$('#props li').removeClass('prop-selected');
	$('#propHelper').css("display", "none");
})

//shows the dancer modal
$('#addDancers').click(function(){
	$('#addDancersModal').modal();
});


$('#addProps').click(function(){

	$('#choosePropModal').modal();
})

//close stage modal dialog
function closeStageDialog() {
	$('#chooseStage').modal('hide'); 
	};

//function called when ok button is clicked on stage modal
function drawStage() {
	//check if there is something selected
	if(!$('.stage-selected').length > 0){
		$('#stageHelper').css("display", "inline");
	}
	else{
		var stage = $('.stage-selected').attr('id');
		closeStageDialog();
		drawStageShape(stage);
	}
	
	};

function drawStageShape(stage){
	switch(stage){
		case 'rectangle':
			drawRectangleStage();
			break;
		case 'semicircle':
			drawSemiCircleStage();
			break;
	}
}

function drawRectangleStage(){
	var canvas = document.getElementById('canvas-stage');
	var ctxt = canvas.getContext('2d');
	ctxt.clearRect(0, 0, canvas.width, canvas.height);
	ctxt.beginPath();
	ctxt.rect(.5, .5, canvas.width-1, canvas.height-1);
	ctxt.fillStyle = 'white';
	ctxt.fill();
	ctxt.lineWidth = 1;
	ctxt.strokeStyle = 'gray';
	ctxt.stroke(); 
	move=new Object();
	move.startx = 0;
	move.starty = 0;
	move.endy=300;
	move.endx = 210;
	drawArrow(move);
}
function drawSemiCircleStage(){
	var canvas = document.getElementById('canvas-stage');
	var ctxt = canvas.getContext('2d');
	ctxt.clearRect(0, 0, canvas.width, canvas.height);
	ctxt.beginPath();
	var x = canvas.width/2+.5;
	var y = 1.5;
	var radius = canvas.height-2.5;
	var startAngle = 0; endAngle = Math.PI;
	ctxt.arc(x,y,radius, startAngle,endAngle);
	ctxt.closePath();
	ctxt.lineWidth = 1;
	ctxt.fillStyle = 'white';
	ctxt.fill();
	ctxt.strokeStyle = 'gray';
	ctxt.stroke();
	
}
function drawArrow(arrow){
		//stroke method of arrow
		//arrow will have start and end coordinates
		starty=arrow.starty;
		startx=arrow.startx;
		//x and y cordinates are flipped from row and column
		endy=arrow.endy;
		endx=arrow.endx;
		var dx = 0;
		var dy = 0;
		var dz = 0;
		if(startx-endx>0)
			dx = -1;
		else
			dx= 1;
		if(starty-endy>0)
			dy = -1;
		else
			dy = 1;
		if (startx==endx)
			dz = 1;
		else if(starty==endy)
			dz = -1;
			
	var canvas = document.getElementById('arrow-canvas-stage');
			if (canvas.getContext){
			console.log('awesomesauce');
			console.log(startx+endy);
				var context = canvas.getContext('2d');
				context.clearRect(0, 0, canvas.width, canvas.height); //clears the canvas, old arrows erased
				ratio=.8;
				context.strokeStyle = '#FBEC5D'; //yellow corn arrow
				context.lineWidth  = 3;
				var tiplength = 10*ratio;   // length of head
				var angle = Math.atan2(endy-starty,endx-startx);
				context.beginPath();
				context.moveTo(startx, starty);
				context.lineTo(endx, endy);
				if(dz==0){
					context.lineTo(endx-tiplength*dx,endy); //first tip of arrow
					context.moveTo(endx, endy);
					context.lineTo(endx,endy-tiplength*dy); //second tip of arrow
				}
				else if(dz ==-1){//vertical
					context.lineTo(endx-tiplength*dx,endy-tiplength*dx); //first tip of arrow
					context.moveTo(endx, endy);
					context.lineTo(endx-tiplength*dx,endy+tiplength*dx); //second tip of arrow
				}	
				else if(dz ==1){//horizontal
					context.lineTo(endx-tiplength*dy,endy-tiplength*dy); //first tip of arrow
					context.moveTo(endx, endy);
					context.lineTo(endx+tiplength*dy,endy-tiplength*dy); //second tip of arrow
				}
				context.closePath();
				context.stroke();
			}	
		}