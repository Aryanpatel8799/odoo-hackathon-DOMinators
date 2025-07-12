import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCards = () => {
  const metrics = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      changeType: "increase",
      icon: "Users",
      color: "bg-primary",
      description: "Active platform members"
    },
    {
      title: "Active Swaps",
      value: "156",
      change: "+8.2%",
      changeType: "increase",
      icon: "ArrowLeftRight",
      color: "bg-success",
      description: "Ongoing skill exchanges"
    },
    {
      title: "Reported Issues",
      value: "23",
      change: "-15.3%",
      changeType: "decrease",
      icon: "AlertTriangle",
      color: "bg-warning",
      description: "Pending moderation"
    },
    {
      title: "Growth Rate",
      value: "18.7%",
      change: "+3.1%",
      changeType: "increase",
      icon: "TrendingUp",
      color: "bg-secondary",
      description: "Monthly user growth"
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
              metric.changeType === 'increase' ? 'text-success' : 'text-destructive'
            }`}>
              <Icon 
                name={metric.changeType === 'increase' ? 'ArrowUp' : 'ArrowDown'} 
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