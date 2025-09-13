import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { MoodEntry } from "./WellnessDashboard";
import { Smile, Meh, Frown, Heart, Zap, CloudRain, Sun } from "lucide-react";

interface MoodCheckInProps {
  onSubmit: (moodData: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
}

const moodOptions = [
  { id: 'happy', label: 'Happy', icon: Smile, color: 'text-wellness-positive', bgColor: 'bg-wellness-positive/10' },
  { id: 'excited', label: 'Excited', icon: Zap, color: 'text-wellness-neutral', bgColor: 'bg-wellness-neutral/10' },
  { id: 'calm', label: 'Calm', icon: Sun, color: 'text-primary', bgColor: 'bg-primary-soft/20' },
  { id: 'neutral', label: 'Neutral', icon: Meh, color: 'text-muted-foreground', bgColor: 'bg-muted' },
  { id: 'anxious', label: 'Anxious', icon: CloudRain, color: 'text-wellness-negative', bgColor: 'bg-wellness-negative/10' },
  { id: 'sad', label: 'Sad', icon: Frown, color: 'text-wellness-negative', bgColor: 'bg-wellness-negative/10' },
];

export const MoodCheckIn = ({ onSubmit }: MoodCheckInProps) => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [intensity, setIntensity] = useState<number[]>([5]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood) return;

    setIsSubmitting(true);
    
    const moodData = {
      date: new Date().toISOString(),
      mood: selectedMood,
      intensity: intensity[0],
      note: note.trim() || undefined,
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit(moodData);
    
    // Reset form
    setSelectedMood("");
    setIntensity([5]);
    setNote("");
    setIsSubmitting(false);
  };

  const selectedMoodOption = moodOptions.find(option => option.id === selectedMood);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">How are you feeling today?</h2>
        <p className="text-muted-foreground">
          Take a moment to reflect on your current emotional state
        </p>
      </div>

      {/* Mood Selection */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Select your mood</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {moodOptions.map((mood) => {
            const Icon = mood.icon;
            const isSelected = selectedMood === mood.id;
            
            return (
              <Card
                key={mood.id}
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-soft ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-soft scale-105' 
                    : 'hover:scale-102'
                } ${mood.bgColor}`}
                onClick={() => setSelectedMood(mood.id)}
              >
                <div className="text-center space-y-2">
                  <Icon className={`w-8 h-8 mx-auto ${mood.color}`} />
                  <p className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {mood.label}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Intensity Slider */}
      {selectedMood && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">
              How intense is this feeling?
            </Label>
            <span className="text-sm font-medium px-2 py-1 bg-primary-soft rounded-md">
              {intensity[0]}/10
            </span>
          </div>
          <div className="px-3">
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Mild</span>
              <span>Intense</span>
            </div>
          </div>
        </div>
      )}

      {/* Optional Note */}
      <div className="space-y-2">
        <Label htmlFor="note" className="text-base font-medium">
          Add a note (optional)
        </Label>
        <Textarea
          id="note"
          placeholder="What's on your mind? Any specific thoughts or events affecting your mood?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!selectedMood || isSubmitting}
          className="w-full md:w-auto px-8 py-3 text-base font-medium bg-gradient-primary hover:opacity-90 transition-opacity"
          size="lg"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Recording...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Record Mood
            </div>
          )}
        </Button>
      </div>

      {selectedMoodOption && (
        <div className="text-center p-4 bg-gradient-to-r from-primary-soft/20 to-accent-soft/20 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <selectedMoodOption.icon className={`w-5 h-5 ${selectedMoodOption.color}`} />
            <span className="font-medium">
              Feeling {selectedMoodOption.label.toLowerCase()} at intensity {intensity[0]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your emotional awareness is the first step toward better mental health
          </p>
        </div>
      )}
    </div>
  );
};