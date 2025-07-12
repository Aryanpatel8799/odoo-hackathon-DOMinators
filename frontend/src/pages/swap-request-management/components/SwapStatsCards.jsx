import React from 'react';
import Icon from '../../../components/AppIcon';

const SwapStatsCards = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Swaps',
      value: stats.total,
      icon: 'ArrowLeftRight',
      color: 'bg-primary',
      textColor: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Pending Requests',
      value: stats.pending,
      icon: 'Clock',
      color: 'bg-warning',
      textColor: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Active Swaps',
      value: stats.active,
      icon: 'CheckCircle',
      color: 'bg-success',
      textColor: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: 'Trophy',
      color: 'bg-accent',
      textColor: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {card.value}
              </p>
            </div>
            <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={card.icon} size={24} className={card.textColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SwapStatsCards;