import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmotionIcon } from "@/components/icons";
import type { EmotionAnalysisResult } from "@/actions/emotionActions";

interface CurrentEmotionDisplayProps {
  analysis: EmotionAnalysisResult | null;
  analyzedText: string | null;
}

const CurrentEmotionDisplay: React.FC<CurrentEmotionDisplayProps> = ({ analysis, analyzedText }) => {
  if (!analysis || !analyzedText) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Current Emotion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Enter text and click "Analyze" to see the emotion.</p>
        </CardContent>
      </Card>
    );
  }

  const { dominantEmotion, emotionIntensity } = analysis;
  const intensityPercentage = Math.round(emotionIntensity * 100);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <EmotionIcon emotion={dominantEmotion} className="h-10 w-10 text-accent" />
          <div>
            <CardTitle className="text-2xl font-headline">{dominantEmotion || "N/A"}</CardTitle>
            <CardDescription>Detected Emotion</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Analyzed Text:</h3>
          <p className="mt-1 text-sm p-3 bg-secondary rounded-md max-h-24 overflow-y-auto">"{analyzedText}"</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Intensity: {intensityPercentage}%</h3>
          <Progress value={intensityPercentage} aria-label={`Emotion intensity: ${intensityPercentage}%`} className="h-3 [&>div]:bg-accent" />
        </div>
        {analysis.emotionalBreakdown && Object.keys(analysis.emotionalBreakdown).length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Emotional Breakdown:</h3>
            <ul className="space-y-1 text-xs">
              {Object.entries(analysis.emotionalBreakdown)
                .sort(([, a], [, b]) => b - a) // Sort by intensity desc
                .map(([emotion, score]) => (
                  <li key={emotion} className="flex justify-between items-center">
                    <span>{emotion}:</span>
                    <span className="font-semibold">{Math.round(score * 100)}%</span>
                  </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrentEmotionDisplay;
