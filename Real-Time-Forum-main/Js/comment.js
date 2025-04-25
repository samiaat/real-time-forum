import * as tem from "./template.js";

export function Comment(Id) {
  var postId = parseInt(Id)
  console.log(postId)
  console.log(typeof(postId))
  let userName = document.querySelector(".Username").textContent;
  let profileImage = document
    .querySelector(".ProfilePhoto")
    .getAttribute("src")
    .split("/")[2];
  var commentId;
  let CommentMessage = document.getElementById(`CommentMessage${postId}`);
  var message = CommentMessage.value;

  if (message.length > 200) {
    alert("Comment cannot be more than 200 characters.");
    return;
  } else if (message.trim().length === 0) {
    alert("Empty Comments are not allowed");
  } else {
    fetch("/CommentHandler", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        postId: parseInt(postId),
        username: userName,
        profileImage: profileImage,
      }),
    })
      .then(function (response) {
        if (response.ok) {
          CommentMessage.value = ""; // Reset the input field
          // Handle the response from the backend if needed
          return response.json(); // Parse the response body as JSON
        } else {
          throw new Error("Error sending message.");
        }
      })
      .then(function (data) {
        commentId = data.CommentId;
        const comment = {
          CommentId: commentId,
          UserName: userName,
          Text: message,
          Time: new Date().toLocaleString(),
          CLike: 0,
          CDislike: 0,
          ProfileImage: profileImage,
        };
       var com = tem.commentTemplate(comment)
  
       var container = document.getElementById(`Comment${postId}`)
       const temp = document.createElement('div')
       temp.innerHTML = com
       const newn = temp.lastChild
      container.appendChild(temp)
      })
      .catch(function (error) {
        console.error("Error sending message:", error);
      });
  }
}

export function HandleCommentLike(clickedCheckbox, checkboxName) {
  const checkboxValue = clickedCheckbox.value;
  const isChecked = clickedCheckbox.checked;
  if (
    checkboxName === "Dislike" &&
    document.getElementById(`CLike${checkboxValue}`).checked === true
  ) {
    clickedCheckbox.checked = false;
  } else if (
    checkboxName === "Like" &&
    document.getElementById(`CDislike${checkboxValue}`).checked === true
  ) {
    clickedCheckbox.checked = false;
  } else {
    fetch("/CommentLikeHandle", {
      method: "POST",
      body: JSON.stringify({
        RequestType: "like",
        Type: checkboxName,
        ID: parseInt(checkboxValue, 10),
        Checked: isChecked,
      }),
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.error("Error:", error));
    //Store Value
    const id = clickedCheckbox.getAttribute("id");
    const LikeNum = document.getElementById(`Num${id}`);

    // Get the current text content and parse it as an integer
    let currentValue = parseInt(LikeNum.textContent);
    if (isChecked === true) {
      // Set the updated value as the new text content of the element
      LikeNum.textContent = (currentValue + 1).toString();
    } else {
      LikeNum.textContent = (currentValue - 1).toString();
    }
    document
      .getElementById(`C${checkboxName}SVG${checkboxValue}`)
      .classList.toggle(`C${checkboxName}SVGClicked`);
  }
}



