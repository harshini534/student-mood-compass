import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoodEntry } from "./WellnessDashboard";
import { 
  Heart, 
  Brain, 
  Moon, 
  Sun, 
  Activity, 
  Book, 
  Users, 
  Coffee,
  Flower2,
  Music,
  Camera,
  Wind
} from "lucide-react";

interface WellnessRecommendationsProps {
  entries: MoodEntry[];
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'mental' | 'physical' | 'social' | 'creative';
  icon: any;
  color: string;
  bgColor: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
}

const recommendations: Recommendation[] = [
  {
    id: 'mindfulness',
    title: 'Mindfulness Meditation',
    description: 'Take 5-10 minutes to practice deep breathing and present-moment awareness.',
    category: 'mental',
    icon: Brain,
    color: 'text-primary',
    bgColor: 'bg-primary-soft/20',
    difficulty: 'easy',
    duration: '5-10 min'
  },
  {
    id: 'nature-walk',
    title: 'Nature Walk',
    description: 'Step outside for a gentle walk to boost your mood and get fresh air.',
    category: 'physical',
    icon: Wind,
    color: 'text-secondary',
    bgColor: 'bg-secondary-soft/20',
    difficulty: 'easy',
    duration: '15-30 min'
  },
  {
    id: 'gratitude-journal',
    title: 'Gratitude Journaling',
    description: 'Write down three things you\'re grateful for today.',
    category: 'mental',
    icon: Book,
    color: 'text-accent',
    bgColor: 'bg-accent-soft/20',
    difficulty: 'easy',
    duration: '5 min'
  },
  {
    id: 'friend-call',
    title: 'Connect with a Friend',
    description: 'Reach out to someone you care about for a meaningful conversation.',
    category: 'social',
    icon: Users,
    color: 'text-wellness-positive',
    bgColor: 'bg-wellness-positive/10',
    difficulty: 'medium',
    duration: '20-60 min'
  },
  {
    id: 'creative-time',
    title: 'Creative Expression',
    description: 'Engage in drawing, writing, music, or any creative activity you enjoy.',
    category: 'creative',
    icon: Camera,
    color: 'text-wellness-neutral',
    bgColor: 'bg-wellness-neutral/10',
    difficulty: 'medium',
    duration: '30-60 min'
  },
  {
    id: 'sleep-routine',
    title: 'Improve Sleep Hygiene',
    description: 'Create a calming bedtime routine to improve your sleep quality.',
    category: 'physical',
    icon: Moon,
    color: 'text-primary',
    bgColor: 'bg-primary-soft/20',
    difficulty: 'medium',
    duration: 'Ongoing'
  },
  {
    id: 'morning-routine',
    title: 'Morning Sunshine',
    description: 'Get 10-15 minutes of natural sunlight to regulate your circadian rhythm.',
    category: 'physical',
    icon: Sun,
    color: 'text-wellness-neutral',
    bgColor: 'bg-wellness-neutral/10',
    difficulty: 'easy',
    duration: '10-15 min'
  },
  {
    id: 'exercise',
    title: 'Physical Activity',
    description: 'Engage in any form of movement that feels good for your body.',
    category: 'physical',
    icon: Activity,
    color: 'text-secondary',
    bgColor: 'bg-secondary-soft/20',
    difficulty: 'medium',
    duration: '20-45 min'
  },
  {
    id: 'tea-mindfulness',
    title: 'Mindful Tea/Coffee',
    description: 'Savor your drink mindfully, focusing on the warmth, taste, and aroma.',
    category: 'mental',
    icon: Coffee,
    color: 'text-accent',
    bgColor: 'bg-accent-soft/20',
    difficulty: 'easy',
    duration: '10 min'
  },
  {
    id: 'breathing',
    title: 'Box Breathing',
    description: 'Practice 4-4-4-4 breathing pattern to calm your nervous system.',
    category: 'mental',
    icon: Flower2,
    color: 'text-primary',
    bgColor: 'bg-primary-soft/20',
    difficulty: 'easy',
    duration: '3-5 min'
  },
  {
    id: 'music-therapy',
    title: 'Music for Mood',
    description: 'Listen to music that matches or gently shifts your current emotional state.',
    category: 'creative',
    icon: Music,
    color: 'text-wellness-positive',
    bgColor: 'bg-wellness-positive/10',
    difficulty: 'easy',
    duration: '15-30 min'
  }
];

export const WellnessRecommendations = ({ entries }: WellnessRecommendationsProps) => {
  const getPersonalizedRecommendations = () => {
    if (entries.length === 0) {
      // Return general recommendations for new users
      return recommendations.slice(0, 6);
    }

    const recentEntries = entries.slice(0, 7); // Last 7 entries
    const avgMood = recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length;
    const mostCommonMood = recentEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantMood = Object.entries(mostCommonMood).sort(([,a], [,b]) => b - a)[0][0];

    let personalizedRecs = [...recommendations];

    // Prioritize based on mood patterns
    if (avgMood < 4) {
      // Low mood - prioritize mood-boosting activities
      personalizedRecs = personalizedRecs.sort((a, b) => {
        const moodBoostingIds = ['nature-walk', 'friend-call', 'mindfulness', 'music-therapy', 'morning-routine'];
        const aBoosts = moodBoostingIds.includes(a.id) ? 1 : 0;
        const bBoosts = moodBoostingIds.includes(b.id) ? 1 : 0;
        return bBoosts - aBoosts;
      });
    } else if (avgMood > 7) {
      // High mood - maintain with creative and social activities
      personalizedRecs = personalizedRecs.sort((a, b) => {
        const maintainingIds = ['creative-time', 'friend-call', 'exercise', 'gratitude-journal'];
        const aMaintains = maintainingIds.includes(a.id) ? 1 : 0;
        const bMaintains = maintainingIds.includes(b.id) ? 1 : 0;
        return bMaintains - aMaintains;
      });
    }

    // Add mood-specific recommendations
    if (dominantMood === 'anxious') {
      personalizedRecs = personalizedRecs.sort((a, b) => {
        const anxietyHelpingIds = ['breathing', 'mindfulness', 'tea-mindfulness', 'nature-walk'];
        const aHelps = anxietyHelpingIds.includes(a.id) ? 1 : 0;
        const bHelps = anxietyHelpingIds.includes(b.id) ? 1 : 0;
        return bHelps - aHelps;
      });
    }

    return personalizedRecs.slice(0, 6);
  };

  const personalizedRecs = getPersonalizedRecommendations();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mental': return Brain;
      case 'physical': return Activity;
      case 'social': return Users;
      case 'creative': return Camera;
      default: return Heart;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-wellness-positive text-white';
      case 'medium': return 'bg-wellness-neutral text-white';
      case 'hard': return 'bg-wellness-negative text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Personalized Wellness Tips</h2>
        <p className="text-muted-foreground">
          {entries.length > 0 
            ? "Based on your recent mood patterns, here are some activities that might help:"
            : "Here are some evidence-based wellness activities to support your mental health:"
          }
        </p>
      </div>

      {entries.length > 0 && (
        <Card className="p-4 bg-gradient-to-r from-primary-soft/10 to-accent-soft/10">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Your Recent Wellness Pattern</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on your last {Math.min(entries.length, 7)} check-ins, we've customized these recommendations to support your current needs.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalizedRecs.map((rec) => {
          const Icon = rec.icon;
          const CategoryIcon = getCategoryIcon(rec.category);
          
          return (
            <Card key={rec.id} className={`p-6 ${rec.bgColor} hover:shadow-medium transition-shadow`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-soft">
                    <Icon className={`w-5 h-5 ${rec.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{rec.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <CategoryIcon className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground capitalize">
                        {rec.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={getDifficultyColor(rec.difficulty)} variant="secondary">
                    {rec.difficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {rec.duration}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {rec.description}
              </p>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-white/50"
              >
                Try This Activity
              </Button>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 bg-gradient-to-r from-secondary-soft/10 to-wellness-positive/10">
        <div className="text-center">
          <Flower2 className="w-8 h-8 mx-auto text-secondary mb-3" />
          <h3 className="font-semibold mb-2">Remember</h3>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Small, consistent actions can make a big difference in your mental health. 
            Be patient and kind with yourself as you explore these wellness practices. 
            If you're experiencing persistent mental health challenges, consider reaching out to a mental health professional.
          </p>
        </div>
      </Card>
    </div>
  );
};