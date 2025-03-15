'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import { artifactDefinitions, ArtifactKind } from './artifact';
import { Suggestion } from '@/lib/db/schema';
import { initialArtifactData, useArtifact } from '@/hooks/use-artifact';

export type DataStreamDelta = {
  type:
    | 'text-delta'
    | 'code-delta'
    | 'sheet-delta'
    | 'image-delta'
    | 'title'
    | 'id'
    | 'suggestion'
    | 'clear'
    | 'finish'
    | 'kind'
    | 'sources';
  content: string | Suggestion | Array<{ title: string; url: string; snippet?: string }>;
};

export interface Source {
  title: string;
  url: string;
  snippet?: string;
}

export function DataStreamHandler({ id }: { id: string }) {
  const { data: dataStream, setMessages } = useChat({ id });
  const { artifact, setArtifact, setMetadata } = useArtifact();
  const lastProcessedIndex = useRef(-1);
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    if (!dataStream?.length) return;

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    (newDeltas as DataStreamDelta[]).forEach((delta: DataStreamDelta) => {
      const artifactDefinition = artifactDefinitions.find(
        (artifactDefinition) => artifactDefinition.kind === artifact.kind,
      );

      if (artifactDefinition?.onStreamPart) {
        artifactDefinition.onStreamPart({
          streamPart: delta,
          setArtifact,
          setMetadata,
        });
      }

      if (delta.type === 'sources') {
        const sourcesData = delta.content as Source[];
        setSources(sourcesData);
        
        setMessages((messages) => {
          const lastAssistantMessageIndex = [...messages].reverse().findIndex(
            (m) => m.role === 'assistant'
          );
          
          if (lastAssistantMessageIndex !== -1) {
            const actualIndex = messages.length - 1 - lastAssistantMessageIndex;
            const updatedMessages = [...messages];
            updatedMessages[actualIndex] = {
              ...updatedMessages[actualIndex],
              sources: sourcesData,
            };
            return updatedMessages;
          }
          
          return messages;
        });
      }

      setArtifact((draftArtifact) => {
        if (!draftArtifact) {
          return { ...initialArtifactData, status: 'streaming' };
        }

        switch (delta.type) {
          case 'id':
            return {
              ...draftArtifact,
              documentId: delta.content as string,
              status: 'streaming',
            };

          case 'title':
            return {
              ...draftArtifact,
              title: delta.content as string,
              status: 'streaming',
            };

          case 'kind':
            return {
              ...draftArtifact,
              kind: delta.content as ArtifactKind,
              status: 'streaming',
            };

          case 'clear':
            return {
              ...draftArtifact,
              content: '',
              status: 'streaming',
            };

          case 'finish':
            return {
              ...draftArtifact,
              status: 'idle',
            };

          default:
            return draftArtifact;
        }
      });
    });
  }, [dataStream, setArtifact, setMetadata, artifact, setMessages]);

  return null;
}
