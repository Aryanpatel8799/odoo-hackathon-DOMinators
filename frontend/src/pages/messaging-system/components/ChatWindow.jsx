import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ChatWindow = ({ conversation, messages, onSendMessage, onBackToList }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatMessageDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric',
        year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const dateKey = new Date(message.timestamp).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  if (!conversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-muted/30">
        <Icon name="MessageSquare" size={64} className="text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium text-foreground mb-2">Select a conversation</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          Choose a conversation from the sidebar to start messaging with your skill exchange partners.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          {/* Mobile Back Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackToList}
            className="lg:hidden"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>

          {/* Participant Info */}
          <div className="relative">
            <Image
              src={conversation.participant.avatar}
              alt={conversation.participant.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {conversation.participant.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success border-2 border-card rounded-full"></div>
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-foreground">{conversation.participant.name}</h3>
            <p className="text-sm text-muted-foreground">
              {conversation.participant.isOnline ? (
                isTyping ? 'typing...' : 'Online'
              ) : (
                'Last seen recently'
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Icon name="Phone" size={18} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="Video" size={18} />
          </Button>
          <Button variant="ghost" size="icon">
            <Icon name="MoreVertical" size={18} />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(messageGroups).map(([dateKey, dayMessages]) => (
          <div key={dateKey}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-6">
              <div className="px-3 py-1 bg-muted rounded-full">
                <span className="text-xs font-medium text-muted-foreground">
                  {formatMessageDate(new Date(dateKey))}
                </span>
              </div>
            </div>

            {/* Messages for this date */}
            {dayMessages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'} mb-2`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.isFromMe ? 'order-2' : 'order-1'}`}>
                  {!message.isFromMe && (
                    <div className="flex items-center mb-1">
                      <Image
                        src={conversation.participant.avatar}
                        alt={conversation.participant.name}
                        className="w-6 h-6 rounded-full object-cover mr-2"
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        {conversation.participant.name}
                      </span>
                    </div>
                  )}
                  
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.isFromMe
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    <div className={`flex items-center justify-end mt-1 space-x-1 ${
                      message.isFromMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      <span className="text-xs">{formatMessageTime(message.timestamp)}</span>
                      {message.isFromMe && (
                        <Icon 
                          name={message.status === 'read' ? 'CheckCheck' : 'Check'} 
                          size={12}
                          className={message.status === 'read' ? 'text-blue-300' : ''}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 px-4 py-2 bg-muted rounded-2xl rounded-bl-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-end space-x-2">
          {/* Attachment Button */}
          <Button variant="ghost" size="icon" className="mb-2">
            <Icon name="Paperclip" size={20} />
          </Button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 pr-12 bg-muted border border-border rounded-2xl text-sm text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            
            {/* Emoji Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 bottom-1"
            >
              <Icon name="Smile" size={18} />
            </Button>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="mb-2"
          >
            <Icon name="Send" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;