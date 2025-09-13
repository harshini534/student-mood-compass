import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MoodEntry } from './WellnessDashboard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react';

interface MoodTrendsProps {
  entries: MoodEntry[];
}

export const MoodTrends = ({ entries }: MoodTrendsProps) => {
  // Prepare data for line chart (last 30 days)
  const getLast30DaysData = () => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayEntries = entries.filter(entry => 
        entry.date.split('T')[0] === dateString
      );
      
      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum, entry) => sum + entry.intensity, 0) / dayEntries.length
        : null;
      
      last30Days.push({
        date: dateString,
        mood: avgMood,
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        hasData: dayEntries.length > 0
      });
    }
    
    return last30Days;
  };

  // Prepare mood distribution data
  const getMoodDistribution = () => {
    const moodCounts: Record<string, number> = {};
    
    entries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood: mood.charAt(0).toUpperCase() + mood.slice(1),
      count,
      percentage: Math.round((count / entries.length) * 100)
    }));
  };

  // Calculate trend
  const calculateTrend = () => {
    if (entries.length < 2) return null;
    
    const recent = entries.slice(0, 7);
    const previous = entries.slice(7, 14);
    
    if (recent.length === 0 || previous.length === 0) return null;
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.intensity, 0) / recent.length;
    const previousAvg = previous.reduce((sum, entry) => sum + entry.intensity, 0) / previous.length;
    
    const change = recentAvg - previousAvg;
    
    return {
      change: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      recentAvg: Math.round(recentAvg * 10) / 10,
      previousAvg: Math.round(previousAvg * 10) / 10
    };
  };

  const lineData = getLast30DaysData();
  const distributionData = getMoodDistribution();
  const trend = calculateTrend();

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No mood data yet</h3>
        <p className="text-muted-foreground">
          Start logging your daily moods to see beautiful insights and trends here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Your Mood Journey</h2>
        <p className="text-muted-foreground">
          Visualize your emotional patterns and progress over time
        </p>
      </div>

      {/* Trend Summary */}
      {trend && (
        <Card className="p-6 bg-gradient-to-r from-primary-soft/10 to-accent-soft/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Recent Trend</h3>
              <p className="text-sm text-muted-foreground">
                Last 7 days vs previous 7 days
              </p>
            </div>
            <div className="flex items-center gap-2">
              {trend.direction === 'up' ? (
                <TrendingUp className="w-5 h-5 text-wellness-positive" />
              ) : trend.direction === 'down' ? (
                <TrendingDown className="w-5 h-5 text-wellness-negative" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-muted" />
              )}
              <Badge variant={
                trend.direction === 'up' ? 'default' : 
                trend.direction === 'down' ? 'destructive' : 
                'secondary'
              }>
                {trend.direction === 'stable' ? 'Stable' : 
                 `${trend.change.toFixed(1)} point ${trend.direction}`}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* 30-Day Mood Line Chart */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">30-Day Mood Trend</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                domain={[1, 10]} 
                tick={{ fontSize: 12 }}
                label={{ value: 'Mood Intensity', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card p-3 rounded-lg shadow-medium border">
                        <p className="font-medium">{label}</p>
                        {data.hasData ? (
                          <p className="text-primary">
                            Mood: {typeof payload[0].value === 'number' ? payload[0].value.toFixed(1) : payload[0].value}/10
                          </p>
                        ) : (
                          <p className="text-muted-foreground">No data</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                connectNulls={false}
                className="drop-shadow-sm"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Mood Distribution */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">Mood Distribution</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="mood" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload[0]) {
                    return (
                      <div className="bg-card p-3 rounded-lg shadow-medium border">
                        <p className="font-medium">{label}</p>
                        <p className="text-accent">
                          Count: {payload[0].value}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {payload[0].payload.percentage}% of entries
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--accent))" 
                radius={[4, 4, 0, 0]}
                className="drop-shadow-sm"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Entries */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent Check-ins</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {entries.slice(0, 5).map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {entry.mood}
                  </Badge>
                  <span className="text-sm font-medium">
                    {entry.intensity}/10
                  </span>
                </div>
                {entry.note && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {entry.note}
                  </p>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(entry.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};