//pointer for our database
var commentListRef = new Firebase('https://wsse.firebaseio.com')

//pointer for container of name/scores
var htmlForPath = {}


//is passed in a snapshot of the database of the comment's name/score
function handleCommentAdded(commentSnapshot, prevComment) {
  var newCommentRow = $('<tr/>')

  //take that snapshot, grab it's name, and append it to the table
  newCommentRow.append($('<td/>').append($("<em/>").text(commentSnapshot.val().name)))
  //same thing with the score
  newCommentRow.append($('<td/>').text(commentSnapshot.val().score))

  //adds snapshot's name to container. this creates a reference between firebase and html
  htmlForPath[commentSnapshot.name()] = newCommentRow;

//handles case when comment already exists
  if(prevComment === null){
    $("#all_comments").append(newCommentRow)
  }
  else {
    var lowerCommentRow = htmlForPath[prevComment]
    //add the new comment row above the old one
    lowerCommentRow.before(newCommentRow)
  }
}

//callback for score added, updates fb
commentListRef.on('child_added', function(newCommentSnapshot, prevComment){
  handleCommentAdded(newCommentSnapshot,prevComment)
})

//update firebase upon enter
$("form#commentForm").keypress(function(event){
  if (event.keyCode == 13){
    var newScore = Number($("#voteInput").val())
    var name = $("#contentInput").val()
    $("#voteInput").val("")

    if (name.length === 0)
      return;

  var commentScoreRef = commentListRef.child(name)

  commentScoreRef.setWithPriority({name:name, score:newScore}, newScore)
    }
  })

function handleCommentRemoved(commentSnapshot) {
  var removedCommentRow = htmlForPath[commentSnapshot.name()]
  removedCommentRow.remove()
  delete htmlForPath[commentSnapshot.name()]
}

commentListRef.on('child_removed', function (oldCommentSnapshot) {
  handleCommentRemoved(oldCommentSnapshot)
})



console.log("sanity check")