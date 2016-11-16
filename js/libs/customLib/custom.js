/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


    // parakh user data web service url: http://dev.parakh.com/parakh-new/v1/index.php/getUserByEmail/shiva.shirbhate@infobeans.com;
            //global variables
            var email = getCookie("email");
            var name = getCookie("name");
            var profilePic = getCookie("picture");
            var myInfo;
            if (document.cookie.indexOf("email") >= 0 && document.cookie.indexOf("name") >= 0 && document.cookie.indexOf("pic") >= 0) {
                myInfo = new person(email, name, profilePic);
            } else {
                console.log("error");
                setTimeout(function () {
                    window.location = "http://" + window.location.hostname;
                }, 500);
            }


            function person(email, name, pic) {
                this.email = email;
                this.name = name;
                this.pic = pic;
                return this;
            }

            function getCookie(cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                        return c.substring(name.length, c.length);
                    }
                }
                return "";
            }