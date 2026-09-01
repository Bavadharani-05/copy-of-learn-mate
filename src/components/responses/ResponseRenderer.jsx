import React from 'react';
import { SimpleResponse } from './SimpleResponse';
import { StepsResponse } from './StepsResponse';
import { FlashcardResponse } from './FlashcardResponse';
import { QuizResponse } from './QuizResponse';
import { ExampleResponse } from './ExampleResponse';
import { ChallengeResponse } from './ChallengeResponse';
import { StoryResponse } from './StoryResponse';
import { KeyPointsResponse } from './KeyPointsResponse';

export function ResponseRenderer({ data, onReadAloud }) {
  if (!data) return null;

  switch (data.type) {
    case 'flashcards':
      return <FlashcardResponse data={data} onReadAloud={onReadAloud} />;
    case 'quiz':
      return <QuizResponse data={data} onReadAloud={onReadAloud} />;
    case 'steps':
      return <StepsResponse data={data} onReadAloud={onReadAloud} />;
    case 'challenge':
      return <ChallengeResponse data={data} onReadAloud={onReadAloud} />;
    case 'example':
      return <ExampleResponse data={data} onReadAloud={onReadAloud} />;
    case 'story':
      return <StoryResponse data={data} onReadAloud={onReadAloud} />;
    case 'keypoints':
      return <KeyPointsResponse data={data} onReadAloud={onReadAloud} />;
    case 'simple':
    default:
      return <SimpleResponse data={data} onReadAloud={onReadAloud} />;
  }
}
export default ResponseRenderer;
