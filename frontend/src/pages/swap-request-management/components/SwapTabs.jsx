import React from 'react';
import Icon from '../../../components/AppIcon';

const SwapTabs = ({ activeTab, onTabChange, counts }) => {
  const tabs = [
    {
      id: 'pending',
      label: 'Pending',
      icon: 'Clock',
      count: counts.pending,
      description: 'Requests awaiting response'
    },
    {
      id: 'accepted',
      label: 'Accepted',
      icon: 'CheckCircle',
      count: counts.accepted,
      description: 'Confirmed skill exchanges'
    },
    {
      id: 'history',
      label: 'History',
      icon: 'History',
      count: counts.history,
      description: 'Completed and past swaps'
    }
  ];

  return (
    <div className="border-b border-border mb-6">
      {/* Desktop Tabs */}
      <div className="hidden md:flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 pb-4 border-b-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
            }`}
          >
            <Icon name={tab.icon} size={20} />
            <span className="font-medium">{tab.label}</span>
            {tab.count > 0 && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Mobile Tabs */}
      <div className="md:hidden">
        <div className="flex space-x-1 p-1 bg-muted rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center space-y-1 py-3 px-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }`}
            >
              <div className="flex items-center space-x-1">
                <Icon name={tab.icon} size={16} />
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${
                    activeTab === tab.id
                      ? 'bg-primary-foreground text-primary'
                      : 'bg-muted-foreground text-background'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Description */}
      <div className="mt-4 mb-6">
        <p className="text-sm text-muted-foreground">
          {tabs.find(tab => tab.id === activeTab)?.description}
        </p>
      </div>
    </div>
  );
};

export default SwapTabs;