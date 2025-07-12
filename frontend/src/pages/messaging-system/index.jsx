import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import EmojiPicker from './components/EmojiPicker';

const MessagingSystem = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Mock conversations data
  const [conversations] = useState([
    {
      id: 1,
      participant: {
        id: 2,
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        isOnline: true,
        skills: ["React", "JavaScript", "UI/UX Design"]
      },
      lastMessage: {
        id: 101,
        content: "That sounds great! When would you like to start our React session?",
        timestamp: new Date(Date.now() - 300000),
        isFromMe: false
      },
      unreadCount: 2
    },
    {
      id: 2,
      participant: {
        id: 3,
        name: "Michael Rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        isOnline: false,
        skills: ["Python", "Data Science", "Machine Learning"]
      },
      lastMessage: {
        id: 102,
        content: "Thanks for the Python tutorial! I'll practice and get back to you.",
        timestamp: new Date(Date.now() - 3600000),
        isFromMe: true
      },
      unreadCount: 0
    },
    {
      id: 3,
      participant: {
        id: 4,
        name: "Emily Johnson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        isOnline: true,
        skills: ["Graphic Design", "Adobe Creative Suite", "Branding"]
      },
      lastMessage: {
        id: 103,
        content: "I've uploaded the design files. Let me know what you think!",
        timestamp: new Date(Date.now() - 7200000),
        isFromMe: false
      },
      unreadCount: 1
    },
    {
      id: 4,
      participant: {
        id: 5,
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        isOnline: false,
        skills: ["Node.js", "Express", "MongoDB"]
      },
      lastMessage: {
        id: 104,
        content: "Perfect! I'll help you with the backend setup tomorrow.",
        timestamp: new Date(Date.now() - 86400000),
        isFromMe: true
      },
      unreadCount: 0
    },
    {
      id: 5,
      participant: {
        id: 6,
        name: "Lisa Wang",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        isOnline: true,
        skills: ["Digital Marketing", "SEO", "Content Strategy"]
      },
      lastMessage: {
        id: 105,
        content: "The SEO strategy document is ready for review. Should we schedule a call?",
        timestamp: new Date(Date.now() - 172800000),
        isFromMe: false
      },
      unreadCount: 3
    }
  ]);

  // Mock messages data
  const [messages, setMessages] = useState({
    1: [
      {
        id: 1,
        content: "Hi John! I saw your profile and I\'m interested in learning React. I can teach you UI/UX design in return.",
        timestamp: new Date(Date.now() - 86400000),
        isFromMe: false,
        status: 'read'
      },
      {
        id: 2,
        content: "That sounds perfect! I\'ve been wanting to improve my design skills. When would be a good time to start?",
        timestamp: new Date(Date.now() - 82800000),
        isFromMe: true,
        status: 'read'
      },
      {
        id: 3,
        content: "How about we start with a React basics session this weekend? I can show you component fundamentals.",
        timestamp: new Date(Date.now() - 79200000),
        isFromMe: false,
        status: 'read'
      },
      {
        id: 4,
        content: "Sounds great! I\'ll prepare some design principles materials for you too. Should we meet virtually?",
        timestamp: new Date(Date.now() - 75600000),
        isFromMe: true,
        status: 'read'
      },
      {
        id: 5,
        content: "Yes, virtual works perfectly. I'll send you a Zoom link. Also, do you have any specific React topics you want to focus on?",
        timestamp: new Date(Date.now() - 72000000),
        isFromMe: false,
        status: 'read'
      },
      {
        id: 6,
        content: "I'm particularly interested in hooks and state management. And for design, I'd love to learn about user research and prototyping.",
        timestamp: new Date(Date.now() - 68400000),
        isFromMe: true,
        status: 'read'
      },
      {
        id: 7,
        content: "Perfect! I\'ll prepare a hooks tutorial and some state management examples. Looking forward to learning about user research from you!",
        timestamp: new Date(Date.now() - 64800000),
        isFromMe: false,
        status: 'read'
      },
      {
        id: 8,
        content: "That sounds great! When would you like to start our React session?",
        timestamp: new Date(Date.now() - 300000),
        isFromMe: false,
        status: 'delivered'
      }
    ],
    2: [
      {
        id: 9,
        content: "Hey Michael! Ready for our Python data science session?",
        timestamp: new Date(Date.now() - 7200000),
        isFromMe: true,
        status: 'read'
      },
      {
        id: 10,
        content: "Absolutely! I\'ve been working through the pandas exercises you sent.",
        timestamp: new Date(Date.now() - 7000000),
        isFromMe: false,
        status: 'read'
      },
      {
        id: 11,
        content: "Great! Let\'s dive into data visualization with matplotlib today.",
        timestamp: new Date(Date.now() - 6800000),
        isFromMe: true,
        status: 'read'
      },
      {
        id: 12,
        content: "Thanks for the Python tutorial! I\'ll practice and get back to you.",
        timestamp: new Date(Date.now() - 3600000),
        isFromMe: true,
        status: 'read'
      }
    ]
  });

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setSelectedConversation(null);
  };

  const handleSendMessage = (content) => {
    if (!selectedConversation) return;

    const newMessage = {
      id: Date.now(),
      content,
      timestamp: new Date(),
      isFromMe: true,
      status: 'sending'
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [
        ...(prev[selectedConversation.id] || []),
        newMessage
      ]
    }));

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id].map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      }));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id].map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      }));
    }, 2000);
  };

  const handleEmojiSelect = (emoji) => {
    // This would typically add the emoji to the current message input
    console.log('Selected emoji:', emoji);
    setShowEmojiPicker(false);
  };

  const currentMessages = selectedConversation ? messages[selectedConversation.id] || [] : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        
        <main className="flex-1 h-screen overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full flex"
          >
            {/* Mobile Layout */}
            <div className="lg:hidden w-full">
              {!showMobileChat ? (
                <ConversationList
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  onSelectConversation={handleSelectConversation}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              ) : (
                <ChatWindow
                  conversation={selectedConversation}
                  messages={currentMessages}
                  onSendMessage={handleSendMessage}
                  onBackToList={handleBackToList}
                />
              )}
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex w-full">
              {/* Conversation List */}
              <div className="w-80 flex-shrink-0">
                <ConversationList
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  onSelectConversation={handleSelectConversation}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </div>

              {/* Chat Window */}
              <div className="flex-1">
                <ChatWindow
                  conversation={selectedConversation}
                  messages={currentMessages}
                  onSendMessage={handleSendMessage}
                  onBackToList={handleBackToList}
                />
              </div>
            </div>
          </motion.div>

          {/* Emoji Picker */}
          <EmojiPicker
            isOpen={showEmojiPicker}
            onClose={() => setShowEmojiPicker(false)}
            onEmojiSelect={handleEmojiSelect}
          />
        </main>
      </div>
    </div>
  );
};

export default MessagingSystem;