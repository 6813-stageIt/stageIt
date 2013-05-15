Parse.initialize("61JEjzEt8GyaXUNUmt80f9BKJWRQD8TZXb6FZcqt", "tkGBjxWtIgmIIcQk5X4h1vxYQj9E8Fbfrnqgi2kG");
var Formation = Parse.Object.extend("Formation");
var Project = Parse.Object.extend("Project");
var currentUser = Parse.User.current();

//This script extracts parameters from the URL
//from jquery-howto.blogspot.com

$.extend({
    getUrlVars : function() {
        var vars = [], hash;
        var hashes = window.location.href.slice(
                window.location.href.indexOf('?') + 1).split('&');
        for ( var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar : function(name) {
        return $.getUrlVars()[name];
    }
});

if($.getUrlVar('var')){
	// $(document).ready(function(){
	// 	$("#editStage").mouseenter();
	// });
	var projname = decodeURIComponent($.getUrlVar('var'));
	var divContents = $('#canvasWrapper').html();
	$('#currproj').text(projname);
	$('#project').html(projname);
	var formation = new Formation();
	formation.set("project", projname);
	formation.set("user", currentUser);
	formation.set("name", "Untitled Formation 1");
	formation.set("contents", divContents);
	formation.set("stage", saveStage);
	formation.save(null, {
		success: function(formation) {
    		populateTable([formation]);
		}
});
	
	
} else if ($.getUrlVar('open')){
	var projname = decodeURIComponent($.getUrlVar('open'));
	var divContents = $('#canvasWrapper').html();
	$('#currproj').text(projname);
	getFormations(projname);
}

function saveStagetoParse(stage){
	var query = new Parse.Query(Formation);
	query.equalTo("user", Parse.User.current());
	query.equalTo("project", $('#currproj').text());
	query.find({
	  success: function(results) {
	    // console.log(results);
	    if(results.length > 0){
	    updateStage(results, stage);
	    }
	  },
	  error: function(error) {
	    bootbox.alert("Error: " + error.code + " " + error.message);
	  }
	});

}

function updateStage(formations, stage){
	for(var i=0; i<formations.length; i++){
    var formation = formations[i];
    formation.set("stage", stage);
    formation.save(null,{
		success: function(formation) {
			console.log("yey");
		},
		error: function(formation, error) {
			bootbox.alert("Error: " + error.code + " " + error.message);
			}
		});
	}
}

function getFormations(projectName){
  // var Project = Parse.Object.extend("Formation");

  var query = new Parse.Query(Formation);
  query.equalTo("user", Parse.User.current());
  query.equalTo("project", projectName);
  query.ascending("createdAt");
  // query.limit(20);
  query.find({
  success: function(results) {
    console.log(results);
    if(results.length > 0){
		$("#formations").empty();
		formationCounter = results.length;
		populateTable(results);
		renderStage(results[0]);
		$('#formations tr:first').find("a").addClass("current");
    }
  },
  error: function(error) {
    bootbox.alert("Error: " + error.code + " " + error.message);
  }
});
}

function createNewFormation(){
	formationCounter++;

	
	var formation = new Formation();
	formation.set("project", $("#currproj").text());
	formation.set("user", Parse.User.current());
	formation.set("name", "Untitled Formation "+formationCounter);
	formation.set("contents", $("#canvasWrapper").html());
	formation.set("stage", saveStage);
	// formation.set("parent", project);
	formation.save(null, {
		success: function(formation) {
			populateTable([formation]);
	  }
	});
}

function populateTable(formations){
  for(var i=0; i<formations.length; i++){
    var formation = formations[i];
    var name = formation.get("name");
    $('#projectName').text(name)
    var id = formation.id;
    var row = $('<tr></tr>');
    var a = $('<a data-id="'+id+'"><label>'+name+'</label></a>').click(function(){
    	var old = $('#formations td').find('a');//.removeClass("current");
    	var self = $(this).addClass("current");
	bootbox.dialog("Save changes before switching formations?", [{
	    "label" : "Yes",
	    "class" : "btn-primary",
	    "callback": function() {
	    	saveCurrentFormation();
	        // Example.show("great success");
	        var query = new Parse.Query(Formation);
			query.get(id,{
				success: function(formation) {
		    // The object was retrieved successfully.
			    // $('#canvasWrapper').html(formation.get("contents"));
			    old.removeClass("current");
			    self.addClass("current");
			    renderStage(formation);
		  },
		  error: function(object, error) {
		    // The object was not retrieved successfully.
		    // error is a Parse.Error with an error code and description.
		  }
		});

	    }
	}, {
	    "label" : "No",
	    "class" : "btn",
	    "callback": function() {
	        var query = new Parse.Query(Formation);
			query.get(id,{
				success: function(formation) {
		    // The object was retrieved successfully.
			    // console.log("yay");
			    old.removeClass("current");
			    self.addClass("current");
			    renderStage(formation);
			    // $('#canvasWrapper').html(formation.get("contents"));
			    }
		});
		}
		    
	}, {
	    "label" : "Cancel",
	    "class" : "btn",
	    "callback": function() {
	        
	    }
	}]);
	
    }); ///end of click function
    row.append($('<td></td>').append(a));
    $('#formations').append(row);
  }
}

function renameProject(formations, newName){
	for(var i=0; i<formations.length; i++){
		var formation = formations[i];
		formation.set("project", newName);
		formation.save(null,{
			success: function(formation) {
				console.log("yey");
			},
			error: function(formation, error) {
				bootbox.alert("Error: " + error.code + " " + error.message);
				}
			});
	}
}

function renderStage(formation){
	console.log(formation.get("contents"));
	console.log(formation.get("stage"));
	$('#canvasWrapper').html("").append(formation.get("contents"));
	var stage = formation.get("stage");
	drawStageShape(stage);
	$('#projectName').text(formation.get("name"));

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
	saveStage = stage;
	saveStagetoParse(stage);
}

function renameProjectonParse(oldName, newName){
	var Project = Parse.Object.extend("Project");
  var query = new Parse.Query(Project);
  query.equalTo("name", name);
}

$('#rename').click(function(){
	bootbox.prompt("Enter a new name for the project.", function(result){
		if(result && result.trim().length>0){
			validateProject(result.trim());		
		}
	})
});

function validateProject(name){
  var Project = Parse.Object.extend("Project");
  var query = new Parse.Query(Project);
  query.equalTo("name", name);
  query.equalTo("user", Parse.User.current());
  query.first({
      success: function(object) {
        if (object) { //if there exists a project with this name, stop. 
          console.log(object);
          bootbox.alert("<strong>Error:</strong> You already have a project with that name. Please choose another name!");
        } else{ //get formations and rename them.
          var newQuery = new Parse.Query(Formation);
			newQuery.equalTo("user", Parse.User.current());
			newQuery.equalTo("project", $('#currproj').text());
			// query.limit(20);
			newQuery.find({
				success: function(results) {
					console.log(results);
					console.log(name);
					if(results.length > 0){
						renameProject(results,name);
					}
				},
				error: function(error) {
					bootbox.alert("Error: " + error.code + " " + error.message);
				}
			});
			var projQuery = new Parse.Query(Project);
			projQuery.equalTo("user", Parse.User.current());
			projQuery.equalTo("name", $('#currproj').text());
			projQuery.first({
				success: function(object) {
					if(object){
						console.log("renaming actual project");
						object.set("name", name);
						object.save();
					}
				},
				error: function(object, error) {
					bootbox.alert("Error: " + error.code + " " + error.message);
				}
			});
		$('#currproj').text(name);
		// window.location = "index.html?open="+encodeURIComponent(name);	
        }
      },
      error: function(error) {
        bootbox.alert("An unknown error occurred; Please try again later.");
      }

    });
}




function saveCurrentFormation(){
	var divContents = $('#canvasWrapper').html();
	var formationName = $('#projectName').text();
	var project = $('#project').html();
	var id =  $(this).attr("data-id");
	var currentUser = Parse.User.current();
	if(currentUser){
	var query = new Parse.Query(Formation);
	query.get(id,{
		success: function(formation) {
    // The object was retrieved successfully.
	    console.log("yay-from saveCurrentFormation");
	    // formation.set("user", currentUser);
		formation.set("name", formationName);
		formation.set("contents", divContents);
		formation.set("project", project);
		formation.save(null, {
			success: function(formation) {
				console.log("saved successfully");
				showFeedback("save");
			},
			error: function(object, error) {
				console.log(error);
			}
		});
	
		},
		error: function(object, error) {
		// The object was not retrieved successfully.
		// error is a Parse.Error with an error code and description.
		}
	});
}
}


$('#save').click(function(){
	var divContents = $('#canvasWrapper').html();
	console.log(divContents);
	var formationName = $('#projectName').text();
	var project = $('#project').html();
	var id =  $(this).attr("data-id");
	var currentUser = Parse.User.current();
	if(currentUser){
	var query = new Parse.Query(Formation);
	query.get(id,{
		success: function(formation) {
    // The object was retrieved successfully.
	    console.log("yay");
	    // formation.set("user", currentUser);
		formation.set("name", formationName);
		formation.set("contents", divContents);
		formation.set("project", project);
		formation.save(null, {
			success: function(formation) {
				// console.log("saved successfully");
				formation.set("contents",$('#canvasWrapper').html());
				formation.save();
				showFeedback("save");
				// alert(formation.get("contents"));
			},
			error: function(object, error) {
				console.log(error);
			}
		});
	
		},
		error: function(object, error) {
		// The object was not retrieved successfully.
		// error is a Parse.Error with an error code and description.
		}
	});
}
});

$('#projectName').click(function(){
	console.log("merp");
	bootbox.prompt("Enter a name for the formation", function(result){
		if(result!=null){
			$('#projectName').text(result.trim()).removeClass("default");
			// $('#formation'+formationCounter).find('label').text(result);
			// var id = $('.current.formation-name').attr("data-id");
			if(currentUser){
				var query = new Parse.Query(Formation);
				query.get(id, {
					success: function(formation){
						formation.set("name", result);
						formation.save(null, {
							success: function(formation) {
								console.log("saved successfully");
							},
							error: function(object, error) {
								console.log(error);
							}
						});
					},
					error: function(object, error){
						console.log(error);
					}
				});
			}
		}
	});
});

$('#delete').click(function(){
	bootbox.dialog("Are you sure you want to delete this formation?<br>This action cannot be undone.", [{
	    "label" : "Yes",
	    "class" : "btn-danger",
	    "callback": function() {
	    	console.log("would have been deleted here");
	    }
	},  {
	    "label" : "Cancel",
	    "class" : "btn",
	    "callback": function() {
	       console.log("delete cancelled"); 
	    }
	}]);
});




