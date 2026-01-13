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
  generateRandomMediator,
  stopSpeaking,
  generateDiscussionOpening,
  analyzeArgumentStrength,
  generateMediatorResponse,
  ArgumentFeedback
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
  stance: 'support' | 'oppose' | 'mediator';
}

interface DiscussionMessage {
  id: number;
  speaker: 'user' | 'groupmate1' | 'groupmate2' | 'groupmate3' | 'system';
  speakerName?: string;
  speakerAvatar?: string;
  stance?: 'support' | 'oppose' | 'mediator';
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
  const [argumentFeedback, setArgumentFeedback] = useState<ArgumentFeedback | null>(null);
  
  // Random groupmates - regenerated each session (including mediator)
  const [groupmates, setGroupmates] = useState<{ 
    supporter: GroupmateIdentity; 
    opposer: GroupmateIdentity;
    mediator: GroupmateIdentity;
  } | null>(null);
  
  // Dynamic max turns (base 3 + random 1-3)
  const [maxTurns, setMaxTurns] = useState(3);
  
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);
  const isRecordingRef = useRef(false);
  const transcriptRef = useRef('');
  const MAX_TURNS = 6; // 6 turns total (user speaks 3 times, AI responds each time)

  // Generate random groupmates on mount (including mediator)
  useEffect(() => {
    const supporter = generateRandomGroupmate();
    let opposer = generateRandomGroupmate();
    let mediator = generateRandomMediator();
    
    // Make sure they all have different names
    while (opposer.name === supporter.name) {
      opposer = generateRandomGroupmate();
    }
    while (mediator.name === supporter.name || mediator.name === opposer.name) {
      mediator = generateRandomMediator();
    }
    
    // Randomize max turns: base 3 + random 1-3 = 4-6 turns
    const randomExtraTurns = Math.floor(Math.random() * 3) + 1;
    setMaxTurns(3 + randomExtraTurns);
    
    setGroupmates({
      supporter: { ...supporter, stance: 'support' },
      opposer: { ...opposer, stance: 'oppose' },
      mediator: { ...mediator, stance: 'mediator' }
    });
    
    logger.info('Generated random groupmates', {
      supporter: supporter.name,
      opposer: opposer.name,
      mediator: mediator.name,
      maxTurns: 3 + randomExtraTurns
    });
  }, []);

  // Grade-appropriate discussion topics - realistic Hong Kong primary school level
  const getGradeAppropiateTopic = (gradeLevel: string): string => {
    const primaryTopics: Record<string, string[]> = {
      'P4': [
        'What is your favourite food? Why do you like it?',
        'Do you like going to the park? What do you do there?',
        'What pet would you like to have? Why?',
        'Do you like rainy days or sunny days? Why?',
        'What do you like to do after school?'
      ],
      'P5': [
        'What is your favourite subject at school? Why?',
        'Do you like playing with friends or playing alone? Why?',
        'Should children help with housework? Why or why not?',
        'What makes a good friend?',
        'Do you like reading books or watching TV? Why?'
      ],
      'P6': [
        'Should students have less homework? Why or why not?',
        'Is it good to have a mobile phone? Why?',
        'What do you want to be when you grow up? Why?',
        'Should children eat more vegetables? Why?',
        'Do you think playing sports is important? Why?'
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

  // Start the discussion with intro - use AI to generate natural opening
  const startDiscussion = useCallback(async () => {
    if (!topic || !groupmates) return;

    setDiscussionPhase('discussion');
    setDiscussionStartTime(new Date());
    setIsProcessing(true);
    
    try {
      // Generate AI-powered natural opening
      const openingResponse = await generateDiscussionOpening(
        topic.text,
        groupmates.supporter.name,
        groupmates.opposer.name,
        userName.trim() || undefined,
        grade
      );
      
      // Add as first groupmate speaking (not "Moderator")
      addMessage(
        'groupmate1',
        openingResponse,
        groupmates.supporter.name,
        groupmates.supporter.avatar,
        'support'
      );
      
      // Speak the introduction
      setIsSpeaking(true);
      await speakGroupmateResponse(openingResponse, groupmates.supporter.gender);
    } catch (e) {
      logger.warn('Could not generate AI opening, using fallback');
      // Fallback to static opening
      const fallbackOpening = getRandomOpening(
        groupmates.supporter.name,
        groupmates.opposer.name,
        topic.text,
        userName.trim() || undefined
      );
      addMessage(
        'groupmate1',
        fallbackOpening,
        groupmates.supporter.name,
        groupmates.supporter.avatar,
        'support'
      );
      setIsSpeaking(true);
      try {
        await speakGroupmateResponse(fallbackOpening, groupmates.supporter.gender);
      } catch {}
    }
    setIsSpeaking(false);
    setIsProcessing(false);
  }, [topic, groupmates, userName, grade]);

  const addMessage = (
    speaker: DiscussionMessage['speaker'], 
    text: string,
    speakerName?: string,
    speakerAvatar?: string,
    stance?: 'support' | 'oppose' | 'mediator'
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
      // Analyze user's argument and provide feedback
      const feedback = await analyzeArgumentStrength(userTranscript, topic.text);
      setArgumentFeedback(feedback);
      
      // Randomly decide order of AI responses
      const supporterFirst = Math.random() > 0.5;
      const firstGroupmate = supporterFirst ? groupmates.supporter : groupmates.opposer;
      const secondGroupmate = supporterFirst ? groupmates.opposer : groupmates.supporter;

      // Randomly decide if groupmates should ask questions (30% chance)
      const shouldAskQuestion = Math.random() < 0.3;
      const questionTarget = Math.random() > 0.5 ? 'user' : 'other';

      // Generate and speak first AI response
      setIsSpeaking(true);
      const firstResponse = await generateGroupmateResponse(
        topic.text,
        userTranscript,
        firstGroupmate.stance as 'support' | 'oppose',
        conversationHistory,
        { name: firstGroupmate.name, gender: firstGroupmate.gender, avatar: firstGroupmate.avatar },
        userName.trim() || undefined,
        shouldAskQuestion && questionTarget === 'user'
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
        secondGroupmate.stance as 'support' | 'oppose',
        [...conversationHistory, `${firstResponse.groupmateName}: ${firstResponse.text}`],
        { name: secondGroupmate.name, gender: secondGroupmate.gender, avatar: secondGroupmate.avatar },
        userName.trim() || undefined,
        shouldAskQuestion && questionTarget === 'other'
      );
      
      addMessage(
        'groupmate2', 
        secondResponse.text,
        secondResponse.groupmateName,
        secondResponse.avatar,
        secondResponse.stance
      );
      
      await speakGroupmateResponse(secondResponse.text, secondResponse.gender);

      // Occasionally (40% chance) add mediator response
      if (Math.random() < 0.4) {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const mediatorResponse = await generateMediatorResponse(
          topic.text,
          [...conversationHistory, 
           `${firstResponse.groupmateName}: ${firstResponse.text}`,
           `${secondResponse.groupmateName}: ${secondResponse.text}`],
          { name: groupmates.mediator.name, gender: groupmates.mediator.gender, avatar: groupmates.mediator.avatar },
          userName.trim() || undefined,
          true
        );
        
        addMessage(
          'groupmate3',
          mediatorResponse.text,
          mediatorResponse.groupmateName,
          mediatorResponse.avatar,
          'mediator'
        );
        
        await speakGroupmateResponse(mediatorResponse.text, mediatorResponse.gender);
      }

      setIsSpeaking(false);

      // Check if discussion should end (using dynamic maxTurns)
      if (turnCount + 1 >= maxTurns) {
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

  const getSpeakerColor = (speaker: DiscussionMessage['speaker'], stance?: 'support' | 'oppose' | 'mediator') => {
    if (speaker === 'user') return 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700';
    if (speaker === 'system') return 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
    
    // For groupmates, color by stance
    if (stance === 'support') return 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700';
    if (stance === 'oppose') return 'bg-orange-100 dark:bg-orange-900/50 border-orange-300 dark:border-orange-700';
    if (stance === 'mediator') return 'bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-700';
    
    return 'bg-gray-100 dark:bg-gray-700';
  };

  const getSpeakerLabel = (message: DiscussionMessage) => {
    if (message.speaker === 'user') return '🎤 You';
    if (message.speaker === 'system') return '📢 Moderator';
    
    const stanceLabel = message.stance === 'support' ? 'Supportive' : message.stance === 'mediator' ? 'Mediator' : 'Critical';
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
              Turn {Math.min(turnCount + 1, maxTurns)} / {maxTurns}
            </span>
          </div>
          <Progress value={(turnCount / maxTurns) * 100} className="h-2" />
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
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-orange-50 dark:bg-orange-900/30 px-3 py-2 rounded-lg">
                <span className="text-xl">{groupmates.opposer.avatar}</span>
                <span>
                  <strong>{groupmates.opposer.name}</strong>
                  <span className="text-orange-600 dark:text-orange-400"> - Critical Thinker</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-2 rounded-lg">
                <span className="text-xl">{groupmates.mediator.avatar}</span>
                <span>
                  <strong>{groupmates.mediator.name}</strong>
                  <span className="text-purple-600 dark:text-purple-400"> - Mediator</span>
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
            <div className="space-y-4">
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

              {/* Real-time Argument Feedback */}
              {argumentFeedback && !isRecording && !isProcessing && !isSpeaking && discussionPhase === 'discussion' && (
                <div className={`p-4 rounded-lg border-2 ${
                  argumentFeedback.strength === 'strong' 
                    ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700' 
                    : argumentFeedback.strength === 'moderate'
                    ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'
                    : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      📊 Argument Feedback
                    </span>
                    <Badge className={`${
                      argumentFeedback.strength === 'strong' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : argumentFeedback.strength === 'moderate'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {argumentFeedback.strength.toUpperCase()} ({argumentFeedback.score}/10)
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-medium text-green-700 dark:text-green-400 mb-1">✓ Good points:</p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                        {argumentFeedback.positives.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-orange-700 dark:text-orange-400 mb-1">💡 To improve:</p>
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                        {argumentFeedback.improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing indicator */}
              {isProcessing && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {groupmates.supporter.name}, {groupmates.opposer.name}, and {groupmates.mediator.name} are thinking...
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
                  <div className="space-y-3">
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
