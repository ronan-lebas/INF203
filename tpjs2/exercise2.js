document.addEventListener("DOMContentLoaded", function() {
  const textEdit = document.getElementById("textedit");
  const sendButton = document.getElementById("sendb");
  const chatArea = document.getElementById("tarea");

  // Function to send message
  sendButton.addEventListener("click", function() {
    const message = textEdit.value.trim();
    if (message !== "") {
      sendMessage(message);
      textEdit.value = ""; // Clear the text field
    }
  });

  // Function to send message to chat.php
  function sendMessage(message) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "chat.php?phrase=" + encodeURIComponent(message), true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Successful request
          console.log(xhr.responseText); // Log success message
        } else {
          // Request failed
          console.error("Error:", xhr.statusText);
        }
      }
    };
    xhr.send();
  }

  // Function to fetch and display chat messages
  function fetchChat() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "chatlog.txt", true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Successful request
          const chatLines = xhr.responseText.trim().split("\n");
          // Display the last 10 messages only
          const start = Math.max(0, chatLines.length - 10);
          chatArea.innerHTML = ""; // Clear previous content
          for (let i = start; i < chatLines.length; i++) {
            const p = document.createElement("p");
            p.textContent = chatLines[i];
            chatArea.prepend(p); // Display new message at the top
          }
        } else {
          // Request failed
          console.error("Error:", xhr.statusText);
        }
      }
    };
    xhr.send();
  }

  // Initial fetch of chat messages
  fetchChat();

  // Set interval to refresh chat every second
  setInterval(fetchChat, 1000);
});
