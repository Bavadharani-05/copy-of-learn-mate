import React from 'react';
import { DynamicAnimatedLearningVideo } from './DynamicAnimatedLearningVideo';

/**
 * AnimatedExplanationPlayer (Wrapper)
 * Backward-compatible adapter for DynamicAnimatedLearningVideo.
 */
export function AnimatedExplanationPlayer({
  title = "Concept Explanation",
  explanationText = "",
  animationPlan = null,
  user = null,
  learnerProfile = null,
  onClose = null,
  ...rest
}) {
  return (
    <DynamicAnimatedLearningVideo
      title={title}
      answer={explanationText}
      animationPlan={animationPlan}
      user={user}
      learnerProfile={learnerProfile}
      onClose={onClose}
      {...rest}
    />
  );
}

export default AnimatedExplanationPlayer;
