
interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
}

class LogService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // 限制最大日志數量

  log(level: LogEntry['level'], message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };

    this.logs.unshift(entry);
    
    // 保持日志數量限制
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // 同時輸出到瀏覽器控制台
    console[level](message, data || '');
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
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
  }

  clear() {
    this.logs = [];
    console.clear();
  }
}

export const logger = new LogService();
