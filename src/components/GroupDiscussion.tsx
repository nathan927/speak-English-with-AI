import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Mic, MicOff, Volume2, Users, MessageCircle, Loader2, User, Star, Clock, BookOpen, History, Edit2, Check, X, Play, Square, RotateCcw } from 'lucide-react';
import { logger } from '@/services/logService';
import { getRandomTopic } from '@/data/discussionTopics';
import { 
  generateGroupmateResponse, 
  speakGroupmateResponse, 
  createSpeechRecognition,
  generateRandomGroupmate,
  generateRandomMediator,
  stopSpeaking,
  generateDiscussionOpening,
  generateMediatorResponse
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
  audioUrl?: string; // URL for user's recorded audio playback
}

const GroupDiscussion: React.FC<GroupDiscussionProps> = ({ grade, onComplete, onBack }) => {
  const [topic, setTopic] = useState<Question | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [discussionPhase, setDiscussionPhase] = useState<'intro' | 'discussion' | 'complete' | 'results' | 'history'>('intro');
  const [turnCount, setTurnCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [discussionScore, setDiscussionScore] = useState<DiscussionScore | null>(null);
  const [discussionStartTime, setDiscussionStartTime] = useState<Date | null>(null);
  const [savedDiscussions, setSavedDiscussions] = useState<SavedDiscussion[]>([]);
  
  // State for editing voice input before submission
  const [pendingTranscript, setPendingTranscript] = useState<string>('');
  const [isEditingTranscript, setIsEditingTranscript] = useState(false);
  const [pendingAudioUrl, setPendingAudioUrl] = useState<string | null>(null);
  
  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  
  // MediaRecorder for capturing actual audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  
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

  // Grade-appropriate discussion topics - using comprehensive topic bank
  const getGradeAppropiateTopic = (gradeLevel: string): string => {
    const topic = getRandomTopic(gradeLevel);
    if (topic) {
      return topic.text;
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
      // Generate AI-powered natural opening that introduces all 3 groupmates
      const openingResponse = await generateDiscussionOpening(
        topic.text,
        groupmates.supporter.name,
        groupmates.opposer.name,
        userName.trim() || undefined,
        grade,
        groupmates.mediator.name // Pass third groupmate name
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
      // Fallback to static opening with all 3 members
      const fallbackOpening = `Hey everyone! I'm ${groupmates.supporter.name}, and I'm joined by ${groupmates.opposer.name} and ${groupmates.mediator.name} today. ${userName.trim() ? `Great to have you here, ${userName.trim()}!` : ''} We're here to discuss: ${topic.text.substring(0, 100)}... What does everyone think?`;
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
    stance?: 'support' | 'oppose' | 'mediator',
    audioUrl?: string
  ) => {
    messageIdRef.current += 1;
    setMessages(prev => [...prev, {
      id: messageIdRef.current,
      speaker,
      speakerName,
      speakerAvatar,
      stance,
      text,
      timestamp: new Date(),
      audioUrl
    }]);
  };

  const startRecording = async () => {
    if (!recognitionRef.current) {
      logger.error('Speech recognition not available');
      return;
    }

    transcriptRef.current = '';
    setCurrentTranscript('');
    isRecordingRef.current = true;
    setIsRecording(true);
    audioChunksRef.current = [];
    
    // Start speech recognition
    try {
      recognitionRef.current.start();
      logger.info('Started recording user speech');
    } catch (e) {
      logger.error('Failed to start speech recognition', { error: e });
      isRecordingRef.current = false;
      setIsRecording(false);
      return;
    }
    
    // Start audio recording with MediaRecorder
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Create blob URL for playback
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setPendingAudioUrl(audioUrl);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        logger.info('Audio recording saved', { blobSize: audioBlob.size });
      };
      
      mediaRecorder.start();
      logger.info('MediaRecorder started');
    } catch (e) {
      logger.warn('Could not start audio recording (MediaRecorder)', { error: e });
      // Continue without audio recording - speech recognition still works
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
    
    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Use ref value as it's more reliable
    const finalTranscript = transcriptRef.current.trim() || currentTranscript.trim();
    
    // Always show editable textbox - even if no speech detected
    // This allows users to type in quiet environments
    setPendingTranscript(finalTranscript);
    setIsEditingTranscript(true);
    
    if (!finalTranscript) {
      logger.info('No speech detected - showing text input for manual entry');
    }
    
    transcriptRef.current = '';
    setCurrentTranscript('');
  };

  // Submit the (possibly edited) transcript with audio
  const submitTranscript = async () => {
    if (!pendingTranscript.trim()) return;
    
    const finalText = pendingTranscript.trim();
    const audioUrl = pendingAudioUrl;
    
    setIsEditingTranscript(false);
    setPendingTranscript('');
    setPendingAudioUrl(null);
    
    // Add user's message with audio URL
    addMessage('user', finalText, undefined, undefined, undefined, audioUrl || undefined);
    logger.info('User submitted speech', { transcript: finalText, hasAudio: !!audioUrl });

    // Process AI responses
    await processAIResponses(finalText);
    
    setTurnCount(prev => prev + 1);
  };

  // Cancel the pending transcript
  const cancelTranscript = () => {
    setIsEditingTranscript(false);
    setPendingTranscript('');
    // Revoke the audio URL to free memory
    if (pendingAudioUrl) {
      URL.revokeObjectURL(pendingAudioUrl);
      setPendingAudioUrl(null);
    }
  };

  // Play user's recorded audio
  const playUserAudio = (messageId: number, audioUrl: string) => {
    // Stop any currently playing audio
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    
    if (playingAudioId === messageId) {
      // Toggle off
      setPlayingAudioId(null);
      return;
    }
    
    const audio = new Audio(audioUrl);
    audioPlayerRef.current = audio;
    setPlayingAudioId(messageId);
    
    audio.onended = () => {
      setPlayingAudioId(null);
      audioPlayerRef.current = null;
    };
    
    audio.onerror = () => {
      setPlayingAudioId(null);
      audioPlayerRef.current = null;
      logger.error('Failed to play audio');
    };
    
    audio.play();
  };

  // Replay AI speech for a message
  const replayAiSpeech = async (text: string, messageId: number) => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    setPlayingAudioId(messageId);
    
    try {
      // Find the gender based on the message
      const message = messages.find(m => m.id === messageId);
      let gender: 'male' | 'female' = 'female';
      
      if (message && groupmates) {
        if (message.speakerName === groupmates.supporter.name) gender = groupmates.supporter.gender;
        else if (message.speakerName === groupmates.opposer.name) gender = groupmates.opposer.gender;
        else if (message.speakerName === groupmates.mediator.name) gender = groupmates.mediator.gender;
      }
      
      await speakGroupmateResponse(text, gender);
    } finally {
      setIsSpeaking(false);
      setPlayingAudioId(null);
    }
  };

  const processAIResponses = async (userTranscript: string) => {
    if (!topic || !groupmates) return;

    setIsProcessing(true);
    setIsAiThinking(true);
    const conversationHistory = messages.map(m => `${m.speakerName || m.speaker}: ${m.text}`);

    // Track last speaker to prevent consecutive same speaker
    let lastSpeaker: string | null = null;

    try {
      // Randomly decide order of AI responses, ensuring no same speaker twice in a row
      const supporterFirst = Math.random() > 0.5;
      const firstGroupmate = supporterFirst ? groupmates.supporter : groupmates.opposer;
      const secondGroupmate = supporterFirst ? groupmates.opposer : groupmates.supporter;

      // INCREASED: AI-to-AI interaction probability from 30% to 50%
      const shouldAskQuestion = Math.random() < 0.5;
      const questionTarget = Math.random() > 0.5 ? 'user' : 'other';

      // Generate first AI response
      const firstResponse = await generateGroupmateResponse(
        topic.text,
        userTranscript,
        firstGroupmate.stance as 'support' | 'oppose',
        conversationHistory,
        { name: firstGroupmate.name, gender: firstGroupmate.gender, avatar: firstGroupmate.avatar },
        userName.trim() || undefined,
        shouldAskQuestion && questionTarget === 'user',
        grade
      );
      
      setIsAiThinking(false);
      setIsSpeaking(true);
      
      addMessage(
        'groupmate1', 
        firstResponse.text,
        firstResponse.groupmateName,
        firstResponse.avatar,
        firstResponse.stance
      );
      lastSpeaker = firstResponse.groupmateName;
      
      await speakGroupmateResponse(firstResponse.text, firstResponse.gender);

      // Small pause between responses
      await new Promise(resolve => setTimeout(resolve, 600));

      // Generate second AI response
      setIsAiThinking(true);
      const secondResponse = await generateGroupmateResponse(
        topic.text,
        userTranscript + ' ' + firstResponse.text,
        secondGroupmate.stance as 'support' | 'oppose',
        [...conversationHistory, `${firstResponse.groupmateName}: ${firstResponse.text}`],
        { name: secondGroupmate.name, gender: secondGroupmate.gender, avatar: secondGroupmate.avatar },
        userName.trim() || undefined,
        shouldAskQuestion && questionTarget === 'other',
        grade
      );
      setIsAiThinking(false);
      
      addMessage(
        'groupmate2', 
        secondResponse.text,
        secondResponse.groupmateName,
        secondResponse.avatar,
        secondResponse.stance
      );
      lastSpeaker = secondResponse.groupmateName;
      
      await speakGroupmateResponse(secondResponse.text, secondResponse.gender);

      // INCREASED: Balanced groupmate (formerly mediator) participation from 40% to 50%
      // Also ensure no consecutive same speaker
      if (Math.random() < 0.5 && lastSpeaker !== groupmates.mediator.name) {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const mediatorResponse = await generateMediatorResponse(
          topic.text,
          [...conversationHistory, 
           `${firstResponse.groupmateName}: ${firstResponse.text}`,
           `${secondResponse.groupmateName}: ${secondResponse.text}`],
          { name: groupmates.mediator.name, gender: groupmates.mediator.gender, avatar: groupmates.mediator.avatar },
          userName.trim() || undefined,
          true,
          grade // Pass grade for language level adjustment
        );
        
        addMessage(
          'groupmate3',
          mediatorResponse.text,
          mediatorResponse.groupmateName,
          mediatorResponse.avatar,
          'mediator'
        );
        lastSpeaker = mediatorResponse.groupmateName;
        
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
    
    // Updated label for balanced creative thinker (formerly mediator)
    const stanceLabel = message.stance === 'support' ? 'Supportive' : message.stance === 'mediator' ? 'Creative' : 'Critical';
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
    <div className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-3 flex flex-col overflow-hidden">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              stopSpeaking(); // Stop speech when clicking back
              onBack();
            }}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Badge className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-3 py-1">
            <Users className="w-4 h-4 mr-2" />
            Group Discussion - {grade}
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">AI Group Discussion</h1>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Turn {Math.min(turnCount + 1, maxTurns)} / {maxTurns}
            </span>
          </div>
          <Progress value={(turnCount / maxTurns) * 100} className="h-1.5" />
        </div>

        {/* Topic Card - Compact */}
        <Card className="mb-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shrink-0">
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base text-gray-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-purple-600" />
              Discussion Topic
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-4">
            <p className="text-base font-medium text-gray-800 dark:text-gray-200">{topic?.text}</p>
            
            {/* Groupmates Info - Compact */}
            <div className="mt-3 flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">
                <span>{groupmates.supporter.avatar}</span>
                <span>
                  <strong>{groupmates.supporter.name}</strong> 
                  <span className="text-green-600 dark:text-green-400"> - Supportive</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-md">
                <span>{groupmates.opposer.avatar}</span>
                <span>
                  <strong>{groupmates.opposer.name}</strong>
                  <span className="text-orange-600 dark:text-orange-400"> - Critical Thinker</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-md">
                <span>{groupmates.mediator.avatar}</span>
                <span>
                  <strong>{groupmates.mediator.name}</strong>
                  <span className="text-purple-600 dark:text-purple-400"> - Creative Thinker</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Discussion Messages - Flexible Height */}
        <Card className="mb-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 flex-1 flex flex-col min-h-0">
          <CardHeader className="py-2 px-4 shrink-0">
            <CardTitle className="text-base text-gray-900 dark:text-white">Discussion</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto py-2 px-4">
            <div className="space-y-3">
              {messages.length === 0 && discussionPhase === 'intro' && (
                <div className="text-center py-4">
                  <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">
                    Ready to start the group discussion with {groupmates.supporter.name} and {groupmates.opposer.name}?
                  </p>
                  
                  {/* Name Input Field - Compact */}
                  <div className="max-w-xs mx-auto mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <label htmlFor="userName" className="text-xs text-gray-600 dark:text-gray-400">
                        Your English name (optional)
                      </label>
                    </div>
                    <Input
                      id="userName"
                      type="text"
                      placeholder="e.g., Michael, Emily..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="text-center text-sm h-9 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      AI groupmates will use your name naturally in conversation
                    </p>
                  </div>
                  
                  <Button 
                    onClick={startDiscussion}
                    size="sm"
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
                  className={`p-3 rounded-lg border-2 ${getSpeakerColor(message.speaker, message.stance)}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-gray-700 dark:text-gray-300">
                        {getSpeakerLabel(message)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {/* Playback controls */}
                    <div className="flex items-center gap-1">
                      {/* User's recorded audio playback */}
                      {message.speaker === 'user' && message.audioUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => playUserAudio(message.id, message.audioUrl!)}
                          className="h-6 px-2 text-xs"
                          title="Play your recording"
                        >
                          {playingAudioId === message.id ? (
                            <><Square className="w-3 h-3 mr-1" /> Stop</>
                          ) : (
                            <><Play className="w-3 h-3 mr-1" /> Play</>
                          )}
                        </Button>
                      )}
                      
                      {/* AI speech replay */}
                      {message.speaker !== 'user' && message.speaker !== 'system' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => replayAiSpeech(message.text, message.id)}
                          disabled={isSpeaking && playingAudioId !== message.id}
                          className="h-6 px-2 text-xs"
                          title="Replay AI speech"
                        >
                          {playingAudioId === message.id && isSpeaking ? (
                            <><Volume2 className="w-3 h-3 mr-1 animate-pulse" /> Playing...</>
                          ) : (
                            <><RotateCcw className="w-3 h-3 mr-1" /> Replay</>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{message.text}</p>
                </div>
              ))}

              {/* Current transcript preview */}
              {isRecording && currentTranscript && (
                <div className="p-3 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-xs text-blue-700 dark:text-blue-300">
                      🎤 You (recording...)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">{currentTranscript}</p>
                </div>
              )}


              {/* AI Thinking indicator */}
              {isAiThinking && (
                <div className="flex items-center justify-center py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    AI is thinking...
                  </span>
                </div>
              )}

              {/* Speaking indicator */}
              {isSpeaking && !isAiThinking && (
                <div className="flex items-center justify-center py-2">
                  <Volume2 className="w-5 h-5 text-green-600 animate-pulse mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI groupmate is speaking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Controls - Fixed at bottom */}
        {discussionPhase === 'discussion' && (
          <div className="shrink-0 pb-2 space-y-3">
            {/* Edit transcript panel - show when editing, even if no transcript yet */}
            {isEditingTranscript && (
              <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Edit2 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Review & edit your response before submitting:
                      </span>
                    </div>
                    
                    {/* Play recording button */}
                    {pendingAudioUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (audioPlayerRef.current) {
                            audioPlayerRef.current.pause();
                            audioPlayerRef.current = null;
                            setPlayingAudioId(null);
                          } else {
                            const audio = new Audio(pendingAudioUrl);
                            audioPlayerRef.current = audio;
                            setPlayingAudioId(-1); // -1 for pending audio
                            audio.onended = () => {
                              setPlayingAudioId(null);
                              audioPlayerRef.current = null;
                            };
                            audio.play();
                          }
                        }}
                        className="h-7 text-xs"
                      >
                        {playingAudioId === -1 ? (
                          <><Square className="w-3 h-3 mr-1" /> Stop</>
                        ) : (
                          <><Play className="w-3 h-3 mr-1" /> Listen</>
                        )}
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={pendingTranscript}
                    onChange={(e) => setPendingTranscript(e.target.value)}
                    className="min-h-[80px] bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-600 mb-3"
                    placeholder="Edit your speech here..."
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelTranscript}
                      className="flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={submitTranscript}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Check className="w-4 h-4" />
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recording controls */}
            {!isEditingTranscript && (
              <div className="flex justify-center gap-4">
                {!isRecording ? (
                  <Button
                    size="default"
                    onClick={startRecording}
                    disabled={isProcessing || isSpeaking}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                  >
                    <Mic className="w-5 h-5" />
                    Start Speaking
                  </Button>
                ) : (
                  <Button
                    size="default"
                    onClick={stopRecording}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 animate-pulse"
                  >
                    <MicOff className="w-5 h-5" />
                    Stop Recording
                  </Button>
                )}
              </div>
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
