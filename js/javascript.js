var dancerCounter=0; //used to add id to dancers
var propCounter=0;
var formationCounter=1;
var arrowstartX = 0; //used to keep track of an arrow object beginning and end
var arrowstartY=0;
var arrowendX = 0;
var arrowendY=0;
var drawPath=false;	//flag for whenever draw arrow button is pressed
var startDrawPath=false; 
var lastCanvasState;
var listOfPaths=[];	//list of current paths on canvas
var undoStack=[];	//stack of all actions to undo
var redoStack=[];	//stack of all actions to redo

$("#delete-container").droppable({
	accept:".added",
	hoverClass: "delete-hover",
	tolerance: "touch",
	drop: function (event, ui){
		//console.log(ui.helper.css("height"));
		
		var size = new Object();
		size.height =$(ui.helper).height();
		size.width = $(ui.helper).width();
		tempDrag.size = size;
		tempDrag.undoType="delete_object";
		$(ui.draggable).remove();
		undoStack.push(tempDrag);
		redoStack=[];
		tempDrag=new Object();
		//console.log(ui);
	}
});

$('#projectName').click(function(){
	bootbox.prompt("Enter a name for the formation", function(result){
		if(result!=null){
			$('#projectName').text(result);
			$('#formation'+formationCounter).find('label').text(result);
		}
	});
});

function clearCanvas(clearDancers){
	if(clearDancers){
		$('div.added').remove();
	}
	var path_canvas = document.getElementById('arrow-canvas');
	var path_context = path_canvas.getContext('2d');
	path_context.clearRect(0, 0, path_canvas.width, path_canvas.height);
	$('#notes > textarea').val("");
	
	listOfPaths=[];
	undoStack=[];
	redoStack=[];
	createNewFormation();
}

function createNewFormation(){
	formationCounter++;
	var newRow = $('<tr><td class="current" id="formation'+formationCounter+'"><a><label>Untitled Formation '+formationCounter
	+'</label></a></td></tr>');
	$('table#formations').find('*').removeClass("current");
	newRow.appendTo($('#formations tbody'));
	$('#projectName').text("Untitled Formation "+formationCounter);
}

$('#newFormation').click( function(){
	if($('div.added').length>0){
		bootbox.dialog("Would you like to keep the dancers on the stage in the next formation?", 
			[
			{
		    "label" : "Yes",
		    "class" : "btn-primary",
		    "callback": function() {
		        clearCanvas(false);
		    }
		}, {
		    "label" : "No",
		    "class": "btn",
		    "callback": function() {
		        clearCanvas(true);
		    }
		},{
			"label":"Cancel",
			"class":"btn"
		}]);
	// var formationNum = $('#formations').length+1;
	// $('<tr><td class="current" id="formation'formationNum+'"><a><label>Untitled Formation '+formationNum
	// 	+'</label></a></td></tr>');
	}
	else{
		bootbox.confirm("Create a new formation?", function(result){
			if(result){
				clearCanvas(true);
			}
		})
	}

});
$('#undo').click( function(){
	//console.log("undo");
	
	if(undoStack.length==0){
		//disable undo stack
	}
	else{
		var action = undoStack.pop();
		//console.log(action.undoType);
		switch(action.undoType){
			case "arrow": //means arrow
				action.object=listOfPaths.pop();
				redrawPaths();$(ui.draggable).remove();
				break;
			case "add":
				//console.log(action.object);
				action.object.remove();
				
				break;
			case "delete_object":
				//console.log(action);
				div = action.object.helper;
				div = reAddObject(div, action);
				div.css({
					'position':'absolute',
					'top':action.oldPos.top,
					'left':action.oldPos.left,
					'width':action.size.width-10,
					'height':action.size.height-10,
				});
				console.log(action.size.width-10);
				$("#canvasWrapper").append(div);
				//console.log("delete has been undone");
				break;
			case "delete_arrow":
				alert("this action has not be implemented, sorry");
				break;
			case "drag":
				//console.log("about to undo drag");
				div = action.object.helper;
				div.css({
					'position':'absolute',
					'top':action.oldPos.top,
					'left':action.oldPos.left,
				});
				
				//$("#canvasWrapper").append(action.object.helper);
				//console.log(action.object);
				break;
			case "resize":
				//console.log("about to undo resize");
				div = action.object.helper;
				div.css({
					'position':'absolute',
					'width':action.oldSize.width,
					'height':action.oldSize.height,
				});
			case "rename":
				console.log(action.object);
				action.object.find('.text').text(action.oldName);
				//action.object[0].innerHTML(action.oldName);
				break;
		}
		redoStack.push(action);
	}	
})
$('#redo').click( function(){
	//console.log("redo");
	
	if(redoStack.length==0){
		//disable redoButton
	}
	else{
		var action = redoStack.pop();
		//console.log(action.undoType);
		switch(action.undoType){
			case "arrow": //means arrow
				listOfPaths.push(action.object);
				redrawPaths();
				break;
			case "add":
				//action.object.remove();
				div = action.object;
				//console.log(action);
				div = reAddObject(div, action);
				//this is QUICKFIX, TODO:fix this image
						div.css({
							'width':action.size.width,
							'height':action.size.height,
						});
				//end quickfix
				$("#canvasWrapper").append(div);
				//console.log(action);
				//console.log("add has been redone");
				break;
			case "delete_object":
				//console.log(action.object);
				action.object.helper.remove();
				break;
			case "delete_arrow":
				alert("this action has not be implemented, sorry");
				break;
			case "drag":
				//console.log("about to undo drag");
				//action.object.helper.offsetTop=action.oldPos.top;
				//action.object.helper.offsetLeft=action.oldPos.left;
				div = action.object.helper;
				div.css({
					'position':'absolute',
					'top':action.newPos.top,
					'left':action.newPos.left,
				});
				
				//$("#canvasWrapper").append(action.object.helper);
				//console.log(action.object);
				break;
			case "resize":
				//console.log("about to undo resize");
				div = action.object.helper;
				div.css({
					'position':'absolute',
					'width':action.newSize.width,
					'height':action.newSize.height,
				});
			case "rename":
				console.log(action.object);
				action.object.find('.text').text(action.newName);
				break;
		}
		undoStack.push(action);
	}	
})
$('.option li').click(function(){
	var option = $(this).parent().attr('data-option');
	$(this).addClass(option+'-selected').siblings().removeClass(option+'-selected');
});

$('#addDancersModal .option img').click(function(){
	var shape = $(this).parent().attr('id');
	var color = $('input[name="color"]:radio:checked').attr('value');
	$('#preview-img').attr("src", "img/"+shape+'-'+color+'.png').css("border", "none");
})

$('#addDancersModal input[type="radio"]').click(function(){
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


$('#spinner_numDancers').keyup(function (e) {
    	if (e.keyCode == 13 && $("#spinner_numDancers")){ //enter and spinner field in focus
    		addDancers();
    	}
    });
	
//path/arrow functions... we probably need to decide on a name, I used them interspersed...
function drawPathPrompt(){
	if(!drawPath){
		var prompt = "<div id=\"pathNotif\"> Draw an arrow by clicking and dragging on the stage<br> <button id=\"endPath\" onclick=\"endPath()\"> Cancel</div>"
		//$('#canvasWrapper').append(prmopt);
		$(prompt).appendTo("#canvasWrapper").addClass('animated fadeIn');
		////console.log(prompt);
		document.getElementById('straightPathTool').disabled=true;
		drawPath=true;
		disableDraggableObjects(true);
	}
}
function endPath(){
	(elem=document.getElementById("pathNotif")).parentNode.removeChild(elem);
	//(elem=document.getElementById("cancelPath")).parentNode.removeChild(elem); removed whole div, not needed
	document.getElementById('straightPathTool').disabled=false;
	drawPath=false;
	////console.log("cancel path");
	disableDraggableObjects(false);
}
function redrawPaths(){

	var canvas = document.getElementById('arrow-canvas');
		var context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		for(var i=0; i<listOfPaths.length; i++){
			drawArrow(listOfPaths[i]);
		}
		////console.log(listOfPaths);
}
$('#arrow-canvas').mousedown(function(e){
	////console.log('mousedown');
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
	//////console.log('mousemove' + e.pageX+' ' +e.pageY);
	if(startDrawPath&&drawPath){
			redrawPaths();
		move=new Object();
		move.type="straight";
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
		////console.log('cheight= '+canvas.height);
		////console.log('cwidth= '+canvas.width);
		if(x>0&&y>0&&x<canvas.width&&y<canvas.height){
			move.startx = arrowstartX;
			move.starty = arrowstartY;
			move.endx = e.pageX;
			move.endy = e.pageY;
			if(Math.abs(move.startx-move.endx)>5&&Math.abs(move.starty-move.endy)>5){
				move.type="straight";
				drawArrow(move);
				listOfPaths.push(move);
				//console.log('path pushed');
				move.undoType="arrow";
				undoStack.push(move);
				redoStack=[];
			}else{console.log('not moved');}
			
			endPath();
		}
		else{
			endPath();
			////console.log("path canceled");	
			////console.log("e.pageX= "+e.pageX);
			////console.log("e.pageY= "+e.pageY);
		}
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





// things that need to be reset when modals are hidden
$('#chooseStage').on('hidden', function(){
	$('#stages li').removeClass('stage-selected');
	$('#stageHelper').css("display", "none");
	$('.hidden').css("display", "inline");
	////console.log("#chooseStage");
});

$('#choosePropModal').on('hidden', function(){
	$('#props li').removeClass('prop-selected');
	$('#propHelper').css("display", "none");
	////console.log("#choosePropModal");
});

$('#chooseArrangementModal').on('hidden', function(){
	//console.log("#chooseArrangmentModal closed");
});

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
		case 'circle':
			drawCircleStage();
			break;
		case 'oval':
			drawOvalStage();
			break;
		case 'trapezoidSmallFront':
			drawTrapezoidSmallFrontStage();
			break;
		case 'trapezoidBigFront':
			drawTrapezoidBigFrontStage();
			break;
	}
}

function drawRectangleStage(){
	var canvas = document.getElementById('canvas-stage');
	var ctxt = canvas.getContext('2d');
	ctxt.clearRect(0, 0, canvas.width, canvas.height);
	ctxt.beginPath();
	ctxt.rect(50, 0, canvas.width-100, canvas.height-25);
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
	var x = canvas.width-285;
	var y = 0;
	var radius = canvas.width/2-10;
	var startAngle = 0; endAngle = Math.PI;
	ctxt.arc(x,y,radius, startAngle,endAngle);
	ctxt.closePath();
	ctxt.lineWidth = 1;
	ctxt.fillStyle = 'white';
	ctxt.fill();
	ctxt.strokeStyle = 'gray';
	ctxt.stroke();	
}
function drawCircleStage(){
	var canvas = document.getElementById('canvas-stage');
	var ctxt = canvas.getContext('2d');
	ctxt.clearRect(0, 0, canvas.width, canvas.height);
	ctxt.beginPath();
	var x = canvas.width/2;
	var y = canvas.height/2;
	var radius = canvas.width/4;
	var startAngle = 0; endAngle = Math.PI*2;
	ctxt.arc(x,y,radius, startAngle,endAngle);
	ctxt.closePath();
	ctxt.lineWidth = 1;
	ctxt.fillStyle = 'white';
	ctxt.fill();
	ctxt.strokeStyle = 'gray';
	ctxt.stroke();	
	//TODO: why is it an oval..?
}
function drawOvalStage(){
	var canvas = document.getElementById('canvas-stage');
	var ctxt = canvas.getContext('2d');
	ctxt.clearRect(0, 0, canvas.width, canvas.height);
	ctxt.beginPath();
	var centerX = canvas.width/4;
	var centerY = canvas.height/2;
	var radius = canvas.width/4;
	ctxt.scale(2,1);
	var startAngle = 0; endAngle = Math.PI*2;
	ctxt.arc(centerX, centerY, radius, startAngle, endAngle, false);
	ctxt.lineWidth = 1;
	ctxt.fillStyle = 'white';
	ctxt.fill();
	ctxt.strokeStyle = 'gray';
	ctxt.stroke();	
}
function drawTrapezoidSmallFrontStage(){
	var canvas = document.getElementById('canvas-stage');
	var ctxt = canvas.getContext('2d');
	ctxt.clearRect(0, 0, canvas.width, canvas.height);
	ctxt.beginPath();

	var base0 = canvas.width;
	var base1 = 0;
	var top0 = canvas.width-100;
	var top1 = 100;
	var height = canvas.height-25;

  	ctxt.moveTo(top0,height);
  	ctxt.lineTo(top1,height);
  	ctxt.lineTo(base1,0);
  	ctxt.lineTo(base0,0);
  	ctxt.closePath();

	ctxt.lineWidth = 1;
	ctxt.fillStyle = 'white';
	ctxt.fill();
	ctxt.strokeStyle = 'gray';
	ctxt.stroke(); 
}
function drawTrapezoidBigFrontStage(){
	var canvas = document.getElementById('canvas-stage');
	var ctxt = canvas.getContext('2d');
	ctxt.clearRect(0, 0, canvas.width, canvas.height);
	ctxt.beginPath();

	var base0 = canvas.width;
	var base1 = 0;
	var top0 = canvas.width-100;
	var top1 = 100;
	var height = canvas.height-25;

  	ctxt.moveTo(base0,height);
  	ctxt.lineTo(base1,height);
  	ctxt.lineTo(top1,0);
  	ctxt.lineTo(top0,0);
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
		if(arrow.type=="straight"){
			var offset=$("#arrow-canvas").offset();
			starty=arrow.starty-offset.top;
			startx=arrow.startx-offset.left;
			endy=arrow.endy-offset.top;
			endx=arrow.endx-offset.left;
							
			var canvas = document.getElementById('arrow-canvas');
					////console.log('awesomesauce');
					////console.log(startx+endy);
						var context = canvas.getContext('2d');
					
					ratio=10;
					context.strokeStyle = 'rgba(0, 0, 0, .5)'; //black arrow
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
		else if (arrow.type="freeform"){
			
		}
		
}


function addDancers(){
	if(!$('.dancer-selected').length > 0){
		$('#dancerHelper').css("display", "inline");
	}
	else{
		var shape = $('.dancer-selected').attr('id');
		////console.log(shape);
		var color = $('input[name=color]:radio:checked').attr('value');
		////console.log(color);
		var numDancers = $("#spinner_numDancers").val();
		////console.log(numDancers);
		closeAddDancersDialog();	
		var x = 30;
		var y = 10;
		for(var i=0; i < numDancers; i++){
			var id="dancer-"+dancerCounter;
			dancerCounter++;
			var wrap = $('<div><div class="text"></div></div>').attr('id', id);
			var img = $('<img>').attr('src', 'img/'+shape+'-'+color+'.png');
			wrap.append(img);
			// wrap.css('background','transparent url('+url+')');
			if(y>440){
				y=10;
				x+=60;		
			}
			addObjectAt(wrap, x,y, 'shape');
			y+=60; //wont work for large amounts, add handling
		}

	}	 

}

function reAddObject(div, action){
	div.resizable({
		  aspectRatio: 1 / 1,
		  maxWidth: 140,
		  addClasses: false,
		  start:function(e,ui){ 
			beginResize(ui);
		  },
		  stop:function(e,ui){
			endResize(ui);
		  },
		});
	div.draggable({
			zIndex:100,
			containment:'#canvasWrapper',
			grid: [ 20,20 ],
			start: function(e, ui) {
				$(ui.helper).width($(ui.helper).width()+10);
				$(ui.helper).height($(ui.helper).height()+10);
				//console.log(ui);
				beginDrag(ui);
			},
			stop: function(e, ui) {
				$(ui.helper).width($(ui.helper).width()-10);
				$(ui.helper).height($(ui.helper).height()-10);
				endDrag(ui);
			}
		});
	console.log(div);
	if(div.hasClass("shape")){
		console.log('newShape');
		
	    div.dblclick(function(){
	    	action = new Object();
			action.object = $(this);
			action.oldName = $(this)[0].innerText;
			console.log("rename");
	    	var newText = prompt("Enter text to display in element:");
				if(newText != null){
					$(this).find('.text').text(newText);
				}
			action.newName = newText;
			action.undoType = "rename";
			undoStack.push(action);
			redoStack=[];
		})
	}
	return div;
}
function addObjectAt(div,posX,posY,newClass){
	div.css({
		'position':'absolute',
		'top':posY,
		'left':posX,
	});
	div.addClass("added");
	div.addClass('animated bounceIn');
	div.addClass(newClass);
	div.resizable({
      aspectRatio: 1 / 1,
      maxWidth: 140,
      addClasses: false,
	  start:function(e,ui){ 
		beginResize(ui);
	  },
	  stop:function(e,ui){
		endResize(ui);
	  },
    });
    div.draggable({
            zIndex:100,
            containment:'#canvasWrapper',
            grid: [ 20,20 ],
            start: function(e, ui) {
		        $(ui.helper).width($(ui.helper).width()+10);
		        $(ui.helper).height($(ui.helper).height()+10);
				//console.log(ui);
				beginDrag(ui);
		    },
		    stop: function(e, ui) {
		        $(ui.helper).width($(ui.helper).width()-10);
		        $(ui.helper).height($(ui.helper).height()-10);
				endDrag(ui);
		    }
        });
    if(newClass=="shape"){
	    div.dblclick(function(){
	    	action = new Object();
			action.object = $(this);
			action.oldName = $(this)[0].innerText;
			console.log("rename");
	    	var newText = prompt("Enter text to display in element:");
				if(newText != null){
					$(this).find('.text').text(newText);
				}
			action.newName = newText;
			action.undoType = "rename";
			undoStack.push(action);
			redoStack=[];
		})
	}
    $("#canvasWrapper").append(div);
	action = new Object();
	
	action.object=div;
	action.undoType="add";
	position=new Object();
	position.top=posY;
	position.left=posX;
	undoStack.oldPos=position;
	size=new Object;
	size.width = div.css('width');
	size.height = div.css('height');
	action.originSize=size;
	action.size = size;
	undoStack.push(action);
	redoStack=[];
	//console.log(action);
}
function closeAddDancersDialog() {
	$('#addDancersModal').modal('hide'); 
};



function disableDraggableObjects(foo){
	
	if(foo){
		$('#arrow-canvas').css({'pointer-events':'auto', 'cursor':'crosshair'});
	}
	else{
		$('#arrow-canvas').css('pointer-events','none');
		// ////console.log('everything restored');
	}
}

//function called when ok button is clicked on props modal
function addProp() {
	//check if there is something selected
	////console.log(".prop-selected="+$('.prop-selected'));
	if(!$('.prop-selected').length > 0){
		$('#propHelper').css("display", "inline");
	}
	else{
		var item = $('.prop-selected').attr('id');
		////console.log(item);

		closePropDialog();
		var x = 30;
		var y = 10;

		var id="prop-"+propCounter;
		propCounter++;
		////console.log("id="+id);
		var wrap = $('<div></div>').attr('id', id); //id's need to be unique
		var img = $('<img>').attr('src', 'img/'+item+'.png');
		wrap.append(img);
		////console.log(wrap);
		addObjectAt(wrap, x,y, 'propImage');
		////console.log("prop has been added?")
	}	 
	
}
var tempDrag=new Object();
function beginDrag(ui){
	//also the beginning of the delete undo path
	tempDrag.undoType="drag";
	tempDrag.oldPos =ui.position;
	
	//console.log(ui);
	//console.log("beginDrag");
	tempDrag.object=ui;
}
function endDrag(ui){
	tempDrag.object=ui;
	tempDrag.newPos=ui.position;
	undoStack.push(tempDrag);
	redoStack=[];
	tempDrag=new Object();
	//console.log("endDrag");
	////console.log(undoStack[undoStack.length-1]);
}
var tempResize=new Object();
function beginResize(ui){
	tempResize.undoType="resize";
	//console.log(ui);	
	tempResize.oldSize =ui.originalSize;
}
function endResize(ui){
	tempResize.object=ui;
	tempResize.size=ui.size;
	tempResize.newSize=ui.size;
	undoStack.push(tempResize);
	redoStack=[];
	tempResize=new Object();
	////console.log(undoStack[undoStack.length-1]);
}

function closePropDialog() {
	$('#choosePropModal').modal('hide'); 
};

function arrangeDancers(){
	var arrangement = $('input[name=arrangement]:radio:checked').attr('value');
	closeArrangeDialog();
	alert("At this time, your dancers could not be automatically arranged in a '"+arrangement+"' format. We appologize for any inconvenience.", closeArrangeDialog());
}	 


function closeArrangeDialog() {
	$('#arrangeDancersModal').modal('hide'); 
};
