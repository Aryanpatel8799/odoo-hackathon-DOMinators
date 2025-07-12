import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const EmojiPicker = ({ isOpen, onClose, onEmojiSelect }) => {
  const [activeCategory, setActiveCategory] = useState('smileys');

  const emojiCategories = {
    smileys: {
      name: 'Smileys & People',
      icon: 'Smile',
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳']
    },
    nature: {
      name: 'Animals & Nature',
      icon: 'Leaf',
      emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺']
    },
    food: {
      name: 'Food & Drink',
      icon: 'Coffee',
      emojis: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞']
    },
    activities: {
      name: 'Activities',
      icon: 'Zap',
      emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️']
    },
    objects: {
      name: 'Objects',
      icon: 'Smartphone',
      emojis: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️']
    },
    symbols: {
      name: 'Symbols',
      icon: 'Heart',
      emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐']
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full right-0 mb-2 w-80 bg-popover border border-border rounded-lg shadow-elevation-3 z-50 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Emoji</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-muted transition-colors duration-150"
        >
          <Icon name="X" size={16} className="text-muted-foreground" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center p-2 border-b border-border overflow-x-auto">
        {Object.entries(emojiCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`flex-shrink-0 p-2 rounded-md transition-colors duration-150 ${
              activeCategory === key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
            title={category.name}
          >
            <Icon name={category.icon} size={16} />
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="p-3 h-48 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1">
          {emojiCategories[activeCategory].emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => onEmojiSelect(emoji)}
              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors duration-150"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Recently Used */}
      <div className="p-3 border-t border-border">
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Recently Used</h4>
        <div className="flex space-x-1">
          {['😀', '👍', '❤️', '😂', '🎉'].map((emoji, index) => (
            <button
              key={index}
              onClick={() => onEmojiSelect(emoji)}
              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors duration-150"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;