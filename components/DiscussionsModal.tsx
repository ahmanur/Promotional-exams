import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Message } from '../types';
import { mockDiscussionGroups, mockUsers } from '../services/mockData';
import { XMarkIcon, PaperClipIcon, PhotoIcon, PaperAirplaneIcon, DocumentTextIcon, ChatBubbleLeftRightIcon } from './icons/Icons';

const userMap = new Map(mockUsers.map(user => [user.id, user]));

interface DiscussionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (message: Message) => void;
}

const DiscussionsModal: React.FC<DiscussionsModalProps> = ({ isOpen, onClose, messages, onSendMessage }) => {
  const { user: currentUser } = useAuth();
  const [selectedGroupId, setSelectedGroupId] = useState<string>(mockDiscussionGroups[0].id);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
    if(isOpen) {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  }, [messages, selectedGroupId, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUser) return;
    
    const message: Message = {
      id: `msg${Date.now()}`,
      groupId: selectedGroupId,
      userId: currentUser.id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: newMessage,
    };
    
    onSendMessage(message);
    setNewMessage('');
  };

  const renderAttachment = (msg: Message) => {
    if (!msg.attachment) return null;

    if (msg.attachment.type === 'image') {
        return (
            <div className="mt-2">
                <img src={msg.attachment.url} alt="Shared attachment" className="rounded-lg max-w-xs max-h-64 object-cover" />
            </div>
        )
    }

    if (msg.attachment.type === 'document') {
        return (
            <div className="mt-2 p-3 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center gap-3">
                <DocumentTextIcon className="h-8 w-8 text-cbn-green dark:text-cbn-gold flex-shrink-0" />
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{msg.attachment.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{msg.attachment.size}</p>
                </div>
            </div>
        )
    }

    return null;
  }


  if (!isOpen) return null;

  const displayedMessages = messages.filter(m => m.groupId === selectedGroupId);
  const selectedGroup = mockDiscussionGroups.find(g => g.id === selectedGroupId);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scale-in 0.2s ease-out forwards' }}
      >
        <header className="flex justify-between items-center p-5 border-b dark:border-gray-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-cbn-green dark:text-cbn-gold">Discussions</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XMarkIcon />
          </button>
        </header>

        <div className="flex flex-1 min-h-0">
            {/* Sidebar with channels */}
            <aside className="w-1/4 border-r dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col">
                <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Channels</h3>
                </div>
                <nav className="flex-1 overflow-y-auto p-2">
                    <ul>
                        {mockDiscussionGroups.map(group => (
                            <li key={group.id}>
                                <button
                                    onClick={() => setSelectedGroupId(group.id)}
                                    className={`w-full text-left p-3 rounded-lg font-semibold transition-colors ${selectedGroupId === group.id ? 'bg-cbn-green text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                >
                                    {group.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main chat area */}
            <main className="w-3/4 flex flex-col">
                <div className="p-4 border-b dark:border-gray-700 flex-shrink-0">
                    <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200">{selectedGroup?.name}</h3>
                </div>

                <div className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-gray-800">
                    {displayedMessages.length > 0 ? (
                        <div className="space-y-6">
                            {displayedMessages.map(msg => {
                                const sender = userMap.get(msg.userId);
                                const isCurrentUser = currentUser?.id === msg.userId;
                                return (
                                    <div key={msg.id} className={`flex items-start gap-3 ${isCurrentUser ? 'justify-end' : ''}`}>
                                        {!isCurrentUser && (
                                            <div className="w-10 h-10 rounded-full bg-cbn-green text-white flex items-center justify-center font-bold flex-shrink-0">
                                                {sender?.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className={`max-w-lg ${isCurrentUser ? 'order-first' : ''}`}>
                                            <div className={`p-3 rounded-xl ${isCurrentUser ? 'bg-cbn-green text-white rounded-br-none' : 'bg-white dark:bg-gray-700 rounded-bl-none'}`}>
                                                {!isCurrentUser && <p className="font-bold text-cbn-green dark:text-cbn-gold text-sm mb-1">{sender?.name}</p>}
                                                {msg.content && <p className="text-base">{msg.content}</p>}
                                                {renderAttachment(msg)}
                                            </div>
                                            <p className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>{msg.timestamp}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                            <ChatBubbleLeftRightIcon className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
                            <h3 className="text-xl font-semibold">Welcome to #{selectedGroup?.name}!</h3>
                            <p>No messages here yet. Start the conversation by sending a message below.</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-900/50 border-t dark:border-gray-700 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <button type="button" className="p-2 text-gray-500 hover:text-cbn-green dark:hover:text-cbn-gold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" aria-label="Attach file">
                            <PaperClipIcon />
                        </button>
                         <button type="button" className="p-2 text-gray-500 hover:text-cbn-green dark:hover:text-cbn-gold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" aria-label="Attach image">
                            <PhotoIcon />
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={`Message ${selectedGroup?.name}`}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-cbn-green"
                            aria-label="Type a message"
                        />
                        <button type="submit" className="p-3 bg-cbn-green text-white rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-110 disabled:bg-gray-300 disabled:scale-100" aria-label="Send message" disabled={!newMessage.trim()}>
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            </main>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
      ` }} />
    </div>
  );
};

export default DiscussionsModal;