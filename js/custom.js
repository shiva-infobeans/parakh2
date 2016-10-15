/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var teamMemberId = -10;
var email = "";
var profilePic = "https://lh6.googleusercontent.com/-131yApYhswk/AAAAAAAAAAI/AAAAAAAAAAA/APaXHhTuxvV1aILgUzpbSL_d6_GGpn1BXw/s96-c/photo.jpg";
function person(email, name, pic) {
    this.email = email;
    this.name = name;
    this.pic = pic;
    return this;
}
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    email = profile.getEmail();
    profilePic = profile.getImageUrl();
    name = profile.getName();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.

}


function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        window.location = "http://dev.parakh.com/index.html";
    });
}
