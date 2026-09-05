import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { Send, MessageSquare, User, Search, Filter, CheckCircle2 } from 'lucide-react';

export const MessagesView = ({ currentUser }) => {
  const [activeChannel, setActiveChannel] = useState('q-1042');
  const [newMessage, setNewMessage] = useState('');

  const [channels, setChannels] = useState([
    {
      id: 'q-1042',
      title: 'Quotation Q-1042 — Acme Corp',
      subtitle: 'Negotiation & Discount Approval',
      badge: 'Under Review',
      badgeVariant: 'warning',
      lastMessage: 'Requested extra 5% volume discount for multi-year commitment.',
      lastTime: '10:42 AM'
    },
    {
      id: 'q-1040',
      title: 'Quotation Q-1040 — TechCorp Inc',
      subtitle: 'Stock Split Reconciliation',
      badge: 'Approved',
      badgeVariant: 'success',
      lastMessage: 'Warehouse stock split confirmed across Austin and San Jose.',
      lastTime: 'Yesterday'
    },
    {
      id: 'team-sales',
      title: 'Enterprise Sales Team',
      subtitle: 'Q3 Quota & Discount Escalations',
      badge: 'Team Chat',
      badgeVariant: 'purple',
      lastMessage: 'Reminder: All discounts over 15% require manager + finance signoff.',
      lastTime: 'Sep 4'
    }
  ]);

  const [messages, setMessages] = useState({
    'q-1042': [
      {
        id: 'm-1',
        sender: 'Alex Johnson (Sales Rep)',
        role: 'sales_rep',
        avatar: 'AJ',
        text: 'Submitted Q-1042 for Acme Corp with a 12% line discount on Enterprise Cloud ERP.',
        timestamp: '10:15 AM',
        isMe: currentUser?.role === 'sales_rep'
      },
      {
        id: 'm-2',
        sender: 'J. Rao (Sales Manager)',
        role: 'sales_manager',
        avatar: 'JR',
        text: 'Reviewing discount overage against Gold Tier ceiling. Blended risk score is 12.5%.',
        timestamp: '10:30 AM',
        isMe: currentUser?.role === 'sales_manager'
      },
      {
        id: 'm-3',
        sender: 'Acme Corp Portal',
        role: 'customer',
        avatar: 'AC',
        text: 'We are requesting an extra 5% volume discount for our multi-year commitment.',
        timestamp: '10:42 AM',
        isMe: false
      }
    ],
    'q-1040': [
      {
        id: 'm-4',
        sender: 'M. Shah (Finance/Ops)',
        role: 'finance_ops',
        avatar: 'MS',
        text: 'Order split approved: 10 units from Warehouse A, 5 units from Warehouse B.',
        timestamp: 'Yesterday',
        isMe: currentUser?.role === 'finance_ops'
      }
    ],
    'team-sales': [
      {
        id: 'm-5',
        sender: 'Elena Rostova (Admin)',
        role: 'admin',
        avatar: 'ER',
        text: 'Reminder: Governance threshold rules updated for Q3 pricing matrices.',
        timestamp: 'Sep 4',
        isMe: currentUser?.role === 'admin'
      }
    ]
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsgObj = {
      id: `m-${Date.now()}`,
      sender: `${currentUser.name || 'User'} (${(currentUser.role || 'sales_rep').replace('_', ' ')})`,
      role: currentUser.role || 'sales_rep',
      avatar: currentUser.name ? currentUser.name.split(' ').map((n) => n[0]).join('') : 'ME',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages({
      ...messages,
      [activeChannel]: [...(messages[activeChannel] || []), newMsgObj]
    });

    setNewMessage('');
  };

  const activeChannelObj = channels.find((c) => c.id === activeChannel) || channels[0];
  const activeChatMessages = messages[activeChannel] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Deal Communications & Team Chat</h1>
          <p className="text-sm text-slate-500">Live negotiation comments, discount approval threads, and internal team messaging</p>
        </div>
        <Badge variant="purple">Live Governance Feed</Badge>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[550px]">
        {/* Channel / Thread List */}
        <Card title="Conversations & Threads" className="lg:col-span-1 flex flex-col justify-between">
          <div className="space-y-3">
            {channels.map((ch) => {
              const isActive = activeChannel === ch.id;
              return (
                <div
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-50/80 border-[#714B67] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isActive ? 'text-[#714B67]' : 'text-slate-900'}`}>{ch.title}</span>
                    <span className="text-[10px] text-slate-400">{ch.lastTime}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-2">{ch.lastMessage}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={ch.badgeVariant}>{ch.badge}</Badge>
                    <span className="text-[10px] text-slate-400 font-medium">{ch.subtitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Active Chat Window */}
        <Card title={activeChannelObj.title} subtitle={activeChannelObj.subtitle} className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {activeChatMessages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  msg.isMe ? 'bg-[#714B67] text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {msg.avatar}
                </div>
                <div className={`max-w-md p-3.5 rounded-2xl ${
                  msg.isMe
                    ? 'bg-[#714B67] text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none'
                }`}>
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className={`text-[11px] font-bold ${msg.isMe ? 'text-purple-200' : 'text-slate-600'}`}>{msg.sender}</span>
                    <span className={`text-[10px] ${msg.isMe ? 'text-purple-200' : 'text-slate-400'}`}>{msg.timestamp}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-200 flex items-center gap-3">
            <input
              type="text"
              placeholder="Type message or reply to negotiation comment..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#714B67]"
            />
            <Button type="submit" variant="primary" icon={Send}>
              Send
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default MessagesView;
