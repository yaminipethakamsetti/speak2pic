import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AudioRecorder } from "@/components/AudioRecorder";
import { LanguageSelector } from "@/components/LanguageSelector";
import { PromptEditor } from "@/components/PromptEditor";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [language, setLanguage] = useState("auto");
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleTranscription = (text: string) => {
    setPrompt(text);
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "No prompt",
        description: "Please record or enter a prompt first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: prompt.trim() }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        setImageUrl(data.imageUrl);
        toast({
          title: "Image generated!",
          description: "Your AI-generated image is ready",
        });
      } else {
        throw new Error('No image returned');
      }
    } catch (error) {
      console.error('Image generation error:', error);
      toast({
        title: "Generation failed",
        description: "Could not generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <header className="text-center space-y-3 pt-8">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Audio Visionary
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your voice into stunning images with AI-powered transcription and generation
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Recording & Prompt */}
          <div className="space-y-6">
            {/* Audio Recording Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Record Your Vision
                </CardTitle>
                <CardDescription>
                  Speak your image description into the microphone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <AudioRecorder 
                  language={language} 
                  onTranscription={handleTranscription}
                />
                <LanguageSelector value={language} onChange={setLanguage} />
              </CardContent>
            </Card>

            {/* Prompt Editor Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Refine & Generate</CardTitle>
                <CardDescription>
                  Edit your prompt and create your image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <PromptEditor value={prompt} onChange={setPrompt} />
                <Button 
                  onClick={handleGenerateImage}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Image
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Image Display */}
          <Card className="shadow-lg lg:sticky lg:top-8 h-fit">
            <CardHeader>
              <CardTitle>Your Creation</CardTitle>
              <CardDescription>
                AI-generated artwork based on your prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageDisplay imageUrl={imageUrl} isGenerating={isGenerating} />
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground py-8">
          <p>Powered by Gemini AI & Stability AI</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
