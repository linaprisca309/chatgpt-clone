const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.querySelector('.send-btn');
const toggle = document.getElementById('toggle');
const newChatBtn = document.querySelector('.new-chat-btn');
const chatList = document.getElementById('chat-list');
const sidebarToggleBtn = document.querySelector('.sidebar-toggle-btn');
const sidebar = document.querySelector('.sidebar');

let chatHistory = [];
let currentChatId = 'default';

// Initialize dark mode based on system preference or saved preference
function initializeDarkMode() {
  const savedDarkMode = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDarkMode = savedDarkMode ? JSON.parse(savedDarkMode) : prefersDark;
  
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    toggle.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    toggle.checked = false;
  }
}

// Toggle dark/light mode
toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', toggle.checked);
  updateSendButtonState();
});

// Enable/disable send button based on input
chatInput.addEventListener('input', () => {
  updateSendButtonState();
});

function updateSendButtonState() {
  sendBtn.disabled = !chatInput.value.trim();
}

// Handle form submission
function handleSubmit(event) {
  event.preventDefault();
  const value = chatInput.value.trim();
  
  if (value) {
    addMessage(value, 'user');
    chatInput.value = '';
    updateSendButtonState();
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const responses = [
        'That\'s an interesting question! Let me think about that...',
        'I appreciate that question. Here\'s what I think...',
        'Great point! I can help you with that.',
        'That makes sense. Let me provide some insight...',
        'Absolutely! I\'d be happy to help with that.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'bot');
      addChatToHistory(value);
    }, 500);
  }
}

// Add message to chat
function addMessage(text, sender) {
  // Remove welcome section on first message
  const welcomeSection = document.querySelector('.welcome-section');
  if (welcomeSection && sender === 'user') {
    welcomeSection.remove();
  }
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = sender === 'user' ? '👤' : '🤖';
  
  const content = document.createElement('div');
  content.className = 'message-content';
  content.textContent = text;
  
  if (sender === 'user') {
    messageDiv.appendChild(content);
    messageDiv.appendChild(avatar);
  } else {
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
  }
  
  chatMessages.appendChild(messageDiv);
  
  // Scroll to bottom
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 0);
}

// Add chat to history in sidebar
function addChatToHistory(userMessage) {
  // Create a summary from the user message
  const summary = userMessage.length > 30 ? userMessage.substring(0, 30) + '...' : userMessage;
  
  const chatItem = document.createElement('div');
  chatItem.className = 'chat-item';
  chatItem.textContent = summary;
  chatItem.onclick = () => loadChat(chatItem);
  
  // Remove selected state from previous item
  document.querySelectorAll('.chat-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  // Add new chat to the top
  const firstItem = chatList.firstChild;
  if (firstItem) {
    chatList.insertBefore(chatItem, firstItem);
  } else {
    chatList.appendChild(chatItem);
  }
  
  chatItem.classList.add('selected');
}

// Load chat from history
function loadChat(chatItem) {
  document.querySelectorAll('.chat-item').forEach(item => {
    item.classList.remove('selected');
  });
  chatItem.classList.add('selected');
  
  // Clear messages and show welcome section
  chatMessages.innerHTML = `
    <div class="welcome-section">
      <h2 class="welcome-title">What can I help with?</h2>
      <p class="welcome-subtitle">Ask me anything or choose a quick action below</p>
      <div class="options">
        <button class="option-btn" onclick="suggestPrompt(this)">
          <span class="option-icon">💡</span>
          <span class="option-text">Brainstorm ideas</span>
        </button>
        <button class="option-btn" onclick="suggestPrompt(this)">
          <span class="option-icon">🔍</span>
          <span class="option-text">Find information</span>
        </button>
        <button class="option-btn" onclick="suggestPrompt(this)">
          <span class="option-icon">✍️</span>
          <span class="option-text">Write something</span>
        </button>
        <button class="option-btn" onclick="suggestPrompt(this)">
          <span class="option-icon">🐛</span>
          <span class="option-text">Debug code</span>
        </button>
      </div>
    </div>
  `;
}

// Suggest prompt from option button
function suggestPrompt(button) {
  const text = button.querySelector('.option-text').textContent;
  chatInput.value = text;
  updateSendButtonState();
  chatInput.focus();
}

// New chat
newChatBtn.addEventListener('click', () => {
  currentChatId = Math.random().toString(36).substr(2, 9);
  chatHistory = [];
  
  // Reset chat messages
  chatMessages.innerHTML = `
    <div class="welcome-section">
      <h2 class="welcome-title">What can I help with?</h2>
      <p class="welcome-subtitle">Ask me anything or choose a quick action below</p>
      <div class="options">
        <button class="option-btn" onclick="suggestPrompt(this)">
          <span class="option-icon">💡</span>
          <span class="option-text">Brainstorm ideas</span>
        </button>
        <button class="option-btn" onclick="suggestPrompt(this)">
          <span class="option-icon">🔍</span>
          <span class="option-text">Find information</span>
        </button>
        <button class="option-btn" onclick="suggestPrompt(this)">
          <span class="option-icon">✍️</span>
          <span class="option-text">Write something</span>
        </button>
        <button class="option-btn" onclick="suggestPrompt(this)">
          <span class="option-icon">🐛</span>
          <span class="option-text">Debug code</span>
        </button>
      </div>
    </div>
  `;
  
  chatInput.value = '';
  updateSendButtonState();
  chatInput.focus();
  
  // Mark all previous chats as unselected
  document.querySelectorAll('.chat-item').forEach(item => {
    item.classList.remove('selected');
  });
});

// Sidebar toggle for mobile
sidebarToggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Close sidebar when selecting a chat on mobile
if (window.innerWidth <= 640) {
  document.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  });
}

// Initialize
initializeDarkMode();
updateSendButtonState();
chatInput.focus();