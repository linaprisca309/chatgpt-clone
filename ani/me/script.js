const input = document.getElementById("input");
const chat = document.getElementById("chat");

function sendMessage(){
  if(input.value.trim() === "") return;

  // User Message
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = input.value;
  chat.appendChild(userMsg);

  chat.scrollTop = chat.scrollHeight;

  // Fake AI Reply
  setTimeout(()=>{
    const botMsg = document.createElement("div");
    botMsg.className = "message bot";
    botMsg.textContent = "This is a demo AI response.";
    chat.appendChild(botMsg);
    chat.scrollTop = chat.scrollHeight;
  },700);

  input.value = "";
}

// Send with Enter key
input.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    sendMessage();
  }
});
