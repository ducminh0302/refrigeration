// script.js

const chatHistory = document.getElementById('chatHistory');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const loadingIndicator = document.getElementById('loadingIndicator');

// Tạo sessionId ngẫu nhiên 1 lần khi tải trang
const sessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now();

// Hàm hiển thị tin nhắn
function displayMessage(message, sender) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container', `${sender}-container`);
  
  // Tạo avatar
  const avatarElement = document.createElement('div');
  avatarElement.classList.add('avatar', sender);
  avatarElement.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
  
  // Tạo phần nội dung tin nhắn
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  
  // Xử lý các ký hiệu định dạng
  let formattedMessage = message
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // In đậm
    .replace(/\*(.*?)\*/g, '<em>$1</em>')             // In nghiêng
    .replace(/\n/g, '<br>');                         // Xuống dòng
  
  messageElement.innerHTML = formattedMessage;
  
  // Thêm avatar và tin nhắn vào container
  // Thứ tự từ trái qua phải: avatar bot -> tin nhắn bot -> tin nhắn user -> avatar user
  if (sender === 'user') {
    messageContainer.appendChild(avatarElement);
    messageContainer.appendChild(messageElement);
  } else {
    messageContainer.appendChild(avatarElement);
    messageContainer.appendChild(messageElement);
  }
  
  chatHistory.appendChild(messageContainer);
  chatHistory.scrollTop = chatHistory.scrollHeight; // Tự động cuộn xuống
}

// Hàm hiển thị hoặc ẩn loading indicator như một tin nhắn bot
function showLoadingIndicator(show) {
  // Tìm hoặc tạo loading message container
  let loadingMessage = document.getElementById('loadingMessage');
  
  if (show) {
    // Nếu chưa có thì tạo mới
    if (!loadingMessage) {
      const messageContainer = document.createElement('div');
      messageContainer.classList.add('message-container', 'bot-container');
      
      // Tạo avatar bot
      const avatarElement = document.createElement('div');
      avatarElement.classList.add('avatar', 'bot');
      avatarElement.innerHTML = '<i class="fas fa-robot"></i>';
      
      // Tạo loading message
      loadingMessage = document.createElement('div');
      loadingMessage.id = 'loadingMessage';
      loadingMessage.classList.add('message', 'loading');
      
      // Tạo nội dung loading
      const loadingDots = document.createElement('div');
      loadingDots.classList.add('loading-dots');
      loadingDots.innerHTML = '<span></span><span></span><span></span>';
      
      const loadingText = document.createElement('div');
      loadingText.classList.add('loading-text');
      loadingText.textContent = 'Đang suy nghĩ...';
      
      loadingMessage.appendChild(loadingDots);
      loadingMessage.appendChild(loadingText);
      
      // Thêm avatar và loading message vào container
      messageContainer.appendChild(avatarElement);
      messageContainer.appendChild(loadingMessage);
      
      // Thêm vào chat history
      chatHistory.appendChild(messageContainer);
    }
    
    // Hiển thị loading
    loadingMessage.style.display = 'flex';
  } else {
    // Ẩn loading nếu tồn tại
    if (loadingMessage) {
      loadingMessage.style.display = 'none';
      // Xóa hoàn toàn phần tử loading
      const loadingContainer = loadingMessage.closest('.message-container');
      if (loadingContainer) {
        loadingContainer.remove();
      }
    }
  }
  
  // Tự động cuộn xuống
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Hàm gửi tin nhắn đến API
async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  // Hiển thị tin nhắn người dùng
  displayMessage(message, 'user');
  messageInput.value = '';

  // Hiển thị loading indicator như một tin nhắn bot
  showLoadingIndicator(true);

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

    // Ẩn loading indicator
    showLoadingIndicator(false);

    // Hiển thị phản hồi từ API với key `output`
    displayMessage(data.output || 'Không có phản hồi', 'bot');
  } catch (error) {
    // Ẩn loading indicator
    showLoadingIndicator(false);
    
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