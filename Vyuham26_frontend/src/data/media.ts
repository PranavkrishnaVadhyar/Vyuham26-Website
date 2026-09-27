/**
 * MEDIA REGISTRY
 * ------------------------------------------------------------------
 * Every visual asset used by the cinematic experience is registered here.
 * Swap a URL (image or video) and the whole site updates — no component
 * edits required. Local files can be used too (e.g. "/media/hero.mp4").
 */

export const MEDIA = {
  /** Hero ambience — looping, muted, cinematically graded behind the title. */
  heroVideo: "https://videos.pexels.com/video-files/29686188/12767975_1920_1080_30fps.mp4",
  heroPoster:
    "https://images.pexels.com/videos/29686188/abstract-black-chaotic-close-up-29686188.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",

  campusNight:
    "https://images.pexels.com/photos/32120505/pexels-photo-32120505.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  campusFigure:
    "https://images.pexels.com/photos/36707300/pexels-photo-36707300.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  tower:
    "https://images.pexels.com/photos/33072178/pexels-photo-33072178.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  tunnel:
    "https://images.pexels.com/photos/15056137/pexels-photo-15056137.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  streetLight:
    "https://images.pexels.com/photos/10995856/pexels-photo-10995856.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",

  lab: "https://images.pexels.com/photos/3861960/pexels-photo-3861960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  electronics:
    "https://images.pexels.com/photos/34007253/pexels-photo-34007253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  lecture:
    "https://images.pexels.com/photos/19895774/pexels-photo-19895774.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  filmCrew:
    "https://images.pexels.com/photos/34007217/pexels-photo-34007217.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  oscilloscope:
    "https://images.pexels.com/photos/34007241/pexels-photo-34007241.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  robotics:
    "https://images.pexels.com/photos/7869033/pexels-photo-7869033.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  roboticsWide:
    "https://images.pexels.com/photos/7869034/pexels-photo-7869034.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",

  stage:
    "https://images.pexels.com/photos/20407014/pexels-photo-20407014.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  crowd:
    "https://images.pexels.com/photos/3727146/pexels-photo-3727146.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  laser:
    "https://images.pexels.com/photos/36670198/pexels-photo-36670198.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  crowdBlue:
    "https://images.pexels.com/photos/38485789/pexels-photo-38485789.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  dancers:
    "https://images.pexels.com/photos/16039776/pexels-photo-16039776.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  dancerSilhouette:
    "https://images.pexels.com/photos/28825952/pexels-photo-28825952.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  kathakali:
    "https://images.pexels.com/photos/20258867/pexels-photo-20258867.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",

  esports:
    "https://images.pexels.com/photos/9072336/pexels-photo-9072336.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  esportsArena:
    "https://images.pexels.com/photos/9072392/pexels-photo-9072392.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  arcade:
    "https://images.pexels.com/photos/19012040/pexels-photo-19012040.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  gamingRoom:
    "https://images.pexels.com/photos/9072216/pexels-photo-9072216.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  victory:
    "https://images.pexels.com/photos/9072269/pexels-photo-9072269.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",

  impactField:
    "https://images.pexels.com/photos/5029855/pexels-photo-5029855.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  impactTeam:
    "https://images.pexels.com/photos/6647026/pexels-photo-6647026.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
} as const;

export type MediaKey = keyof typeof MEDIA;
