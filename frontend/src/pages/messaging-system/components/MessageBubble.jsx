import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MessageBubble = ({ message, participant, isFromMe, showAvatar = true, showTimestamp = true }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} mb-3 group`}>
      {/* Avatar for received messages */}
      {!isFromMe && showAvatar && (
        <div className="flex-shrink-0 mr-2">
          <Image
            src={participant.avatar}
            alt={participant.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      )}

      <div className={`max-w-xs lg:max-w-md ${isFromMe ? 'ml-auto' : 'mr-auto'}`}>
        {/* Message Content */}
        <div
          className={`px-4 py-2 rounded-2xl transition-all duration-200 ${
            isFromMe
              ? 'bg-primary text-primary-foreground rounded-br-md hover:bg-primary/90'
              : 'bg-muted text-foreground rounded-bl-md hover:bg-muted/80'
          }`}
        >
          {/* Message Text */}
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {/* Attachment Preview */}
          {message.attachment && (
            <div className="mt-2">
              {message.attachment.type === 'image' && (
                <div className="rounded-lg overflow-hidden">
                  <Image
                    src={message.attachment.url}
                    alt="Shared image"
                    className="max-w-full h-auto"
                  />
                </div>
              )}
              
              {message.attachment.type === 'file' && (
                <div className={`flex items-center p-3 rounded-lg ${
                  isFromMe ? 'bg-primary-foreground/10' : 'bg-background'
                }`}>
                  <Icon name="File" size={20} className="mr-3" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{message.attachment.name}</p>
                    <p className="text-xs opacity-70">{message.attachment.size}</p>
                  </div>
                  <Icon name="Download" size={16} className="ml-2 opacity-70" />
                </div>
              )}
            </div>
          )}

          {/* Message Footer */}
          {showTimestamp && (
            <div className={`flex items-center justify-end mt-1 space-x-1 ${
              isFromMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
            }`}>
              <span className="text-xs">{formatTime(message.timestamp)}</span>
              
              {/* Read Receipt for sent messages */}
              {isFromMe && (
                <div className="flex items-center">
                  {message.status === 'sending' && (
                    <Icon name="Clock" size={12} className="opacity-70" />
                  )}
                  {message.status === 'sent' && (
                    <Icon name="Check" size={12} className="opacity-70" />
                  )}
                  {message.status === 'delivered' && (
                    <Icon name="CheckCheck" size={12} className="opacity-70" />
                  )}
                  {message.status === 'read' && (
                    <Icon name="CheckCheck" size={12} className="text-blue-300" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Message Actions (visible on hover) */}
        <div className={`flex items-center mt-1 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          isFromMe ? 'justify-end' : 'justify-start'
        }`}>
          <button className="p-1 rounded-full hover:bg-muted transition-colors duration-150">
            <Icon name="MoreHorizontal" size={14} className="text-muted-foreground" />
          </button>
          <button className="p-1 rounded-full hover:bg-muted transition-colors duration-150">
            <Icon name="Reply" size={14} className="text-muted-foreground" />
          </button>
          {!isFromMe && (
            <button className="p-1 rounded-full hover:bg-muted transition-colors duration-150">
              <Icon name="Heart" size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Spacer for sent messages */}
      {isFromMe && showAvatar && (
        <div className="flex-shrink-0 ml-2 w-8" />
      )}
    </div>
  );
};

export default MessageBubble;