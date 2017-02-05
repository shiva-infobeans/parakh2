/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//links for webservice;

if(location.hostname=='dev.parakh.com')
{
	var baseUrl = "http://dev.parakh.com/parakh-new/v1/index.php";
	var secret = 'parakh-revamp-local-key-2016';
}else if(location.hostname== 'dev.parakhnewdesign.com')
{
	var baseUrl = "http://dev.parakhnewdesign.com/parakh-new/v1/index.php";
	var secret = 'parakh-revamp-qa#key!2016';
}else if(location.hostname=='qa.parakhnewdesign.com')
{
	var baseUrl = "http://qa.parakhnewdesign.com/parakh-new/v1/index.php";
	var secret = 'parakh-revamp-qa#key!2016';
}else if(location.hostname=='public.parakh.com')
{
	var baseUrl = "http://public.parakh.com:1808/parakh-new/v1/index.php";
	var secret = 'parakh-revamp-local-key-2016';
}else if(location.hostname=='parakh.infobeans.com')
{
	var baseUrl = "http://parakh.infobeans.com/parakh-new/v1/index.php";
	var secret = 'parakh-revamp-local-key-2016';
}else if(location.hostname=='parakhdev.com')
{
	var baseUrl = "http://parakhdev.com/parakh-new/v1/index.php";
	var secret = 'parakh-revamp-local-key-2016';
}
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
var leadMangerSlider = baseUrl+"/getCountForUnreadNotification/";  // remove this url
var getTopFourRankForCurrentMonth = baseUrl+"/getTopFourRankForCurrentMonth/";  
var resetNotifCount = baseUrl+"/resetNotifCount";
var getTopRankersCalendarWise = baseUrl+"/getTopRankersCalendarWise/";
var getTopRankersProjectWise = baseUrl+"/getTopRankersProjectWise/";
var getAllProjects = baseUrl+"/getAllProjects/";
var getAllInterests = baseUrl+"/getAllInterests/";
var getAllDesignations = baseUrl+"/getAllDesignations/";
var getAllRejectedRequestsByLoginId = baseUrl+"/getAllRejectedRequestsByLoginId/";
var imageCacheUrl =  baseUrl+"/createImageCache";
var getCacheImage =  baseUrl+"/getCacheImage";
var logoutUrl =  baseUrl+"/logout";
var getFourTillNowRankingList = baseUrl+"/getFourTillNowRankingList";
var getATeamMember = baseUrl+"/getATeamMember/";

//updates for google client id and parakh logo (favicon) 
var clientId = "791490125018-lcfs9ha89efjtp09v5u8q38ls05hhinl.apps.googleusercontent.com";
document.getElementById('meta').content = clientId;
document.getElementById('favicon').href = "images/new_favicon.png";


// Parakh title in title bar of the browser
if(document.getElementById('parakhtitle') != null)
document.getElementById('parakhtitle').innerHTML= "Parakh- The Review System";
