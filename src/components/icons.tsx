import { Smile, Frown, Angry, ShieldAlert, Meh, Bot } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface EmotionIconProps extends LucideProps {
  emotion: string;
}

export const EmotionIcon: React.FC<EmotionIconProps> = ({ emotion, ...props }) => {
  const emotionLower = emotion.toLowerCase();
  switch (emotionLower) {
    case 'happiness':
    case 'happy':
    case 'joy':
      return <Smile {...props} />;
    case 'sadness':
    case 'sad':
      return <Frown {...props} />;
    case 'anger':
    case 'angry':
      return <Angry {...props} />;
    case 'fear':
    case 'scared':
      return <ShieldAlert {...props} />;
    case 'neutral':
      return <Meh {...props} />;
    case 'surprise': // Example, AI might return other emotions
      return <Bot {...props} /> // Using Bot as a generic for unmapped/surprise
    default:
      return <Meh {...props} />;
  }
};
