// $('#stages li').click(function(){
//     $(this).addClass('stage-selected').siblings().removeClass('stage-selected');
// });

// $('#props li').click(function(){
//     $(this).addClass('prop-selected').siblings().removeClass('prop-selected');
// });

// $('#dancers li').click(function(){
// 	$(this).addClass('dancer-selected').siblings().removeClass('dancer-selected');
// });
$("#delete-container").droppable({
	accept:".added",
	hoverClass: "delete-hover",
	tolerance: "touch",
	drop: function (event, ui){
		$(ui.draggable).remove();
	}
});


$('.option li').click(function(){
	var option = $(this).parent().attr('data-option');
	$(this).addClass(option+'-selected').siblings().removeClass(option+'-selected');
});

$('#addDancersModal .option img').click(function(){
	var shape = $(this).parent().attr('id');
	console.log(shape);
	$('#preview-img').attr("src", "img/"+shape+'.png').css("border", "none");
})

$('#addDancersModal input[type="radio"]').click(function(){
	console.log("radio clicked");
	if($('#preview-img').attr('id').length > 0){
		changeColorOfImage($(this).attr('value'));
	}
});

function changeColorOfImage(color){
	var curr = $('#preview-img').attr('src');
	if (curr.search('square')!=-1){ //in src ->current image is square
		$('#preview-img').attr('src', 'img/square-'+color+'.png');
	}
	else if (curr.search('circle')!=-1){
		$('#preview-img').attr('src', 'img/circle-'+color+'.png');
	}
	else if (curr.search('triangle')!=-1){
		$('#preview-img').attr('src', 'img/triangle-'+color+'.png');
	}
}



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
});

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
	if(!$('.dancer-selected').length > 0){
		$('#dancerHelper').css("display", "inline");
	}
	else{
		var shape = $('.dancer-selected').attr('id');
		var color = $('input[name=color]:radio:checked').attr('value');
		console.log(color);
		var numDancers = $("#spinner_numDancers").val();
		closeAddDancersDialog();
		// var img = $('<img>').attr('src', 'img/'+shape+'-'+color+'.png');		
		var x = 30;
		var y = 10;
		for(var i=0; i < numDancers; i++){
			var img = $('<img>').attr('src', 'img/'+shape+'-'+color+'.png');		
			addDancerAt(img, x,y);
			y+=60; //wont work for large amounts, add handling
		}

	}	 

}

function addDancerAt(imageDiv,posX,posY){
	imageDiv.css({
		'position': 'absolute',
		'z-index':10,
		'width':60,
		'height':60,
		'top':posY,
		'left':posX,
		'cursor':'move'
	});
	imageDiv.addClass("added");
    imageDiv.draggable({
            zIndex:100,
            containment:'#canvasWrapper',
        });
    //imageDiv.resizable();
    imageDiv.dblclick(function(){
    	var newText = prompt("Enter text to display in element:");
			if(newText != null){
				$(this).text(newText);
			}
		});
    $("#canvasWrapper").append(imageDiv);
}
function closeAddDancersDialog() {
	$('#addDancersModal').modal('hide'); 
};

//function called when ok button is clicked on props modal
function addProp() {
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
