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
	var divContents = $('#canvasWrapper').html();
	var project = new Project();
	project.set("name",$.getUrlVar('var'));
	project.set("user", currentUser);
	$('#project').html($.getUrlVar('var'));
	var formation = new Formation();
	formation.set("project", $.getUrlVar('var'));
	formation.set("user", currentUser);
	formation.set("name", "Untitled Formation 1");
	formation.set("contents", divContents);
	

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
	
}



$('.formation-name').click(function(){
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

// //fields -> {object} where object = 
// function save(formationId, fields){
// 	if(Parse.User.current()){
// 		var query = new Parse.Query(Formation);
// 			query.get(formationId, {
// 				success: function(formation){
// 					for(field in fields)
// 					formation.set("name", result);
// 					formation.save(null, {
// 						success: function(formation) {
// 							console.log("saved successfully");
// 						},
// 						error: function(object, error) {
// 							console.log(error);
// 						}
// 					});
// 				},
// 				error: function(object, error){
// 					console.log(error);
// 				}
// 			});
// 	}
// }
