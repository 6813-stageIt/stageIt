// $('#stages li').click(function(){
//     $(this).addClass('stage-selected').siblings().removeClass('stage-selected');
// });

// $('#props li').click(function(){
//     $(this).addClass('prop-selected').siblings().removeClass('prop-selected');
// });

// $('#dancers li').click(function(){
// 	$(this).addClass('dancer-selected').siblings().removeClass('dancer-selected');
// });
var dancerCounter=0; //used to add id to dancers
var propCounter=0;
var arrowstartX = 0;
var arrowstartY=0;
var arrowendX = 0;
var arrowendY=0;
var drawPath=false;
var startDrawPath=false; 
var lastCanvasState;
var listOfPaths=[];

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
	$('#preview-img').attr("src", "img/"+shape+'.png').css("border", "none");
})

$('#addDancersModal input[type="radio"]').click(function(){
	if($('#preview-img').attr('id').length > 0){
		changeColorOfImage($(this).attr('value'));
	}
});


$('#spinner_numDancers').keyup(function (e) {
    	if (e.keyCode == 13 && $("#spinner_numDancers")){ //enter and spinner field in focus
    		addDancers();
    	}
    });
function drawPathPrompt(){
	prompt = "<b id=\"pathNote\"> Draw your path by clicking and dragging the arrow <button id=\"cancelPath\" onclick=\"cancelPath()\"> Cancel</b>"
	//$('#canvasWrapper').append(prmopt);
	$(prompt).appendTo("#canvasWrapper");
	console.log(prompt);
	document.getElementById('straightPathTool').disabled=true;
	drawPath=true;
}
function cancelPath(){
	(elem=document.getElementById("pathNote")).parentNode.removeChild(elem);
	(elem=document.getElementById("cancelPath")).parentNode.removeChild(elem);
	document.getElementById('straightPathTool').disabled=false;
	drawPath=false;
	console.log("cancel path");
}
$('#arrow-canvas').mousedown(function(e){
	console.log('mousedown');
	if(drawPath){
		var x;
		var y;
		if (e.pageX || e.pageY) { 
		  x = e.pageX;
		  y = e.pageY;
		}
		arrowstartX=x;
		arrowstartY=y;
		startDrawPath=true;
		
	}
})
$('#arrow-canvas').mousemove( function(e){
	console.log('mousemove' + e.pageX+' ' +e.pageY);
	if(startDrawPath&&drawPath){
			redrawPaths();
		move=new Object();
		var x; var y;
		if (e.pageX || e.pageY) { 
		  x = e.pageX;
		  y = e.pageY;
		}
		move.startx = arrowstartX;
		move.starty = arrowstartY;
		move.endx=x;
		move.endy = y;
		drawArrow(move);
	}
})
function redrawPaths(){

	var canvas = document.getElementById('arrow-canvas');
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		//canvas.drawColor(0, Mode.CLEAR);
		for(var i=0; i<listOfPaths.length; i++){
			drawArrow(listOfPaths[i]);
		}
		console.log(listOfPaths);
}
$('body').mouseup( function(e){
	if(startDrawPath&&drawPath){
			redrawPaths();
		move=new Object();
		var offset=$("#arrow-canvas").offset();
		var x; var y;
		if (e.pageX || e.pageY) { 
		  x = e.pageX-offset.left;
		  y = e.pageY-offset.top;
		}
		var canvas = document.getElementById('arrow-canvas');
		console.log('cheight= '+canvas.height);
		console.log('cwidth= '+canvas.width);
		if(x>0&&y>0&&x<canvas.height&&y<canvas.width){
			move.startx = arrowstartX;
			move.starty = arrowstartY;
			move.endx = e.pageX;
			move.endy = e.pageY;
			drawArrow(move);
			listOfPaths.push(move);
			console.log('path pushed');
			cancelPath();
		}
		else{cancelPath()}
		drawPath=false;
		startDrawPath=false;
	}
})
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
	console.log("#chooseStage");
});

$('#choosePropModal').on('hidden', function(){
	$('#props li').removeClass('prop-selected');
	$('#propHelper').css("display", "none");
	console.log("#choosePropModal");
});

// $('#addDancersModal').on("shown", function(){
// 	// $('#dancer-preview').tooltip("show");
// })

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
	
	}

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
function drawArrow(arrow){
		//stroke method of arrow
		//arrow will have start and end coordinates
		var offset=$("#arrow-canvas").offset();
		starty=arrow.starty-offset.top;
		startx=arrow.startx-offset.left;
		endy=arrow.endy-offset.top;
		endx=arrow.endx-offset.left;
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
			
		var canvas = document.getElementById('arrow-canvas');
				if (canvas.getContext){
				console.log('awesomesauce');
				console.log(startx+endy);
					var context = canvas.getContext('2d');
				//context.clearRect(0, 0, canvas.width, canvas.height); //clears the canvas, old arrows erased
				ratio=10;
				context.strokeStyle = '#000000'; //yellow corn arrow
				context.lineWidth  = 1;
				var angle = Math.atan2(endy-starty,endx-startx);
				context.beginPath();
				context.moveTo(startx, starty);
				context.lineTo(endx, endy);
					context.lineTo(endx-ratio*Math.cos(angle+Math.PI/4),endy-ratio*Math.sin(angle+Math.PI/4)); //first tip of arrow
					context.moveTo(endx, endy);
					context.lineTo(endx-ratio*Math.cos(angle-Math.PI/4),endy-ratio*Math.sin(angle-Math.PI/4)); //second tip of arrow
				
				context.closePath();
				context.stroke();
			}	
		}


function addDancers(){
	if(!$('.dancer-selected').length > 0){
		$('#dancerHelper').css("display", "inline");
	}
	else{
		var shape = $('.dancer-selected').attr('id');
		console.log(shape);
		var color = $('input[name=color]:radio:checked').attr('value');
		console.log(color);
		var numDancers = $("#spinner_numDancers").val();
		console.log(numDancers);
		closeAddDancersDialog();	
		var x = 30;
		var y = 10;
		for(var i=0; i < numDancers; i++){
			var id="dancer-"+dancerCounter;
			dancerCounter++;
			var wrap = $('<div></div>').attr('id', id);
			var img = $('<img>').attr('src', 'img/'+shape+'-'+color+'.png');
			wrap.append(img);
			// wrap.css('background','transparent url('+url+')');
			if(y>440){
				y=10;
				x+=60;		
			}
			addDancerAt(wrap, x,y);
			y+=60; //wont work for large amounts, add handling
		}

	}	 

}

function addDancerAt(div,posX,posY){
	div.css({
		'position':'absolute',
		'top':posY,
		'left':posX,
	});
	div.addClass("added");
	div.addClass('animated bounceIn');
	div.addClass('shape');
	div.resizable({
      aspectRatio: 1 / 1,
      maxWidth: 140,
      addClasses: false
    });
    div.draggable({
            zIndex:100,
            containment:'#canvasWrapper',
            start: function(e, ui) {
		        $(ui.helper).width($(ui.helper).width()+10);
		        $(ui.helper).height($(ui.helper).height()+10);
		    },
		    stop: function(e, ui) {
		        $(ui.helper).width($(ui.helper).width()-10);
		        $(ui.helper).height($(ui.helper).height()-10);
		    }
        });
    //div.resizable();
    div.dblclick(function(){
    	var newText = prompt("Enter text to display in element:");
			if(newText != null){
				$(this).text(newText);
			}
		});
    $("#canvasWrapper").append(div);
}
function closeAddDancersDialog() {
	$('#addDancersModal').modal('hide'); 
};

//function called when ok button is clicked on props modal
function addProp() {
	//check if there is something selected
	console.log(".prop-selected="+$('.prop-selected'));
	if(!$('.prop-selected').length > 0){
		$('#propHelper').css("display", "inline");
	}
	else{
		var item = $('.prop-selected').attr('id');
		console.log(item);

		closePropDialog();
		var x = 30;
		var y = 10;

		var id="prop-"+item;
		console.log("id="+id);
		var wrap = $('<div></div>').attr('id', item);
		var url = 'img/'+item+'.png';
		wrap.css('background','transparent url('+url+')');
		console.log(wrap);
		addPropAt(wrap, x,y);
		console.log("prop has been added?")
	}	 
	
}

function addPropAt(div, posX, posY){ ///you could just use the addDancer function since its the same code..
	div.css({
		'position':'absolute',
		'top':posY,
		'left':posX,
	});
	div.addClass("added");
	div.addClass('animated bounceIn');
	div.addClass('propImage');
	div.resizable({
      aspectRatio: 1 / 1
    });
    div.draggable({
            zIndex:100,
            containment:'#canvasWrapper',
            start: function(e, ui) {
		        $(ui.helper).width($(ui.helper).width()+10);
		        $(ui.helper).height($(ui.helper).height()+10);
		    },
		    stop: function(e, ui) {
		        $(ui.helper).width($(ui.helper).width()-10);
		        $(ui.helper).height($(ui.helper).height()-10);
		    }
        });
    //div.resizable();
    div.dblclick(function(){
    	var newText = prompt("Enter text to display in element:");
			if(newText != null){
				$(this).text(newText);
			}
		});
    $("#canvasWrapper").append(div);

    
}

function closePropDialog() {
	$('#choosePropModal').modal('hide'); 
};
