import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Mic, MicOff, Volume2, Users, MessageCircle, Loader2 } from 'lucide-react';
import { logger } from '@/services/logService';
import { 
  generateGroupmateResponse, 
  speakGroupmateResponse, 
  createSpeechRecognition,
  GROUPMATE_INFO 
} from '@/services/aiGroupmateService';
import { getRandomQuestionByType, Question } from '@/data/questionBank';

interface GroupDiscussionProps {
  grade: string;
  onComplete: (results: any) => void;
  onBack: () => void;
}

interface DiscussionMessage {
  id: number;
  speaker: 'user' | 'alex' | 'jordan' | 'system';
  text: string;
  timestamp: Date;
}

const GroupDiscussion: React.FC<GroupDiscussionProps> = ({ grade, onComplete, onBack }) => {
  const [topic, setTopic] = useState<Question | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [discussionPhase, setDiscussionPhase] = useState<'intro' | 'discussion' | 'complete'>('intro');
  const [turnCount, setTurnCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  const MAX_TURNS = 6; // 6 turns total (user speaks 3 times, AI responds each time)

  // Load a discussion topic
  useEffect(() => {
    const loadTopic = () => {
      // Try to get a group discussion question
      let question = getRandomQuestionByType(grade, 'dse_group');
      
      // Fallback for P4-P6 or if no group discussion found
      if (!question) {
        question = getRandomQuestionByType(grade, 'speaking');
      }
      
      if (question) {
        setTopic(question);
        logger.info('Discussion topic loaded', { topic: question.text, grade });
      } else {
        // Default topic
        setTopic({
          id: 0,
          text: 'Discuss the advantages and disadvantages of social media for students.',
          section: 'Group Discussion',
          grade,
          type: 'dse_group'
        });
      }
      setIsLoading(false);
    };

    loadTopic();
  }, [grade]);

  // Initialize speech recognition
  useEffect(() => {
    recognitionRef.current = createSpeechRecognition();
    
    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentTranscript(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        logger.error('Speech recognition error', { error: event.error });
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          // Restart if still supposed to be recording
          try {
            recognitionRef.current?.start();
          } catch (e) {
            logger.warn('Could not restart recognition');
          }
        }
      };
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, [isRecording]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start the discussion with intro
  const startDiscussion = useCallback(async () => {
    if (!topic) return;

    setDiscussionPhase('discussion');
    
    const introMessage = `Welcome to our group discussion! Today's topic is: "${topic.text}". I'm Alex, and this is Jordan. We'll take turns sharing our thoughts. Why don't you start by sharing your opinion?`;
    
    addMessage('system', introMessage);
    
    // Speak the introduction
    setIsSpeaking(true);
    try {
      await speakGroupmateResponse(introMessage, 'female');
    } catch (e) {
      logger.warn('Could not speak intro');
    }
    setIsSpeaking(false);
  }, [topic]);

  const addMessage = (speaker: DiscussionMessage['speaker'], text: string) => {
    messageIdRef.current += 1;
    setMessages(prev => [...prev, {
      id: messageIdRef.current,
      speaker,
      text,
      timestamp: new Date()
    }]);
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      logger.error('Speech recognition not available');
      return;
    }

    setCurrentTranscript('');
    setIsRecording(true);
    
    try {
      recognitionRef.current.start();
      logger.info('Started recording user speech');
    } catch (e) {
      logger.error('Failed to start recording', { error: e });
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsRecording(false);
    
    if (!currentTranscript.trim()) {
      logger.warn('No speech detected');
      return;
    }

    // Add user's message
    addMessage('user', currentTranscript);
    logger.info('User finished speaking', { transcript: currentTranscript });

    // Process AI responses
    await processAIResponses(currentTranscript);
    
    setCurrentTranscript('');
    setTurnCount(prev => prev + 1);
  };

  const processAIResponses = async (userTranscript: string) => {
    if (!topic) return;

    setIsProcessing(true);
    const conversationHistory = messages.map(m => `${m.speaker}: ${m.text}`);

    try {
      // Randomly decide order of AI responses
      const supporterFirst = Math.random() > 0.5;
      const firstStance = supporterFirst ? 'support' : 'oppose';
      const secondStance = supporterFirst ? 'oppose' : 'support';

      // Generate and speak first AI response
      setIsSpeaking(true);
      const firstResponse = await generateGroupmateResponse(
        topic.text,
        userTranscript,
        firstStance,
        conversationHistory
      );
      
      addMessage(firstResponse.groupmateName.toLowerCase() as 'alex' | 'jordan', firstResponse.text);
      
      await speakGroupmateResponse(
        firstResponse.text, 
        firstResponse.groupmateName === 'Alex' ? 'female' : 'male'
      );

      // Small pause between responses
      await new Promise(resolve => setTimeout(resolve, 800));

      // Generate and speak second AI response
      const secondResponse = await generateGroupmateResponse(
        topic.text,
        userTranscript + ' ' + firstResponse.text,
        secondStance,
        [...conversationHistory, `${firstResponse.groupmateName}: ${firstResponse.text}`]
      );
      
      addMessage(secondResponse.groupmateName.toLowerCase() as 'alex' | 'jordan', secondResponse.text);
      
      await speakGroupmateResponse(
        secondResponse.text,
        secondResponse.groupmateName === 'Alex' ? 'female' : 'male'
      );

      setIsSpeaking(false);

      // Check if discussion should end
      if (turnCount + 1 >= MAX_TURNS / 2) {
        setDiscussionPhase('complete');
        const closingMessage = "That was a great discussion! Thank you for sharing your thoughts with us.";
        addMessage('system', closingMessage);
        await speakGroupmateResponse(closingMessage, 'female');
      }

    } catch (error) {
      logger.error('Error processing AI responses', { error });
      setIsSpeaking(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = () => {
    onComplete({
      topic: topic?.text,
      messages,
      turnCount,
      grade
    });
  };

  const getSpeakerColor = (speaker: DiscussionMessage['speaker']) => {
    switch (speaker) {
      case 'user': return 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700';
      case 'alex': return 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700';
      case 'jordan': return 'bg-orange-100 dark:bg-orange-900/50 border-orange-300 dark:border-orange-700';
      case 'system': return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
      default: return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  const getSpeakerLabel = (speaker: DiscussionMessage['speaker']) => {
    switch (speaker) {
      case 'user': return '🎤 You';
      case 'alex': return `${GROUPMATE_INFO.supporter.avatar} Alex (Supportive)`;
      case 'jordan': return `${GROUPMATE_INFO.opposer.avatar} Jordan (Critical)`;
      case 'system': return '📢 Moderator';
      default: return speaker;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading discussion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Badge className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-4 py-2">
            <Users className="w-4 h-4 mr-2" />
            Group Discussion - {grade}
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Group Discussion</h1>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Turn {Math.min(turnCount + 1, MAX_TURNS / 2)} / {MAX_TURNS / 2}
            </span>
          </div>
          <Progress value={(turnCount / (MAX_TURNS / 2)) * 100} className="h-2" />
        </div>

        {/* Topic Card */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-purple-600" />
              Discussion Topic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{topic?.text}</p>
            
            {/* Groupmates Info */}
            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-xl">{GROUPMATE_INFO.supporter.avatar}</span>
                <span><strong>Alex</strong> - Supportive</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-xl">{GROUPMATE_INFO.opposer.avatar}</span>
                <span><strong>Jordan</strong> - Critical Thinker</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discussion Messages */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white">Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {messages.length === 0 && discussionPhase === 'intro' && (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Ready to start the group discussion?
                  </p>
                  <Button 
                    onClick={startDiscussion}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Start Discussion
                  </Button>
                </div>
              )}

              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={`p-4 rounded-lg border-2 ${getSpeakerColor(message.speaker)}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                      {getSpeakerLabel(message.speaker)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">{message.text}</p>
                </div>
              ))}

              {/* Current transcript preview */}
              {isRecording && currentTranscript && (
                <div className="p-4 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-blue-700 dark:text-blue-300">
                      🎤 You (recording...)
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic">{currentTranscript}</p>
                </div>
              )}

              {/* Processing indicator */}
              {isProcessing && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">AI groupmates are thinking...</span>
                </div>
              )}

              {/* Speaking indicator */}
              {isSpeaking && !isProcessing && (
                <div className="flex items-center justify-center py-4">
                  <Volume2 className="w-6 h-6 text-green-600 animate-pulse mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">AI is speaking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        {discussionPhase === 'discussion' && (
          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <Button
                size="lg"
                onClick={startRecording}
                disabled={isProcessing || isSpeaking}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              >
                <Mic className="w-6 h-6" />
                Start Speaking
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={stopRecording}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg animate-pulse"
              >
                <MicOff className="w-6 h-6" />
                Stop & Submit
              </Button>
            )}
          </div>
        )}

        {discussionPhase === 'complete' && (
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleComplete}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg"
            >
              Complete Discussion
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDiscussion;
