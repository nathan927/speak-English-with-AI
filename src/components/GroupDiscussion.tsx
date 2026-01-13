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
  generateRandomGroupmate
} from '@/services/aiGroupmateService';
import { getRandomQuestionByType, Question } from '@/data/questionBank';

interface GroupDiscussionProps {
  grade: string;
  onComplete: (results: any) => void;
  onBack: () => void;
}

interface GroupmateIdentity {
  name: string;
  gender: 'male' | 'female';
  avatar: string;
  stance: 'support' | 'oppose';
}

interface DiscussionMessage {
  id: number;
  speaker: 'user' | 'groupmate1' | 'groupmate2' | 'system';
  speakerName?: string;
  speakerAvatar?: string;
  stance?: 'support' | 'oppose';
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
  
  // Random groupmates - regenerated each session
  const [groupmates, setGroupmates] = useState<{ supporter: GroupmateIdentity; opposer: GroupmateIdentity } | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  const MAX_TURNS = 6; // 6 turns total (user speaks 3 times, AI responds each time)

  // Generate random groupmates on mount
  useEffect(() => {
    const supporter = generateRandomGroupmate();
    let opposer = generateRandomGroupmate();
    
    // Make sure they have different names
    while (opposer.name === supporter.name) {
      opposer = generateRandomGroupmate();
    }
    
    setGroupmates({
      supporter: { ...supporter, stance: 'support' },
      opposer: { ...opposer, stance: 'oppose' }
    });
    
    logger.info('Generated random groupmates', {
      supporter: supporter.name,
      opposer: opposer.name
    });
  }, []);

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
      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentTranscript(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
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
    if (!topic || !groupmates) return;

    setDiscussionPhase('discussion');
    
    // Exam-style introduction
    const introMessage = `Good afternoon everyone. Welcome to our group discussion for the DSE English Speaking Examination. Today's topic is: "${topic.text}". I'm ${groupmates.supporter.name}, and joining us is ${groupmates.opposer.name}. We have about 8 minutes to discuss this topic together. Remember, we should share our views, respond to each other's points, and try to explore different perspectives. Feel free to agree or disagree with each other respectfully. Let's begin - would you like to share your initial thoughts on this topic?`;
    
    addMessage('system', introMessage);
    
    // Speak the introduction
    setIsSpeaking(true);
    try {
      await speakGroupmateResponse(introMessage, groupmates.supporter.gender);
    } catch (e) {
      logger.warn('Could not speak intro');
    }
    setIsSpeaking(false);
  }, [topic, groupmates]);

  const addMessage = (
    speaker: DiscussionMessage['speaker'], 
    text: string,
    speakerName?: string,
    speakerAvatar?: string,
    stance?: 'support' | 'oppose'
  ) => {
    messageIdRef.current += 1;
    setMessages(prev => [...prev, {
      id: messageIdRef.current,
      speaker,
      speakerName,
      speakerAvatar,
      stance,
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
    if (!topic || !groupmates) return;

    setIsProcessing(true);
    const conversationHistory = messages.map(m => `${m.speakerName || m.speaker}: ${m.text}`);

    try {
      // Randomly decide order of AI responses
      const supporterFirst = Math.random() > 0.5;
      const firstGroupmate = supporterFirst ? groupmates.supporter : groupmates.opposer;
      const secondGroupmate = supporterFirst ? groupmates.opposer : groupmates.supporter;

      // Generate and speak first AI response
      setIsSpeaking(true);
      const firstResponse = await generateGroupmateResponse(
        topic.text,
        userTranscript,
        firstGroupmate.stance,
        conversationHistory,
        { name: firstGroupmate.name, gender: firstGroupmate.gender, avatar: firstGroupmate.avatar }
      );
      
      addMessage(
        'groupmate1', 
        firstResponse.text,
        firstResponse.groupmateName,
        firstResponse.avatar,
        firstResponse.stance
      );
      
      await speakGroupmateResponse(firstResponse.text, firstResponse.gender);

      // Small pause between responses
      await new Promise(resolve => setTimeout(resolve, 600));

      // Generate and speak second AI response
      const secondResponse = await generateGroupmateResponse(
        topic.text,
        userTranscript + ' ' + firstResponse.text,
        secondGroupmate.stance,
        [...conversationHistory, `${firstResponse.groupmateName}: ${firstResponse.text}`],
        { name: secondGroupmate.name, gender: secondGroupmate.gender, avatar: secondGroupmate.avatar }
      );
      
      addMessage(
        'groupmate2', 
        secondResponse.text,
        secondResponse.groupmateName,
        secondResponse.avatar,
        secondResponse.stance
      );
      
      await speakGroupmateResponse(secondResponse.text, secondResponse.gender);

      setIsSpeaking(false);

      // Check if discussion should end
      if (turnCount + 1 >= MAX_TURNS / 2) {
        setDiscussionPhase('complete');
        const closingMessage = `Thank you all for such a thoughtful discussion. We've explored many interesting perspectives on this topic. You all made excellent points with strong reasoning and relevant examples. This is exactly the kind of critical thinking and respectful debate we want to see. Well done everyone!`;
        addMessage('system', closingMessage);
        await speakGroupmateResponse(closingMessage, groupmates.supporter.gender);
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
      grade,
      groupmates
    });
  };

  const getSpeakerColor = (speaker: DiscussionMessage['speaker'], stance?: 'support' | 'oppose') => {
    if (speaker === 'user') return 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700';
    if (speaker === 'system') return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
    
    // For groupmates, color by stance
    if (stance === 'support') return 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700';
    if (stance === 'oppose') return 'bg-orange-100 dark:bg-orange-900/50 border-orange-300 dark:border-orange-700';
    
    return 'bg-gray-100 dark:bg-gray-700';
  };

  const getSpeakerLabel = (message: DiscussionMessage) => {
    if (message.speaker === 'user') return '🎤 You';
    if (message.speaker === 'system') return '📢 Moderator';
    
    const stanceLabel = message.stance === 'support' ? 'Supportive' : 'Critical';
    return `${message.speakerAvatar || '👤'} ${message.speakerName || 'Groupmate'} (${stanceLabel})`;
  };

  if (isLoading || !groupmates) {
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
            
            {/* Groupmates Info - Now with random identities */}
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                <span className="text-xl">{groupmates.supporter.avatar}</span>
                <span>
                  <strong>{groupmates.supporter.name}</strong> 
                  <span className="text-green-600 dark:text-green-400"> - Supportive</span>
                  <span className="text-xs ml-1">({groupmates.supporter.gender})</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-orange-50 dark:bg-orange-900/30 px-3 py-2 rounded-lg">
                <span className="text-xl">{groupmates.opposer.avatar}</span>
                <span>
                  <strong>{groupmates.opposer.name}</strong>
                  <span className="text-orange-600 dark:text-orange-400"> - Critical Thinker</span>
                  <span className="text-xs ml-1">({groupmates.opposer.gender})</span>
                </span>
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
                    Ready to start the group discussion with {groupmates.supporter.name} and {groupmates.opposer.name}?
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
                  className={`p-4 rounded-lg border-2 ${getSpeakerColor(message.speaker, message.stance)}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                      {getSpeakerLabel(message)}
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
                  <span className="text-gray-600 dark:text-gray-400">
                    {groupmates.supporter.name} and {groupmates.opposer.name} are thinking...
                  </span>
                </div>
              )}

              {/* Speaking indicator */}
              {isSpeaking && !isProcessing && (
                <div className="flex items-center justify-center py-4">
                  <Volume2 className="w-6 h-6 text-green-600 animate-pulse mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">AI groupmate is speaking...</span>
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
