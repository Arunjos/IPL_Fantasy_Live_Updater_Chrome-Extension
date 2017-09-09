// alert("Reached content");
//$('head').append('<link rel="stylesheet" type="text/css" href="/button.css">');
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('button_score.css');
(document.head||document.documentElement).appendChild(style);


$( "body" ).append('<div id="popup1" class="overlay"><div class="popup">	<h2 id="popup-head">Here i am</h2> <a id = "close" class="close">×</a> <div id="popup-content">	Thank<br> to<br> pop<br> me<br> out of that button, but now im done so you can close this window.</div></div></div>');
document.getElementById('close').addEventListener('click', function() {
  closePopOver();
});

function showPopOver(playerName){
  // alert(playerName);
  var statusArrayLcase = ["batting","bowling","fielding","bonus"];
  var statusArrayUcase = ["Batting","Bowling","Fielding","Bonus"];
  document.getElementById('popup-content').innerHTML = "";
  document.getElementById('popup-head').innerHTML = playerName;

  for(var i = 0; i < getApiObj.length; i++){
    //alert(item.name+" - "+idName);
    //alert(item.name+" - "+idName);
    if($.trim(getApiObj[i].name).toUpperCase() ==  String(playerName).toUpperCase()){
      var totalScoreOfPlayer = 0;
      var htmlContent = '<table width="100%" border="0" >';
      for(var q = 0; q < statusArrayLcase.length; q++){
        var score = getApiObj[i][statusArrayLcase[q]];
        if(score == 0){
          continue;
        }
        if($.trim(getApiObj[i].name).toUpperCase() == String(powerPlayerName).toUpperCase()){
          score = score*2;
        }
        var bgcolor;
        if(score == 0){
          bgcolor = "#D2B48C";
        }else if(score < 0){
          bgcolor = "#8B0000";
        }else{
          bgcolor = "#4CAF50";
        }
        htmlContent = htmlContent + '<tr bgcolor= '+bgcolor+'><th style="padding: 5px 10px 5px 5px;" width="100%"><font color="#fff">'+'  '+statusArrayUcase[q]+' Points:'+score+'</font></th></tr>';
        totalScoreOfPlayer+= score;
        $.each(getApiObj[i].splitUp, function(j, objScoreDet) {
          if(objScoreDet.status == statusArrayUcase[q] && (objScoreDet.value != "0" || objScoreDet.key == "Runs"))
          htmlContent = htmlContent + '<tr><td style="text-align:right" width="100%">' + objScoreDet.key+ ' (' + objScoreDet.value + ') </td></tr>';
        });
      }
      // alert(totalScoreOfPlayer);
      htmlContent += '<tr><th rowspan="2" width="100%">TOTAL SCORE: '+totalScoreOfPlayer+'</th></tr>';
      htmlContent += '</table>';
      break;
    }
  }
  document.getElementById('popup-content').innerHTML = htmlContent;
  $('.overlay')
  .css({
    visibility: 'visible',
    opacity: 1
  });
}
var getApiObj
function update_api() {
  getFirebaseApi().done(function (result) {
    // alert("job done:"+result);
    getApiObj = result;
    window.setTimeout("update_api();", 30000);
    update();
  })
}
//CLOSE POP-OVER
function closePopOver() {
  $('.overlay')
  .css({
    visibility: 'hidden',
    opacity: 0
  });
}

var powerPlayerName;
var totalCurrentScore;
function update() {

  // $('.userScore-details').append('<input id="currentscore"  class="button_score" type="button" value="Current score: 999"/>');

  // var jPlayers = new Array();
  if ($(".player-card")[0]){
    totalCurrentScore =0;
    //$(".player-name:first").text("Hello world!");

    $('.player-card').each(function(i, obj) {

      if($( this ).hasClass( "powerplayer" )){
        //alert("powerplayername: "+$( this ).children('.player-name').text());
        powerPlayerName = $( this ).children('.player-name.mhide').text();
      }
      //add api response test section
      var idName = $( this ).children('.player-name.mhide').text();
      idName = $.trim(idName);

      for(var i = 0; i < getApiObj.length; i++){
        //alert(item.name+" - "+idName);
        if($.trim(getApiObj[i].name).toUpperCase() == idName.toUpperCase()){
          //alert(idName);
          var ttlScore = 0;
          ttlScore = (getApiObj[i].batting) + (getApiObj[i].bowling)+(getApiObj[i].fielding)+(getApiObj[i].bonus);
          // $.each(getApiObj[i].splitUp, function(j, objScoreDet) {
          //   ttlScore = ttlScore + objScoreDet.score;
          // });
          // alert("Total:" +ttlScore+"-"+parseInt(getApiObj[i].batting)+"-"+parseInt(getApiObj[i].bowling)+"-"+parseInt(getApiObj[i].fielding)+"-"+parseInt(getApiObj[i].bonus)+"-");
          if(idName.toUpperCase() == String(powerPlayerName).toUpperCase()){
            ttlScore = ttlScore*2;
          }
          totalCurrentScore = totalCurrentScore+ttlScore;
          idName = idName.replace(/\s+/g, '_');
          // var popover = $('<div id="popup"> "popup" </div>');
          // $( this ).find(".player-name").append(popover);
          if (document.getElementById(idName)){
            document.getElementById(idName).value = 'score: '+ttlScore;
          }else{
            var extButton= $('<input id='+idName+'  class="button_score" type="button" value="score: '+ttlScore+'"/>');
            $( this ).find(".player-value").append(extButton);

            document.getElementById(idName).addEventListener('click', function(event) {
              // alert(event.target.id);
              showPopOver(event.target.id.replace(/_/g, ' '));
            });
          }
          document.getElementById(idName).style.backgroundColor = (ttlScore==0)? "#D2B48C" : ((ttlScore>0)? "#4CAF50":"#8B0000");
        }
      }


      //api call set section
      // var json = {};
      // json["Name"] = $( this ).find(".player-name").text();
      // json["Value"] = $( this ).find(".player-value").text();
      // jPlayers.push(json);
      //alert("console");
      //console.log( i + ": " + $( this ).find(".player-name").text() );
    });
    if ($(".currentscore")[0]){
      $('.currentscore').text('Current Score: '+totalCurrentScore+'');
    }
    else{
      if ($(".userScore-details")[0]){
        $(".userScore-details ul:first").append('<li><a class = "currentscore">Current Score: '+totalCurrentScore+'</a></li>');
      }else{
        $(".daily-challenge.mpull").append('<a class = "currentscore">Current Score: '+totalCurrentScore+'</a>');
      }
    }
    $('.currentscore').css('color', (totalCurrentScore==0)? "#D2B48C" : ((totalCurrentScore>0)? "#4CAF50":"#8B0000"));

    // console.log( "Players List: " + JSON.stringify(jPlayers));


  } else {
    //alert("not exisit");
    // window.setTimeout("update();", 1000);
  }
  window.setTimeout("update();", 1000);
}

update_api();
// document.addEventListener('DOMContentLoaded', function() {
//     var button = document.getElementsByClassName("button_score");
//     // onClick's logic below:
//     button.addEventListener('click', function() {
//         showMessage('xxx');
//     });
// });
