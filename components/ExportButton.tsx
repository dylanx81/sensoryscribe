'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateExportContent, downloadFile, generateFilename, ExportData, ExportFormat } from '@/lib/exportUtils';
import { Download, FileText, FileCode } from 'lucide-react';

interface ExportButtonProps {
  data: {
    text: string;
    genre: string;
    sense: string;
    radarScores: {
      sight: number;
      sound: number;
      touch: number;
      taste: number;
      smell: number;
    };
    feedback: string;
  };
}

export default function ExportButton({ data }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    
    try {
      const exportData: ExportData = {
        text: data.text,
        genre: data.genre,
        sense: data.sense,
        radarScores: data.radarScores,
        feedback: data.feedback,
        timestamp: new Date().toLocaleString()
      };

      const content = generateExportContent(exportData, format);
      const filename = generateFilename(format, data.genre);
      
      downloadFile(content, filename);
      
      // Brief delay to show feedback
      setTimeout(() => {
        setIsExporting(false);
        setShowOptions(false);
      }, 1000);
    } catch (error) {
      console.error('Export error:', error);
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      {!showOptions ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowOptions(true)}
          disabled={isExporting}
          className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Analysis
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('txt')}
            disabled={isExporting}
            className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'TXT'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('md')}
            disabled={isExporting}
            className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 flex items-center gap-2"
          >
            <FileCode className="w-4 h-4" />
            {isExporting ? 'Exporting...' : 'MD'}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOptions(false)}
            className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
          >
            ✕
          </Button>
        </div>
      )}
    </div>
  );
}