'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { LinkIcon } from './icons';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface Source {
  title: string;
  url: string;
  snippet?: string;
}

export function WebSearchSources({ sources }: { sources: Source[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 text-sm">
      <div className="flex items-center gap-2 mb-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-muted-foreground px-2 py-1 h-auto"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide sources' : `Show sources (${sources.length})`}
        </Button>
      </div>
      
      {expanded && (
        <div className="pl-2 border-l-2 border-muted mt-2 space-y-2">
          {sources.map((source, index) => (
            <div key={index} className="text-xs">
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <LinkIcon size={12} />
                      {source.title || 'Source'}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top">{source.url}</TooltipContent>
                </Tooltip>
              </div>
              {source.snippet && (
                <p className="text-muted-foreground mt-1">{source.snippet}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 