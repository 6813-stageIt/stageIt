

function checkForm(){
	var username = $('#rUsername').val().trim();
	var email = $('#rEmail').val().trim();
	var password = $('#rPassword').val().trim();
	var re_password = $('#rConfirmpassword').val().trim();
	if(username=="" || email =="" || password =="" || re_password == ""){
		alert("Please fill out all fields.");
		return;
	}
	if(password!=re_password){
		alert("Passwords do not match, please reenter.");
		$('#rPassword').val("");
		$('#rConfirmpassword').val("");
		return;
	}
	Parse.User.signUp(username, password, { ACL: new Parse.ACL(), "email": email }, {
        success: function(user) {
         console.log("this shit finally worked");
         window.location = "dashboard.html";
        },

        error: function(user, error) {
        	console.log(error);
          alert("Error: " + error.message);
        }
      });
}

function login(){
	var username = $('#username').val().trim();
	var password = $('#password').val().trim();
	if(username=="" || password == ""){
		alert("Please fill out all fields");
		return;
	}
	Parse.User.logIn(username, password, {
		success: function(user) {
		// Do stuff after successful login.
		window.location = "dashboard.html";
		},
		error: function(user, error) {
		// The login failed. Check error to see why.
		alert("Error: "+error.message );
		}
		});
}




