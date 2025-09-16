// script.js

const chatHistory = document.getElementById('chatHistory');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Tạo sessionId ngẫu nhiên 1 lần khi tải trang
const sessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now();

// Hàm hiển thị tin nhắn
function displayMessage(message, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.textContent = message;
  chatHistory.appendChild(messageElement);
  chatHistory.scrollTop = chatHistory.scrollHeight; // Tự động cuộn xuống
}

// Hàm gửi tin nhắn đến API
async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  // Hiển thị tin nhắn người dùng
  displayMessage(message, 'user');
  messageInput.value = '';

  try {
    // Gửi yêu cầu đến API với sessionId
    const response = await fetch('https://traditive-maryrose-odorous.ngrok-free.app/webhook/ece80e2e-0536-46dc-83ce-bbb29514be3e/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatInput: message,
        sessionId: sessionId // Thêm sessionId vào body
      })
    });

    const data = await response.json();

    // Hiển thị phản hồi từ API với key `output`
    displayMessage(data.output || 'Không có phản hồi', 'bot');
  } catch (error) {
    displayMessage('Lỗi kết nối đến API', 'bot');
  }
}

// Gửi khi nhấn nút
sendButton.addEventListener('click', sendMessage);

// Gửi khi nhấn Enter
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});