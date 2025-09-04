// chat-widget.js - COMPLETELY REWRITTEN FROM SCRATCH
(function() {
    // Prevent duplicate loading
    if (window.SmartChatWidgetLoaded) return;
    window.SmartChatWidgetLoaded = true;

    // Validate configuration
    const config = window.ChatWidgetConfig || {
        webhookUrl: 'https://pranav-the-emperor.onrender.com/webhook-test/101895e3-0f95-4481-98e2-2f91a5b01854',
        companyName: 'AI Assistant',
        companyLogo: 'https://via.placeholder.com/40',
        theme: {
            primary: '#4361ee',
            secondary: '#3a56d4',
            background: '#ffffff',
            text: '#1e293b',
            lightText: '#64748b',
            border: '#e2e8f0'
        }
    };

    if (!config.webhookUrl) {
        console.error('[Chat Widget] webhookUrl is required in ChatWidgetConfig');
        return;
    }

    // Create main widget container
    const widget = document.createElement('div');
    widget.id = 'smart-chat-container';
    widget.style.display = 'none';
    
    // Modern, responsive CSS - completely rewritten
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        
        #smart-chat-container * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        #smart-chat-container {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            z-index: 99999;
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 380px;
            height: 550px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            background: ${config.theme.background};
            border: 1px solid ${config.theme.border};
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
        }
        
        #smart-chat-container.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0);
        }
        
        .chat-launcher {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, ${config.theme.primary}, ${config.theme.secondary});
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(67, 97, 238, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            z-index: 99998;
            transition: all 0.2s ease;
            animation: pulse 2s infinite;
        }
        
        .chat-launcher:hover {
            transform: scale(1.08);
            box-shadow: 0 6px 20px rgba(67, 97, 238, 0.5);
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0.4); }
            70% { box-shadow: 0 0 0 12px rgba(67, 97, 238, 0); }
            100% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0); }
        }
        
        .chat-header {
            padding: 16px 20px;
            background: linear-gradient(135deg, ${config.theme.primary}, ${config.theme.secondary});
            color: white;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .chat-header-logo {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            object-fit: contain;
            background: white;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .chat-header-title {
            font-size: 16px;
            font-weight: 600;
            color: white;
        }
        
        .chat-close {
            margin-left: auto;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: all 0.2s;
        }
        
        .chat-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }
        
        .chat-screens {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .screen {
            display: none;
            flex-direction: column;
            height: 100%;
            padding: 20px;
        }
        
        .screen.active {
            display: flex;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .welcome-screen h2 {
            font-size: 22px;
            font-weight: 700;
            color: ${config.theme.text};
            margin-bottom: 12px;
            line-height: 1.3;
        }
        
        .welcome-screen p {
            color: ${config.theme.lightText};
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 24px;
        }
        
        .form-field {
            margin-bottom: 16px;
        }
        
        .form-field label {
            display: block;
            margin-bottom: 6px;
            font-size: 14px;
            color: ${config.theme.text};
            font-weight: 500;
        }
        
        .form-field input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid ${config.theme.border};
            border-radius: 12px;
            font-size: 14px;
            transition: all 0.2s;
            background: white;
        }
        
        .form-field input:focus {
            outline: none;
            border-color: ${config.theme.primary};
            box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
        }
        
        .submit-btn {
            background: linear-gradient(135deg, ${config.theme.primary}, ${config.theme.secondary});
            color: white;
            border: none;
            width: 100%;
            padding: 14px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            margin-top: 8px;
            box-shadow: 0 4px 6px rgba(67, 97, 238, 0.2);
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 8px rgba(67, 97, 238, 0.3);
        }
        
        .submit-btn:active {
            transform: translateY(0);
        }
        
        .chat-screen {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        
        .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 0 0 16px 0;
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 16px;
        }
        
        .messages-container::-webkit-scrollbar {
            width: 6px;
        }
        
        .messages-container::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .messages-container::-webkit-scrollbar-thumb {
            background-color: rgba(100, 116, 139, 0.2);
            border-radius: 10px;
        }
        
        .message {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.5;
            word-wrap: break-word;
        }
        
        .bot-message {
            background: white;
            color: ${config.theme.text};
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            border: 1px solid ${config.theme.border};
        }
        
        .user-message {
            background: linear-gradient(135deg, ${config.theme.primary}, ${config.theme.secondary});
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            box-shadow: 0 1px 2px rgba(67, 97, 238, 0.2);
        }
        
        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 12px 16px;
            background: white;
            border-radius: 16px;
            border-bottom-left-radius: 4px;
            max-width: 80px;
            align-self: flex-start;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
            border: 1px solid ${config.theme.border};
        }
        
        .typing-dot {
            width: 8px;
            height: 8px;
            background: ${config.theme.primary};
            border-radius: 50%;
            opacity: 0.7;
            animation: typingAnimation 1.4s infinite ease-in-out;
        }
        
        @keyframes typingAnimation {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
        }
        
        .chat-input-area {
            display: flex;
            gap: 12px;
            padding: 12px 0;
            border-top: 1px solid ${config.theme.border};
        }
        
        .chat-input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid ${config.theme.border};
            border-radius: 14px;
            background: white;
            color: ${config.theme.text};
            resize: none;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            line-height: 1.5;
            min-height: 48px;
            max-height: 120px;
            transition: all 0.2s;
        }
        
        .chat-input:focus {
            outline: none;
            border-color: ${config.theme.primary};
            box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
        }
        
        .chat-submit {
            background: linear-gradient(135deg, ${config.theme.primary}, ${config.theme.secondary});
            color: white;
            border: none;
            border-radius: 14px;
            width: 48px;
            height: 48px;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: 0 2px 4px rgba(67, 97, 238, 0.2);
        }
        
        .chat-submit:hover {
            transform: scale(1.05);
            box-shadow: 0 3px 6px rgba(67, 97, 238, 0.3);
        }
        
        .chat-submit:active {
            transform: scale(1);
        }
        
        .chat-submit svg {
            width: 20px;
            height: 20px;
            stroke: white;
        }
        
        .powered-by {
            text-align: center;
            padding: 12px 0;
            font-size: 11px;
            color: ${config.theme.lightText};
        }
        
        .powered-by a {
            color: ${config.theme.primary};
            text-decoration: none;
        }
        
        /* Responsive design */
        @media (max-width: 480px) {
            #smart-chat-container {
                width: calc(100% - 40px);
                right: 20px;
                left: 20px;
                bottom: 90px;
            }
            
            .chat-launcher {
                bottom: 20px;
                right: 20px;
            }
        }
    `;
    
    // Widget HTML structure
    widget.innerHTML = `
        <div class="chat-header">
            <img src="${config.companyLogo}" alt="${config.companyName}" class="chat-header-logo">
            <div class="chat-header-title">${config.companyName}</div>
            <button class="chat-close">&times;</button>
        </div>
        
        <div class="chat-screens">
            <!-- Registration Screen -->
            <div class="screen welcome-screen active" id="registrationScreen">
                <h2>Let's get to know you</h2>
                <p>Share your details so we can provide personalized assistance.</p>
                
                <div class="form-field">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" placeholder="Your full name" autocomplete="name">
                </div>
                
                <div class="form-field">
                    <label for="emailAddress">Email Address</label>
                    <input type="email" id="emailAddress" placeholder="you@example.com" autocomplete="email">
                </div>
                
                <div class="form-field">
                    <label for="phoneNumber">Phone Number</label>
                    <input type="tel" id="phoneNumber" placeholder="+1 (234) 567-8900" autocomplete="tel">
                </div>
                
                <button class="submit-btn" id="startChatButton">Start Conversation</button>
            </div>
            
            <!-- Chat Screen -->
            <div class="screen chat-screen" id="chatScreen">
                <div class="messages-container" id="messagesContainer"></div>
                
                <div class="chat-input-area">
                    <textarea class="chat-input" id="userInput" placeholder="Type your message..." rows="1" autocomplete="off"></textarea>
                    <button class="chat-submit" id="sendButton">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="powered-by">
            Powered by <a href="https://n8n.io" target="_blank">n8n</a>
        </div>
    `;
    
    // Add all elements to DOM
    document.head.appendChild(style);
    document.body.appendChild(widget);
    
    // Create launcher button
    const launcher = document.createElement('button');
    launcher.className = 'chat-launcher';
    launcher.innerHTML = '💬';
    document.body.appendChild(launcher);

    // DOM references
    const chatClose = widget.querySelector('.chat-close');
    const startChatButton = document.getElementById('startChatButton');
    const fullNameInput = document.getElementById('fullName');
    const emailAddressInput = document.getElementById('emailAddress');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const messagesContainer = document.getElementById('messagesContainer');
    const registrationScreen = document.getElementById('registrationScreen');
    const chatScreen = document.getElementById('chatScreen');

    // State
    let userData = null;
    let isSending = false;

    // Utility functions
    function showChat(visible = true) {
        widget.style.display = visible ? 'flex' : 'none';
        if (visible) {
            setTimeout(() => {
                widget.classList.add('visible');
            }, 10);
        } else {
            widget.classList.remove('visible');
        }
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message bot-message';
        errorDiv.style.color = '#dc2626';
        errorDiv.style.border = '1px solid #fecaca';
        errorDiv.textContent = message;
        messagesContainer.appendChild(errorDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Event handlers
    launcher.addEventListener('click', () => {
        showChat(true);
    });

    chatClose.addEventListener('click', () => {
        widget.classList.remove('visible');
        setTimeout(() => {
            widget.style.display = 'none';
        }, 300);
    });

    startChatButton.addEventListener('click', () => {
        const name = fullNameInput.value.trim();
        const email = emailAddressInput.value.trim();
        const phone = phoneNumberInput.value.trim();
        
        // Validate inputs
        if (!name) {
            showError('Please enter your full name');
            return;
        }
        
        if (!email || !validateEmail(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        if (!phone) {
            showError('Please enter your phone number');
            return;
        }
        
        // Save user data
        userData = { name, email, phone };
        
        // Switch to chat screen
        registrationScreen.classList.remove('active');
        chatScreen.classList.add('active');
        
        // Show welcome message
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            addBotMessage(`Hello ${name}! I'm ready to help. How can I assist you today?`);
        }, 800);
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message || isSending || !userData) return;
        
        isSending = true;
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Add user message
        addUserMessage(message);
        
        // Show typing indicator
        showTypingIndicator();
        
        // Send to backend
        fetch(config.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                message: message
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            hideTypingIndicator();
            if (data.response) {
                addBotMessage(data.response);
            } else {
                showError('No response from the server');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            hideTypingIndicator();
            showError('Failed to send message. Please try again.');
        })
        .finally(() => {
            isSending = false;
        });
    }

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight > 120 ? 120 : this.scrollHeight) + 'px';
    });

    // Send button events
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Close widget when clicking outside
    document.addEventListener('click', function(e) {
        if (widget.classList.contains('visible') && 
            !widget.contains(e.target) && 
            !launcher.contains(e.target)) {
            widget.classList.remove('visible');
            setTimeout(() => {
                widget.style.display = 'none';
            }, 300);
        }
    });
})();
