// Avatar customization data and types

export type AvatarType = 'initials' | 'upload' | 'camera' | 'custom';

export interface CustomAvatarData {
  face: string;
  skinColor: string;
  accessories: string[];
}

export interface AvatarConfig {
  type: AvatarType;
  imageUrl?: string; // For upload/camera
  customData?: CustomAvatarData; // For custom builder
  initials?: string; // For initials type
}

// Avatar customization options
export const FACE_OPTIONS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'cool', emoji: '😎', label: 'Cool' },
  { id: 'silly', emoji: '🤪', label: 'Silly' },
  { id: 'excited', emoji: '🤩', label: 'Excited' },
  { id: 'nerdy', emoji: '🤓', label: 'Nerdy' },
  { id: 'wink', emoji: '😉', label: 'Wink' },
  { id: 'laughing', emoji: '😆', label: 'Laughing' },
  { id: 'smirk', emoji: '😏', label: 'Smirk' },
];

export const SKIN_COLORS = [
  { id: 'light', color: '#FFE0BD', label: 'Light' },
  { id: 'medium-light', color: '#F1C27D', label: 'Medium Light' },
  { id: 'medium', color: '#E0AC69', label: 'Medium' },
  { id: 'medium-dark', color: '#C68642', label: 'Medium Dark' },
  { id: 'dark', color: '#8D5524', label: 'Dark' },
  { id: 'very-dark', color: '#5C3317', label: 'Very Dark' },
];

export const ACCESSORY_OPTIONS = [
  { id: 'none', emoji: '', label: 'None' },
  { id: 'hat', emoji: '🎩', label: 'Top Hat' },
  { id: 'crown', emoji: '👑', label: 'Crown' },
  { id: 'party', emoji: '🎉', label: 'Party' },
  { id: 'glasses', emoji: '👓', label: 'Glasses' },
  { id: 'headphones', emoji: '🎧', label: 'Headphones' },
  { id: 'flower', emoji: '🌸', label: 'Flower' },
  { id: 'star', emoji: '⭐', label: 'Star' },
];

// Helper function to generate initials
export function generateInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Helper function to generate avatar URL from config
export function getAvatarUrl(config: AvatarConfig): string | undefined {
  if (config.type === 'upload' || config.type === 'camera') {
    return config.imageUrl;
  }
  return undefined;
}

// Helper function to create default avatar config
export function createDefaultAvatar(name: string): AvatarConfig {
  return {
    type: 'initials',
    initials: generateInitials(name),
  };
}
