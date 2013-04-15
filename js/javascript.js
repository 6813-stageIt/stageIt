$('#stages li').click(function(){
    $(this).addClass('stage-selected').siblings().removeClass('stage-selected');
});

$('#props li').click(function(){
    $(this).addClass('prop-selected').siblings().removeClass('prop-selected');
});

$('#dancers li').click(function(){
	$(this).addClass('dancer-selected').siblings().removeClass('dancer-selected');
})

// $('#editStage').click(function(){
// 	$('#chooseStage').modal();

// });

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
// $('#addDancers').click(function(){
// 	$('#addDancersModal').modal();
// 	$('#spinner').spinner();
// });


// $('#addProps').click(function(){
// 	$('#choosePropModal').modal();
// })

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

function addDancers(){
	$('#addDancersModal').modal('hide'); 
	var numDancers = $("#spinner_numDancers").val();
	closeAddDancersDialog();

	var x = 30;
	var y = 10;

	for(var i=0; i < numDancers; i++){
		x;
		y=y+40;
		//console.log('y='+y);
		addDancerAt(x,y);
	}

}
function addDancerAt(posX,posY){
	var draggableObject = $('<div id="draggable" class="ui-widget-content"></div>');
	var dancerItem = $('<img src="img/ballet_dancer1.png" id="img-dancer"/>');
	dancerItem.css("position","absolute");
	dancerItem.css("z-index", 1);
    dancerItem.css("width", 40);
    dancerItem.css("height", 40);
    dancerItem.css("top", posY);
    dancerItem.css("left", posX);

    //TODO:  
    // - make dancers resizeable?
    // - make dancers draggable
    // - choose colors
    // - choose shapes
    
    draggableObject.append(dancerItem);
    
    //dancer.element = dancerItem;
    $("#canvasWrapper").append(draggableObject);
    //console.log("dancer added at " + posX + ',' + posY + '?');
}
function closeAddDancersDialog() {
	$('#addDancersModal').modal('hide'); 
	};