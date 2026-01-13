import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mic, MicOff, Volume2, Users, MessageCircle, Loader2, User, Star, Clock, BookOpen, History } from 'lucide-react';
import { logger } from '@/services/logService';
import { 
  generateGroupmateResponse, 
  speakGroupmateResponse, 
  createSpeechRecognition,
  generateRandomGroupmate,
  stopSpeaking
} from '@/services/aiGroupmateService';
import { getRandomQuestionByType, Question } from '@/data/questionBank';
import { getRandomOpening, getRandomClosing } from '@/services/discussionVariationsService';
import { 
  saveDiscussion, 
  calculateDiscussionScore,
  DiscussionScore,
  getDiscussionHistory,
  SavedDiscussion
} from '@/services/discussionHistoryService';

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
  const [discussionPhase, setDiscussionPhase] = useState<'intro' | 'discussion' | 'complete' | 'results' | 'history'>('intro');
  const [turnCount, setTurnCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [discussionScore, setDiscussionScore] = useState<DiscussionScore | null>(null);
  const [discussionStartTime, setDiscussionStartTime] = useState<Date | null>(null);
  const [savedDiscussions, setSavedDiscussions] = useState<SavedDiscussion[]>([]);
  
  // Random groupmates - regenerated each session
  const [groupmates, setGroupmates] = useState<{ supporter: GroupmateIdentity; opposer: GroupmateIdentity } | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);
  const isRecordingRef = useRef(false);
  const transcriptRef = useRef('');
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

  // Grade-appropriate discussion topics
  const getGradeAppropiateTopic = (gradeLevel: string): string => {
    const primaryTopics: Record<string, string[]> = {
      'P4': [
        'Should students have homework every day? Why or why not?',
        'Is it better to play video games or outdoor games? Share your ideas.',
        'Should children be allowed to have mobile phones? Discuss.',
        'Do you think pets are good for children? Why?',
        'Should schools have more PE lessons? What do you think?'
      ],
      'P5': [
        'Some people think children should learn to cook. Do you agree? Why or why not?',
        'Should students wear school uniforms? Discuss the advantages and disadvantages.',
        'Do you think watching TV helps children learn? Share your views.',
        'Should children be allowed to stay up late on weekends? What is your opinion?',
        'Is reading books better than reading on tablets? Discuss your thoughts.'
      ],
      'P6': [
        'Some people believe that homework helps students learn better. Others think it takes away free time. What are your thoughts on this issue?',
        'With the rise of technology, some suggest that handwriting is no longer important. Do you agree or disagree? Give reasons for your answer.',
        'Should primary school students be allowed to use social media? Discuss the pros and cons.',
        'Some parents think extra-curricular activities are as important as academic studies. What is your view?',
        'Do you think online learning is as effective as face-to-face learning? Share your perspective.'
      ]
    };

    const secondaryTopics: Record<string, string[]> = {
      'S1': [
        'Social media has both positive and negative effects on teenagers. Discuss how young people can use social media responsibly while avoiding its potential harms.',
        'Some people believe that students should focus only on academic subjects, while others think arts and sports are equally important. What is your view?',
        'With the increasing use of smartphones, some worry that young people are losing important social skills. Do you agree with this concern?'
      ],
      'S2': [
        'The government is considering extending school hours to improve student performance. Discuss whether you think this would be beneficial for students and explain your reasoning.',
        'Some educators believe that competitive sports in schools teach valuable life skills, while others argue they put too much pressure on students. What are your thoughts?',
        'Fast food restaurants are popular among teenagers. Should schools do more to promote healthy eating habits? Discuss the challenges and possible solutions.'
      ],
      'S3': [
        'In recent years, there has been debate about whether students should be required to take part in community service. Consider the benefits and drawbacks, and share your opinion on whether it should be mandatory.',
        'Some argue that traditional examinations are outdated and should be replaced with alternative assessment methods. Evaluate this viewpoint and discuss what changes, if any, should be made to the current system.',
        'With the advancement of AI technology, some predict that many jobs will be replaced by machines. How should young people prepare for this changing job market?'
      ],
      'S4': [
        'The Hong Kong government has proposed various measures to tackle youth unemployment. Evaluate the effectiveness of these initiatives and suggest additional strategies that could help young people enter the workforce.',
        'There is ongoing debate about the balance between economic development and environmental protection in Hong Kong. Discuss how the city can achieve sustainable development while maintaining its competitive edge.',
        'Mental health issues among teenagers have become increasingly prevalent. Analyze the contributing factors and propose comprehensive solutions involving schools, families, and the government.'
      ],
      'S5': [
        'With rising property prices in Hong Kong, many young people are concerned about their future housing prospects. Critically examine the current housing policies and suggest reforms that could make housing more accessible to the younger generation.',
        'The COVID-19 pandemic has fundamentally changed the way we work and learn. Evaluate the long-term implications of these changes on society and discuss how individuals and institutions should adapt.',
        "Some argue that Hong Kong's education system places too much emphasis on academic achievement at the expense of creativity and critical thinking. To what extent do you agree, and what reforms would you propose?"
      ],
      'S6': [
        'As Hong Kong positions itself as a hub for innovation and technology, discuss the policy reforms and cultural shifts needed to foster an entrepreneurial ecosystem that can compete with other global cities like Singapore and Shenzhen.',
        "The concept of work-life balance is becoming increasingly important to the younger generation. Analyze how this shift in values might impact Hong Kong's economic productivity and corporate culture, and discuss whether employers should adapt their practices.",
        "With the growing influence of AI and automation, some experts predict that many traditional careers will become obsolete within the next decade. Critically evaluate how Hong Kong's education and training systems should evolve to prepare young people for this uncertain future."
      ]
    };

    const allTopics = { ...primaryTopics, ...secondaryTopics };
    const topics = allTopics[gradeLevel];
    
    if (topics && topics.length > 0) {
      return topics[Math.floor(Math.random() * topics.length)];
    }
    
    return 'Discuss the advantages and disadvantages of technology in education.';
  };

  // Load a discussion topic
  useEffect(() => {
    const loadTopic = () => {
      // Get grade-appropriate topic
      const topicText = getGradeAppropiateTopic(grade);
      
      setTopic({
        id: Date.now(),
        text: topicText,
        section: 'Group Discussion',
        grade,
        type: 'dse_group'
      });
      
      logger.info('Discussion topic loaded', { topic: topicText, grade });
      setIsLoading(false);
    };

    loadTopic();
  }, [grade]);

  // Initialize speech recognition - only once
  useEffect(() => {
    const recognition = createSpeechRecognition();
    recognitionRef.current = recognition;
    
    if (recognition) {
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        transcriptRef.current = transcript;
        setCurrentTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        // Ignore aborted errors when intentionally stopping
        if (event.error === 'aborted') return;
        logger.error('Speech recognition error', { error: event.error });
        isRecordingRef.current = false;
        setIsRecording(false);
      };

      recognition.onend = () => {
        // Use ref to check actual recording state
        if (isRecordingRef.current) {
          // Restart if still supposed to be recording
          try {
            recognition.start();
          } catch (e) {
            logger.warn('Could not restart recognition');
          }
        }
      };
    }

    return () => {
      recognition?.stop();
      stopSpeaking(); // Stop any ongoing speech when unmounting
    };
  }, []); // Empty dependency - initialize only once

  // Stop speech when component unmounts or user navigates away
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start the discussion with intro
  const startDiscussion = useCallback(async () => {
    if (!topic || !groupmates) return;

    setDiscussionPhase('discussion');
    setDiscussionStartTime(new Date());
    
    // Use varied, humanized opening
    const introMessage = getRandomOpening(
      groupmates.supporter.name,
      groupmates.opposer.name,
      topic.text,
      userName.trim() || undefined
    );
    
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

    transcriptRef.current = '';
    setCurrentTranscript('');
    isRecordingRef.current = true;
    setIsRecording(true);
    
    try {
      recognitionRef.current.start();
      logger.info('Started recording user speech');
    } catch (e) {
      logger.error('Failed to start recording', { error: e });
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!recognitionRef.current) return;

    // Stop recording first
    isRecordingRef.current = false;
    setIsRecording(false);
    
    try {
      recognitionRef.current.stop();
    } catch (e) {
      // Ignore stop errors
    }
    
    // Use ref value as it's more reliable
    const finalTranscript = transcriptRef.current.trim() || currentTranscript.trim();
    
    if (!finalTranscript) {
      logger.warn('No speech detected');
      return;
    }

    // Add user's message
    addMessage('user', finalTranscript);
    logger.info('User finished speaking', { transcript: finalTranscript });

    // Process AI responses
    await processAIResponses(finalTranscript);
    
    transcriptRef.current = '';
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
        { name: firstGroupmate.name, gender: firstGroupmate.gender, avatar: firstGroupmate.avatar },
        userName.trim() || undefined
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
        { name: secondGroupmate.name, gender: secondGroupmate.gender, avatar: secondGroupmate.avatar },
        userName.trim() || undefined
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
        // Use varied closing message
        const closingMessage = getRandomClosing(userName.trim() || undefined);
        addMessage('system', closingMessage);
        await speakGroupmateResponse(closingMessage, groupmates.supporter.gender);
        
        // Calculate score and save discussion
        const endTime = new Date();
        const durationSeconds = discussionStartTime 
          ? Math.round((endTime.getTime() - discussionStartTime.getTime()) / 1000)
          : 0;
        
        const score = calculateDiscussionScore(
          messages.map(m => ({ speaker: m.speaker, text: m.text })),
          durationSeconds,
          turnCount + 1
        );
        setDiscussionScore(score);
        
        // Save the discussion
        saveDiscussion({
          date: new Date().toISOString(),
          grade,
          topic: topic.text,
          userName: userName.trim() || undefined,
          groupmates: {
            supporter: { name: groupmates.supporter.name, gender: groupmates.supporter.gender },
            opposer: { name: groupmates.opposer.name, gender: groupmates.opposer.gender }
          },
          messages: messages.map(m => ({
            speaker: m.speaker,
            speakerName: m.speakerName,
            text: m.text,
            timestamp: m.timestamp.toISOString()
          })),
          score,
          durationSeconds
        });
        
        setDiscussionPhase('results');
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
            onClick={() => {
              stopSpeaking(); // Stop speech when clicking back
              onBack();
            }}
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
                  
                  {/* Name Input Field */}
                  <div className="max-w-xs mx-auto mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <label htmlFor="userName" className="text-sm text-gray-600 dark:text-gray-400">
                        Your English name (optional)
                      </label>
                    </div>
                    <Input
                      id="userName"
                      type="text"
                      placeholder="e.g., Michael, Emily..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="text-center bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      AI groupmates will use your name naturally in conversation
                    </p>
                  </div>
                  
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

        {/* Results Screen with Scoring */}
        {discussionPhase === 'results' && discussionScore && (
          <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Your Discussion Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {discussionScore.overall}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-1">out of 100</p>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {discussionScore.speakingTime}s
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Speaking Time</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {discussionScore.turnCount}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Turns</p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <Star className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {discussionScore.contentQuality}%
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Content Quality</p>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                  <BookOpen className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {discussionScore.vocabularyRichness}%
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Vocabulary</p>
                </div>
              </div>

              {/* Feedback */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300">Feedback:</h4>
                {discussionScore.feedback.map((fb, idx) => (
                  <p key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                    <span className="text-green-500">✓</span> {fb}
                  </p>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button
                  onClick={() => setDiscussionPhase('history')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <History className="w-4 h-4" />
                  View History
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  Complete Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Discussion History View */}
        {discussionPhase === 'history' && (
          <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Past Discussions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const history = getDiscussionHistory();
                if (history.length === 0) {
                  return (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No past discussions yet. Complete a discussion to see it here!
                    </p>
                  );
                }
                return (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {history.map((disc) => (
                      <div
                        key={disc.id}
                        className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge variant="outline" className="mb-1">{disc.grade}</Badge>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                              {disc.topic}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{disc.score.overall}</div>
                            <p className="text-xs text-gray-500">Score</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{new Date(disc.date).toLocaleDateString()}</span>
                          <span>{disc.messages.length} messages</span>
                          <span>{Math.floor(disc.durationSeconds / 60)}m {disc.durationSeconds % 60}s</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
              
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setDiscussionPhase('results')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Results
                </Button>
              </div>
            </CardContent>
          </Card>
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
