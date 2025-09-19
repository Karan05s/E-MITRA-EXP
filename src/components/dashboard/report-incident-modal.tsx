'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  FilePenLine,
  Loader,
  AlertTriangle,
  Clipboard,
  ClipboardCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getIncidentReport } from '@/app/actions';
import type { Position } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  position: Position | null;
}

export function ReportIncidentModal({
  isOpen,
  onOpenChange,
  position,
}: ReportIncidentModalProps) {
  const [description, setDescription] = useState('');
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    if (!description.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please describe the incident.',
      });
      return;
    }
    setIsLoading(true);
    setReport('');

    const location = position
      ? `Latitude: ${position.latitude.toFixed(5)}, Longitude: ${position.longitude.toFixed(5)}`
      : 'Location not available';

    const result = await getIncidentReport({
      incidentDescription: description,
      location: location,
    });

    if (result.success && result.data) {
      setReport(result.data.report);
    } else {
      toast({
        variant: 'destructive',
        title: 'Report Generation Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    toast({
      title: 'Report Copied!',
      description: 'You can now paste the report into another application.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePenLine className="text-primary" />
            Report an Incident
          </DialogTitle>
          <DialogDescription>
            Describe what happened, and the AI will generate a structured
            report for you to share.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="incident-description" className="text-sm font-medium">
              Describe the incident
            </label>
            <Textarea
              id="incident-description"
              placeholder="e.g., I was followed by a person in a red shirt near the market..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
              disabled={isLoading}
            />
             {!position && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                <AlertTriangle className="inline-block h-3 w-3 mr-1" />
                Location is off. The report will state that the location was not available.
              </p>
           )}
          </div>
          <Button
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Generating Report...
              </>
            ) : (
              'Generate Report'
            )}
          </Button>

          {report && (
            <Alert>
              <AlertTitle className='font-bold'>Generated Report</AlertTitle>
              <AlertDescription className="text-foreground whitespace-pre-wrap font-mono text-xs">
                {report}
              </AlertDescription>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyToClipboard}
                className="mt-4 w-full"
              >
                {copied ? (
                  <>
                    <ClipboardCheck className="mr-2 h-4 w-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Clipboard className="mr-2 h-4 w-4" /> Copy to Clipboard
                  </>
                )}
              </Button>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
