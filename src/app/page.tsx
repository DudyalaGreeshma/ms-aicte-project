"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Settings, History, Mic, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EmotiVoiceLogo from "@/components/EmotiVoiceLogo";
import CurrentEmotionDisplay from "@/components/CurrentEmotionDisplay";
import EmotionHistoryCard from "@/components/EmotionHistoryCard";
import { getEmotionAnalysis, type EmotionAnalysisResult, type EmotionAnalysisError } from "@/actions/emotionActions";

interface EmotionHistoryItem {
  id: string;
  text: string;
  analysis: EmotionAnalysisResult;
}

export default function Home() {
  const [inputText, setInputText] = useState<string>("");
  const [currentAnalysis, setCurrentAnalysis] = useState<EmotionAnalysisResult | null>(null);
  const [analyzedTextForDisplay, setAnalyzedTextForDisplay] = useState<string | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const historyEndRef = useRef<HTMLDivElement>(null);

  // Mock microphone devices
  const [microphoneDevices, setMicrophoneDevices] = useState<{ id: string; label: string }[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Mock fetching microphone devices - in a real app, use navigator.mediaDevices.enumerateDevices()
    // This runs client-side only.
    setMicrophoneDevices([
      { id: "default", label: "Default Microphone" },
      { id: "usb-mic", label: "USB Microphone (Model X)" },
      { id: "internal-mic", label: "Internal Laptop Mic" },
    ]);
    setSelectedMicrophone("default");
  }, []);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [emotionHistory]);


  const handleAnalyzeText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Error",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setCurrentAnalysis(null); // Clear previous analysis immediately

    const result = await getEmotionAnalysis(inputText);

    if ("error" in result) {
      toast({
        title: "Analysis Error",
        description: (result as EmotionAnalysisError).error,
        variant: "destructive",
      });
      setCurrentAnalysis(null);
    } else {
      const analysisResult = result as EmotionAnalysisResult;
      setCurrentAnalysis(analysisResult);
      setAnalyzedTextForDisplay(inputText);
      setEmotionHistory(prev => [
        ...prev,
        { id: Date.now().toString(), text: inputText, analysis: analysisResult }
      ].slice(-10)); // Keep last 10 entries
      // setInputText(""); // Optionally clear input text
    }
    setIsLoading(false);
  };
  
  const handleRecordVoice = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Real-time voice recording and transcription via Azure Speech Services is planned for a future update.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground p-4 sm:p-6 md:p-8 font-body">
      <header className="mb-6 sm:mb-8">
        <EmotiVoiceLogo />
        <p className="text-muted-foreground mt-1 text-sm">
          Understand emotional tones from text input.
        </p>
      </header>

      <main className="flex-grow grid md:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Input & Current Emotion */}
        <section className="md:col-span-2 flex flex-col space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><Wand2 className="mr-2 h-5 w-5 text-primary" />Analyze Text Emotion</CardTitle>
              <CardDescription>
                Type or paste text below to detect its emotional tone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={6}
                className="resize-none text-base"
                aria-label="Text input for emotion analysis"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleAnalyzeText}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                  aria-label="Analyze text for emotions"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Analyze
                </Button>
                 <Button
                  onClick={handleRecordVoice}
                  variant="outline"
                  className="w-full sm:w-auto"
                  aria-label="Record voice (coming soon)"
                  disabled 
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Record Voice (Soon)
                </Button>
              </div>
            </CardContent>
          </Card>

          <CurrentEmotionDisplay analysis={currentAnalysis} analyzedText={analyzedTextForDisplay} />
        
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><Settings className="mr-2 h-5 w-5 text-primary" />Input Configuration</CardTitle>
              <CardDescription>
                Configure your audio input source. (Placeholder for Azure Speech Services integration)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
               <p className="text-sm text-muted-foreground">
                Real-time voice input via Azure Speech Services is currently under development.
                The settings below are for demonstration purposes.
              </p>
              <div>
                <label htmlFor="mic-select" className="text-sm font-medium">Microphone Source</label>
                <Select value={selectedMicrophone} onValueChange={setSelectedMicrophone} disabled>
                  <SelectTrigger id="mic-select" className="w-full mt-1" aria-label="Select microphone source (disabled)">
                    <SelectValue placeholder="Select microphone" />
                  </SelectTrigger>
                  <SelectContent>
                    {microphoneDevices.map(device => (
                      <SelectItem key={device.id} value={device.id}>{device.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right Column: Emotion History */}
        <section className="md:col-span-1 flex flex-col">
          <Card className="flex-grow flex flex-col shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center"><History className="mr-2 h-5 w-5 text-primary" />Emotion History</CardTitle>
              <CardDescription>Recently detected emotional states.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-0">
              {emotionHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full p-6">
                  <p className="text-muted-foreground">No history yet. Analyze some text!</p>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-20rem)] sm:h-[calc(100vh-22rem)] md:h-full pr-6 pb-6 pl-6"> {/* Adjusted height */}
                  <div className="space-y-4">
                    {emotionHistory.map((item) => (
                      <EmotionHistoryCard key={item.id} item={item} />
                    ))}
                    <div ref={historyEndRef} />
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <Separator className="my-4" />
        <p>&copy; {new Date().getFullYear()} EmotiVoice. Powered by AI.</p>
      </footer>
    </div>
  );
}
