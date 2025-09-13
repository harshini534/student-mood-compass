import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoodCheckIn } from "./MoodCheckIn";
import { MoodTrends } from "./MoodTrends";
import { WellnessRecommendations } from "./WellnessRecommendations";
import { Heart, TrendingUp, Sparkles, Calendar } from "lucide-react";

export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  intensity: number;
  note?: string;
  timestamp: number;
}

const WellnessDashboard = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(() => {
    const saved = localStorage.getItem('moodEntries');
    return saved ? JSON.parse(saved) : [];
  });

  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
    
    // Check if user has already checked in today
    const today = new Date().toDateString();
    const todayEntry = moodEntries.find(entry => 
      new Date(entry.date).toDateString() === today
    );
    setHasCheckedInToday(!!todayEntry);
  }, [moodEntries]);

  const handleMoodSubmit = (moodData: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      ...moodData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setMoodEntries(prev => [newEntry, ...prev]);
  };

  const getStreakCount = () => {
    if (moodEntries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toDateString();
      
      const hasEntry = moodEntries.some(entry => 
        new Date(entry.date).toDateString() === dateString
      );
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = getStreakCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/20 to-accent-soft/20">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-wellness rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-wellness bg-clip-text text-transparent">
              WellnessMind
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Your personal mental health companion
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentStreak}</p>
                <p className="text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{moodEntries.length}</p>
                <p className="text-muted-foreground">Check-ins</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft hover:shadow-medium transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {moodEntries.length > 0 ? 
                    Math.round(moodEntries.slice(0, 7).reduce((acc, entry) => acc + entry.intensity, 0) / Math.min(7, moodEntries.length))
                    : 0
                  }
                </p>
                <p className="text-muted-foreground">Avg Mood</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="checkin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="checkin">Daily Check-in</TabsTrigger>
            <TabsTrigger value="trends">Mood Trends</TabsTrigger>
            <TabsTrigger value="wellness">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="checkin">
            <Card className="p-6 shadow-medium">
              {hasCheckedInToday ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-secondary mx-auto rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Great job!</h3>
                  <p className="text-muted-foreground mb-4">
                    You've already checked in today. Come back tomorrow to continue your streak!
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setHasCheckedInToday(false)}
                  >
                    Update Today's Entry
                  </Button>
                </div>
              ) : (
                <MoodCheckIn onSubmit={handleMoodSubmit} />
              )}
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card className="p-6 shadow-medium">
              <MoodTrends entries={moodEntries} />
            </Card>
          </TabsContent>

          <TabsContent value="wellness">
            <Card className="p-6 shadow-medium">
              <WellnessRecommendations entries={moodEntries} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WellnessDashboard;