
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  component?: string;
  action?: string;
  details?: any;
}

class LogService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // 限制最大日志數量

  log(level: LogEntry['level'], message: string, data?: any, component?: string, action?: string, details?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      component,
      action,
      details
    };

    this.logs.unshift(entry);
    
    // 保持日志數量限制
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // 同時輸出到瀏覽器控制台，包含更多信息
    const logData = {
      message,
      component,
      action,
      data,
      details
    };
    console[level](`[${component || 'App'}] ${message}`, logData);
  }

  info(message: string, data?: any, component?: string, action?: string, details?: any) {
    this.log('info', message, data, component, action, details);
  }

  warn(message: string, data?: any, component?: string, action?: string, details?: any) {
    this.log('warn', message, data, component, action, details);
  }

  error(message: string, data?: any, component?: string, action?: string, details?: any) {
    this.log('error', message, data, component, action, details);
  }

  debug(message: string, data?: any, component?: string, action?: string, details?: any) {
    this.log('debug', message, data, component, action, details);
  }

  // 專門為語音功能添加的日志方法
  speechLog(action: string, details: any, component: string = 'SpeechSynthesis') {
    this.debug(`Speech ${action}`, details, component, action, {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      speechSynthesis: {
        speaking: speechSynthesis?.speaking,
        pending: speechSynthesis?.pending,
        paused: speechSynthesis?.paused
      },
      ...details
    });
  }

  // 專門為對話服務添加的日志方法
  conversationLog(phraseType: string, selectedPhrase: string, availablePhrases: string[], lastUsed?: string) {
    this.debug(`Conversation phrase selected`, {
      phraseType,
      selectedPhrase,
      availableCount: availablePhrases.length,
      totalPhrases: availablePhrases.length + (lastUsed ? 1 : 0),
      lastUsed,
      allAvailable: availablePhrases,
      wasFiltered: !!lastUsed
    }, 'ConversationService', 'phraseSelection', {
      selection: {
        type: phraseType,
        phrase: selectedPhrase,
        filtered: !!lastUsed,
        previousPhrase: lastUsed
      }
    });
  }

  // 追蹤問題序列的方法
  questionLog(questionIndex: number, questionData: any, action: string) {
    this.info(`Question ${action}`, {
      index: questionIndex,
      question: questionData,
      timestamp: Date.now()
    }, 'VoiceTest', `question_${action}`, {
      questionFlow: {
        currentIndex: questionIndex,
        action,
        questionId: questionData?.id,
        section: questionData?.section,
        text: questionData?.text?.substring(0, 50) // 只記錄前50個字符
      }
    });
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  exportLogs(): string {
    const exportData = {
      exported_at: new Date().toISOString(),
      app_version: '1.0.0',
      user_agent: navigator.userAgent,
      url: window.location.href,
      speech_synthesis_info: {
        available: 'speechSynthesis' in window,
        voices_count: speechSynthesis?.getVoices()?.length || 0,
        speaking: speechSynthesis?.speaking || false,
        pending: speechSynthesis?.pending || false,
        paused: speechSynthesis?.paused || false
      },
      logs: this.logs
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  downloadLogs() {
    const logData = this.exportLogs();
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `speakcheck-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    this.info('Debug logs downloaded', {
      filename: link.download,
      logCount: this.logs.length,
      exportSize: logData.length
    }, 'LogService', 'export');
  }

  clear() {
    const logCount = this.logs.length;
    this.logs = [];
    console.clear();
    this.info('Logs cleared', { previousCount: logCount }, 'LogService', 'clear');
  }
}

export const logger = new LogService();
