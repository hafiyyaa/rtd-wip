const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const chatMessages = document.getElementById('chatMessages');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    // Append user message
    appendMessage(text, 'user-message');
    userInput.value = '';

    // Scroll to bottom
    scrollToBottom();

    // Show loading indicator or temporary AI message
    const loadingId = appendMessage('Thinking...', 'ai-message loading');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        // Remove loading message
        removeMessage(loadingId);

        if (response.ok) {
            appendMessage(data.reply, 'ai-message');
        } else {
            appendMessage(`Error: ${data.error || 'Failed to get response'}`, 'ai-message error');
        }
    } catch (error) {
        removeMessage(loadingId);
        appendMessage(`Error: Network connection failed.`, 'ai-message error');
    }

    scrollToBottom();
});

function appendMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.textContent = text;
    
    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);
    
    // Return a unique identifier (element reference) for removal if needed
    return messageDiv;
}

function removeMessage(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
