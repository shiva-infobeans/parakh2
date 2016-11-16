/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//links for webservice;
var baseUrl = "http://dev.parakh.com/parakh-new/v1/index.php";
var getUserByEmail = baseUrl+"/getUserByEmail/";
var getUserByLead = baseUrl+"/getUserByLead/";
var getOtherTeamMembers = baseUrl+"/getOtherTeamMembers/";
var getRecentRankingList = baseUrl+"/getRecentRatingingList/";
var getRatingByUser  = baseUrl+"/getRatingByUser/";
var updateProfile = baseUrl+"/updateProfile";
var getRankingList = baseUrl+"/getRankingList/";
var getMyRank = baseUrl+"/getMyRank/";
var rateOtherMember = baseUrl+"/rateOtherMember";
var addRating = baseUrl+"/addRating";
var getAllTeamMembers = baseUrl+"/getAllTeamMembers/";
var addFeedback = baseUrl +"/addFeedback";
var getFeedbackById = baseUrl +"/getFeedbackById/";
var addFeedbackResponse = baseUrl +"/addFeedbackResponce";
var getAllLeads = baseUrl +"/getAllLeads/";
var requestForOne  = baseUrl +"/requestForOne";
var notify = baseUrl+"/getRecentActivity/";
var getTeamMembersRequest = baseUrl+"/getTeamMembersRequest/";
var getUserPendingRequest = baseUrl+"/getUserPendingRequest/";
var requestDecision = baseUrl+"/requestDecision";
var notificationCount = baseUrl+"/getCountForUnreadNotification/";
var resetNotifCount = baseUrl+"/resetNotifCount";


var secret = 'parakh-revamp-local-key-2016';

//updates for google client id and parakh logo (favicon) 
var clientId = "791490125018-lcfs9ha89efjtp09v5u8q38ls05hhinl.apps.googleusercontent.com";
document.getElementById('meta').content = clientId;
document.getElementById('favicon').href = "images/favicon.ico";

// Parakh title in title bar of the browser
if(document.getElementById('parakhtitle') != null)
document.getElementById('parakhtitle').innerHTML= "Parakh- The Review System";
