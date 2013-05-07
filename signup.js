Parse.initialize("61JEjzEt8GyaXUNUmt80f9BKJWRQD8TZXb6FZcqt", "tkGBjxWtIgmIIcQk5X4h1vxYQj9E8Fbfrnqgi2kG");

function checkForm(){
	var username = $('#rUsername').val();
	var email = $('#rEmail').val();
	var password = $('#rPassword').val();
	var re_password = $('#rConfirmpassword').val();
	if(password!=re_password){
		alert("Passwords do not match");
		$('#rPassword').val("");
		$('#rConfirmpassword').val("");
		return;
	}
	Parse.User.signUp(username, password, { ACL: new Parse.ACL(), "email": email }, {
        success: function(user) {
          alert("this shit finally worked");
          window.location = "index.html";
        },

        error: function(user, error) {
        	console.log(error);
          alert("Error:" + error.code+" "+ error.message+"\n fuck");
        }
      });
}




