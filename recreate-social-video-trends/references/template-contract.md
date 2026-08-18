# Editable Remotion template contract

## Required shape

Expose a serializable props object with these concepts, adapting names to the project:

```ts
type SocialTrendTemplateProps = {
  clips: Array<{
    src: string;
    startFrom?: number;
    endAt?: number;
    focalPoint?: {x: number; y: number};
    label?: string;
  }>;
  audio?: {src: string; volume?: number};
  cues?: Array<{startFrame: number; endFrame: number; text: string}>;
  brand: {
    primary: string;
    accent: string;
    text: string;
    fontFamily?: string;
    logoSrc?: string;
  };
  transition: {
    preset: string;
    durationInFrames: number;
    intensity?: number;
  };
  cta?: string;
};
```

Validate props with the schema convention already used by the repository. Keep all public inputs compatible with Remotion serialization.

## Implementation rules

- Put scene data and cue data outside rendering components.
- Resolve public assets with `staticFile()` when appropriate.
- Use Remotion media components and project-approved packages.
- Calculate frames from seconds with the composition FPS; avoid unexplained frame literals.
- Centralize easing and transition presets so users can change a style once.
- Give every replaceable clip a stable name and document its intended shot type in example props.
- Use deterministic placeholders when fewer clips are supplied; fail clearly when a required asset is missing.
- Avoid CSS transitions, wall-clock timers, random values without stable seeds, and DOM measurements that vary across renders.

## Quality gates

- No black or empty frames at clip boundaries.
- No transition exceeds either neighboring scene's usable duration.
- Lyrics and captions remain inside platform-safe areas and are readable over every clip.
- Audio cues align with visual changes within one frame where timing data is available.
- The example composition renders from clean props without manual file edits.
