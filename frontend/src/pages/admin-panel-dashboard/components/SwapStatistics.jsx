import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


const SwapStatistics = () => {
  const completionData = [
    { month: 'Jan', completed: 45, pending: 12, cancelled: 8 },
    { month: 'Feb', completed: 52, pending: 15, cancelled: 6 },
    { month: 'Mar', completed: 48, pending: 18, cancelled: 9 },
    { month: 'Apr', completed: 61, pending: 14, cancelled: 7 },
    { month: 'May', completed: 55, pending: 16, cancelled: 5 },
    { month: 'Jun', completed: 67, pending: 19, cancelled: 8 },
    { month: 'Jul', completed: 58, pending: 13, cancelled: 4 }
  ];

  const skillCategoryData = [
    { name: 'Programming', value: 35, color: '#2563EB' },
    { name: 'Design', value: 25, color: '#7C3AED' },
    { name: 'Languages', value: 20, color: '#10B981' },
    { name: 'Music', value: 12, color: '#F59E0B' },
    { name: 'Others', value: 8, color: '#EF4444' }
  ];

  const geographicData = [
    { region: 'North America', users: 1247, percentage: 43.8 },
    { region: 'Europe', users: 892, percentage: 31.3 },
    { region: 'Asia Pacific', users: 456, percentage: 16.0 },
    { region: 'Latin America', users: 152, percentage: 5.3 },
    { region: 'Others', users: 100, percentage: 3.6 }
  ];

  return (
    <div className="space-y-6">
      {/* Swap Completion Rates */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Swap Completion Trends</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span className="text-sm text-muted-foreground">Cancelled</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="completed" fill="var(--color-success)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="pending" fill="var(--color-warning)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="cancelled" fill="var(--color-destructive)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Skill Categories */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Popular Skill Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {skillCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {skillCategoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-foreground">{category.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{category.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Geographic Distribution</h3>
          <div className="space-y-4">
            {geographicData.map((region, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{region.region}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{region.users} users</span>
                    <span className="text-sm font-medium text-foreground">{region.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${region.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapStatistics;