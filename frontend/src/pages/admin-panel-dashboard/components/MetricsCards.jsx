import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCards = ({ stats }) => {
  // Use real data if available, otherwise fallback to mock data
  const metrics = [
    {
      title: "Total Users",
      value: stats?.users?.total || "0",
      change: "+0%",
      changeType: "increase",
      icon: "Users",
      color: "bg-primary",
      description: "Active platform members"
    },
    {
      title: "Active Swaps",
      value: stats?.swaps?.total || "0",
      change: "+0%",
      changeType: "increase",
      icon: "ArrowLeftRight",
      color: "bg-success",
      description: "Ongoing skill exchanges"
    },
    {
      title: "Banned Users",
      value: stats?.users?.banned || "0",
      change: "0%",
      changeType: "neutral",
      icon: "AlertTriangle",
      color: "bg-warning",
      description: "Suspended accounts"
    },
    {
      title: "Completed Swaps",
      value: stats?.swaps?.completed || "0",
      change: "+0%",
      changeType: "increase",
      icon: "TrendingUp",
      color: "bg-secondary",
      description: "Successful exchanges"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-2 transition-all duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
              <Icon name={metric.icon} size={24} color="white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              metric.changeType === 'increase' ? 'text-success' : 
              metric.changeType === 'decrease' ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              <Icon 
                name={metric.changeType === 'increase' ? 'ArrowUp' : 
                      metric.changeType === 'decrease' ? 'ArrowDown' : 'Minus'} 
                size={16} 
              />
              <span>{metric.change}</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">{metric.value}</h3>
            <p className="text-sm font-medium text-foreground">{metric.title}</p>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;