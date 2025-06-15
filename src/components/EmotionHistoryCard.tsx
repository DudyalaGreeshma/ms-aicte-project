import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmotionIcon } from "@/components/icons";
import type { EmotionAnalysisResult } from "@/actions/emotionActions";
import { formatDistanceToNow } from 'date-fns';


interface EmotionHistoryItem {
  id: string;
  text: string;
  analysis: EmotionAnalysisResult;
}

interface EmotionHistoryCardProps {
  item: EmotionHistoryItem;
}

const EmotionHistoryCard: React.FC<EmotionHistoryCardProps> = ({ item }) => {
  const { text, analysis } = item;
  const { dominantEmotion, timestamp } = analysis;

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <EmotionIcon emotion={dominantEmotion} className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg font-headline">{dominantEmotion}</CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm line-clamp-2" title={text}>
          "{text}"
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default EmotionHistoryCard;
