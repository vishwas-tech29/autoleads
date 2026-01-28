(function() {
  'use strict';
  
  // Get configuration from script tag
  const script = document.currentScript;
  const businessId = script.getAttribute('data-business-id');
  const position = script.getAttribute('data-position') || 'bottom-right';
  const theme = script.getAttribute('data-theme') || 'blue';
  
  if (!businessId) {
    console.error('AutoLead AI: business-id is required');
    return;
  }
  
  // Widget state
  let isOpen = false;
  let unreadCount = 0;
  let conversationId = null;
  
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'autolead-widget-container';
  widgetContainer.style.cssText = `
    position: fixed;
    ${position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
    ${position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  // Create chat bubble
  const chatBubble = document.createElement('div');
  chatBubble.id = 'autolead-chat-bubble';
  chatBubble.style.cssText = `
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    animation: float 3s ease-in-out infinite;
  `;
  
  // Add floating animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideDown {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Chat icon SVG
  chatBubble.innerHTML = `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  
  // Unread badge
  const unreadBadge = document.createElement('div');
  unreadBadge.id = 'autolead-unread-badge';
  unreadBadge.style.cssText = `
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ef4444;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    animation: pulse 2s infinite;
  `;
  chatBubble.appendChild(unreadBadge);
  
  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'autolead-chat-window';
  chatWindow.style.cssText = `
    position: absolute;
    ${position.includes('right') ? 'right: 0;' : 'left: 0;'}
    ${position.includes('bottom') ? 'bottom: 80px;' : 'top: 80px;'}
    width: 380px;
    height: 500px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    display: none;
    flex-direction: column;
    overflow: hidden;
    animation: slideUp 0.3s ease-out;
  `;
  
  // Chat header
  const chatHeader = document.createElement('div');
  chatHeader.style.cssText = `
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;
  
  chatHeader.innerHTML = `
    <div>
      <h3 style="margin: 0; font-size: 16px; font-weight: 600;">Chat with us</h3>
      <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">We typically reply instantly</p>
    </div>
    <button id="autolead-close-btn" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;
  
  // Chat messages container
  const messagesContainer = document.createElement('div');
  messagesContainer.id = 'autolead-messages';
  messagesContainer.style.cssText = `
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    background: #f8fafc;
  `;
  
  // Welcome message
  messagesContainer.innerHTML = `
    <div style="display: flex; margin-bottom: 16px;">
      <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div style="background: white; padding: 12px 16px; border-radius: 18px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); max-width: 80%;">
        <p style="margin: 0; color: #374151; font-size: 14px;">Hi! How can we help you today? 👋</p>
      </div>
    </div>
  `;
  
  // Chat input container
  const inputContainer = document.createElement('div');
  inputContainer.style.cssText = `
    padding: 16px 20px;
    background: white;
    border-top: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 12px;
  `;
  
  // Chat input
  const chatInput = document.createElement('input');
  chatInput.type = 'text';
  chatInput.placeholder = 'Type your message...';
  chatInput.style.cssText = `
    flex: 1;
    border: 1px solid #d1d5db;
    border-radius: 20px;
    padding: 10px 16px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  `;
  
  // Send button
  const sendButton = document.createElement('button');
  sendButton.style.cssText = `
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s;
  `;
  
  sendButton.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  
  // Assemble chat window
  inputContainer.appendChild(chatInput);
  inputContainer.appendChild(sendButton);
  chatWindow.appendChild(chatHeader);
  chatWindow.appendChild(messagesContainer);
  chatWindow.appendChild(inputContainer);
  
  // Assemble widget
  widgetContainer.appendChild(chatBubble);
  widgetContainer.appendChild(chatWindow);
  document.body.appendChild(widgetContainer);
  
  // Event handlers
  chatBubble.addEventListener('click', toggleChat);
  chatHeader.querySelector('#autolead-close-btn').addEventListener('click', closeChat);
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // Hover effects
  chatBubble.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 6px 25px rgba(59, 130, 246, 0.4)';
  });
  
  chatBubble.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.3)';
  });
  
  sendButton.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
  });
  
  sendButton.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
  
  chatInput.addEventListener('focus', function() {
    this.style.borderColor = '#3b82f6';
  });
  
  chatInput.addEventListener('blur', function() {
    this.style.borderColor = '#d1d5db';
  });
  
  // Functions
  function toggleChat() {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }
  
  function openChat() {
    isOpen = true;
    chatWindow.style.display = 'flex';
    chatWindow.style.animation = 'slideUp 0.3s ease-out';
    chatInput.focus();
    
    // Reset unread count
    unreadCount = 0;
    updateUnreadBadge();
    
    // Initialize conversation if needed
    if (!conversationId) {
      initializeConversation();
    }
  }
  
  function closeChat() {
    isOpen = false;
    chatWindow.style.animation = 'slideDown 0.3s ease-out';
    setTimeout(() => {
      chatWindow.style.display = 'none';
    }, 300);
  }
  
  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Send to API
    fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: conversationId,
        message: message
      })
    })
    .then(response => response.json())
    .then(data => {
      hideTypingIndicator();
      if (data.response) {
        addMessage(data.response, 'bot');
      }
    })
    .catch(error => {
      hideTypingIndicator();
      addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      console.error('AutoLead AI Error:', error);
    });
  }
  
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      display: flex;
      margin-bottom: 16px;
      ${sender === 'user' ? 'justify-content: flex-end;' : ''}
    `;
    
    if (sender === 'user') {
      messageDiv.innerHTML = `
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 12px 16px; border-radius: 18px; max-width: 80%; word-wrap: break-word;">
          <p style="margin: 0; font-size: 14px;">${text}</p>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div style="background: white; padding: 12px 16px; border-radius: 18px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); max-width: 80%; word-wrap: break-word;">
          <p style="margin: 0; color: #374151; font-size: 14px;">${text}</p>
        </div>
      `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Update unread count if chat is closed
    if (!isOpen && sender === 'bot') {
      unreadCount++;
      updateUnreadBadge();
    }
  }
  
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.style.cssText = `
      display: flex;
      margin-bottom: 16px;
    `;
    
    typingDiv.innerHTML = `
      <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div style="background: white; padding: 12px 16px; border-radius: 18px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <div style="display: flex; align-items: center; gap: 4px;">
          <div style="width: 8px; height: 8px; background: #9ca3af; border-radius: 50%; animation: pulse 1.4s infinite;"></div>
          <div style="width: 8px; height: 8px; background: #9ca3af; border-radius: 50%; animation: pulse 1.4s infinite 0.2s;"></div>
          <div style="width: 8px; height: 8px; background: #9ca3af; border-radius: 50%; animation: pulse 1.4s infinite 0.4s;"></div>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  function updateUnreadBadge() {
    if (unreadCount > 0) {
      unreadBadge.style.display = 'flex';
      unreadBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
    } else {
      unreadBadge.style.display = 'none';
    }
  }
  
  function initializeConversation() {
    fetch('/api/chat/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        businessId: businessId,
        visitorId: generateVisitorId(),
        metadata: {
          source: 'widget',
          browser: navigator.userAgent,
          referrer: document.referrer,
          url: window.location.href
        }
      })
    })
    .then(response => response.json())
    .then(data => {
      conversationId = data.chatId;
      if (data.greeting) {
        addMessage(data.greeting, 'bot');
      }
    })
    .catch(error => {
      console.error('AutoLead AI: Failed to initialize conversation', error);
    });
  }
  
  function generateVisitorId() {
    // Try to get existing visitor ID from localStorage
    let visitorId = localStorage.getItem('autolead-visitor-id');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('autolead-visitor-id', visitorId);
    }
    return visitorId;
  }
  
  // Mobile responsiveness
  function handleResize() {
    if (window.innerWidth <= 768) {
      chatWindow.style.width = '100vw';
      chatWindow.style.height = '100vh';
      chatWindow.style.borderRadius = '0';
      chatWindow.style.bottom = '0';
      chatWindow.style.right = '0';
      chatWindow.style.left = '0';
      chatWindow.style.top = '0';
    } else {
      chatWindow.style.width = '380px';
      chatWindow.style.height = '500px';
      chatWindow.style.borderRadius = '16px';
      chatWindow.style.bottom = position.includes('bottom') ? '80px' : 'auto';
      chatWindow.style.top = position.includes('top') ? '80px' : 'auto';
      chatWindow.style.right = position.includes('right') ? '0' : 'auto';
      chatWindow.style.left = position.includes('left') ? '0' : 'auto';
    }
  }
  
  window.addEventListener('resize', handleResize);
  handleResize();
  
  // Auto-open after delay (optional)
  setTimeout(() => {
    if (!isOpen && !localStorage.getItem('autolead-widget-seen')) {
      // Subtle bounce animation to draw attention
      chatBubble.style.animation = 'float 3s ease-in-out infinite, pulse 2s ease-in-out 3';
      localStorage.setItem('autolead-widget-seen', 'true');
    }
  }, 5000);
  
})();