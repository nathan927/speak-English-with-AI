
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Download, Trash2, Bug, RefreshCw } from 'lucide-react';
import { logger } from '@/services/logService';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  component?: string;
  action?: string;
  details?: any;
}

const LogViewer = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const refreshLogs = () => {
    setLogs(logger.getLogs());
  };

  useEffect(() => {
    if (isOpen) {
      refreshLogs();
      // 每秒自動刷新日志
      const interval = setInterval(refreshLogs, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleExport = () => {
    logger.downloadLogs();
    logger.info('Logs exported by user');
  };

  const handleClear = () => {
    logger.clear();
    setLogs([]);
    logger.info('Logs cleared by user');
  };

  const filteredLogs = logs.filter(log => 
    filterLevel === 'all' || log.level === filterLevel
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warn': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'debug': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('zh-HK', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 shadow-lg bg-gray-800 hover:bg-gray-700 text-white"
          onClick={() => setIsOpen(true)}
        >
          <Bug className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            詳細調試日志查看器
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 pt-2">
          {/* 控制面板 */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={filterLevel === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterLevel('all')}
            >
              全部 ({logs.length})
            </Button>
            <Button
              variant={filterLevel === 'error' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterLevel('error')}
            >
              錯誤 ({logs.filter(l => l.level === 'error').length})
            </Button>
            <Button
              variant={filterLevel === 'warn' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterLevel('warn')}
            >
              警告 ({logs.filter(l => l.level === 'warn').length})
            </Button>
            <Button
              variant={filterLevel === 'info' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterLevel('info')}
            >
              信息 ({logs.filter(l => l.level === 'info').length})
            </Button>
            <Button
              variant={filterLevel === 'debug' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterLevel('debug')}
            >
              調試 ({logs.filter(l => l.level === 'debug').length})
            </Button>
            
            <div className="ml-auto flex gap-2">
              <Button size="sm" variant="outline" onClick={refreshLogs}>
                <RefreshCw className="w-4 h-4 mr-1" />
                刷新
              </Button>
              <Button size="sm" variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-1" />
                導出
              </Button>
              <Button size="sm" variant="outline" onClick={handleClear}>
                <Trash2 className="w-4 h-4 mr-1" />
                清除
              </Button>
            </div>
          </div>

          {/* 日志列表 */}
          <Card className="h-[500px]">
            <ScrollArea className="h-full">
              <CardContent className="p-4">
                {filteredLogs.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    沒有找到日志記錄
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredLogs.map((log, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 text-sm hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getLevelColor(log.level)}>
                            {log.level.toUpperCase()}
                          </Badge>
                          <span className="text-gray-500 text-xs font-mono">
                            {formatTime(log.timestamp)}
                          </span>
                          {log.component && (
                            <Badge variant="outline" className="text-xs">
                              {log.component}
                            </Badge>
                          )}
                          {log.action && (
                            <Badge variant="secondary" className="text-xs">
                              {log.action}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-gray-900 mb-2 font-medium">
                          {log.message}
                        </div>
                        
                        {(log.data || log.details) && (
                          <details className="text-xs text-gray-600">
                            <summary className="cursor-pointer hover:text-gray-800 font-medium mb-2">
                              查看詳細數據 {log.data && log.details ? '(數據 + 詳情)' : log.data ? '(數據)' : '(詳情)'}
                            </summary>
                            <div className="space-y-2">
                              {log.data && (
                                <div>
                                  <div className="font-semibold text-blue-600 mb-1">主要數據:</div>
                                  <pre className="p-3 bg-blue-50 rounded text-xs overflow-x-auto border">
                                    {typeof log.data === 'string' 
                                      ? log.data 
                                      : JSON.stringify(log.data, null, 2)
                                    }
                                  </pre>
                                </div>
                              )}
                              {log.details && (
                                <div>
                                  <div className="font-semibold text-green-600 mb-1">詳細信息:</div>
                                  <pre className="p-3 bg-green-50 rounded text-xs overflow-x-auto border">
                                    {typeof log.details === 'string' 
                                      ? log.details 
                                      : JSON.stringify(log.details, null, 2)
                                    }
                                  </pre>
                                </div>
                              )}
                            </div>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>

          <div className="text-xs text-gray-500 mt-3 text-center">
            詳細調試日志 • 自動每秒刷新 • 最多保存1000條記錄 • 包含組件、動作和詳細數據追蹤
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogViewer;
