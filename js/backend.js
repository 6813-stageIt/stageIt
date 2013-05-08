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
	var projname = decodeURIComponent($.getUrlVar('var'));
	var divContents = $('#canvasWrapper').html();
	$('#currproj').text(projname);
	$("#editStage").mouseenter();
	// var project = new Project();
	// project.set("name",$.getUrlVar('var'));
	// project.set("user", currentUser);
	$('#project').html(projname);
	var formation = new Formation();
	formation.set("project", projname);
	formation.set("user", currentUser);
	formation.set("name", "Untitled Formation 1");
	formation.set("contents", divContents);
	formation.set("stage", saveStage);
	

	// formation.set("parent", project);
	formation.save(null, {
  success: function(formation) {
    // The object was saved successfully.
    console.log("success bitches");
    console.log($('.current.formation-name'));
    $('.current.formation-name').attr("data-id", formation.id);
  },
  error: function(formation, error) {
    // The save failed.
    // error is a Parse.Error with an error code and description.
    console.log("ok.jpg");
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
    populateTable(results);
    }
  },
  error: function(error) {
    bootbox.alert("Error: " + error.code + " " + error.message);
  }
});
}

function populateTable(formations){
  $("#formations").empty();
  for(var i=0; i<formations.length; i++){
    var formation = formations[i];
    var name = formation.get("name");
    var id = formation.id;
    var row = $('<tr></tr>');
    row.append('<td class="formation-name" data-id="'+id+'"><a><label>'+name+'</label></a></td>')
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



$('td.formation-name').click(function(){
	bootbox.dialog("Save changes before switching formations?", [{
	    "label" : "Yes",
	    "class" : "btn-primary",
	    "callback": function() {
	        // Example.show("great success");
	    }
	}, {
	    "label" : "No",
	    "class" : "btn",
	    "callback": function() {
	        Example.show("uh oh, look out!");
	    }
	}, {
	    "label" : "Cancel",
	    "class" : "btn",
	    "callback": function() {
	        Example.show("Primary button");
	    }
	}]);
	formationName = $(this).find('label').text();
	var project = $('#project').html();
	var id =  $(this).attr("data-id");

	var query = new Parse.Query(Formation);
	query.get(id,{
		success: function(formation) {
    // The object was retrieved successfully.
	    console.log("yay");
	    $('#canvasWrapper').html(formation.get("contents"));
  },
  error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and description.
  }
});

});



$('#save').click(function(){
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
	    console.log("yay");
	    // formation.set("user", currentUser);
		formation.set("name", formationName);
		formation.set("contents", divContents);
		formation.set("project", project);
		formation.save(null, {
			success: function(formation) {
				console.log("saved successfully");
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
			$('#projectName').text(result).removeClass("default");
			$('#formation'+formationCounter).find('label').text(result);
			var id = $('.current.formation-name').attr("data-id");
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




