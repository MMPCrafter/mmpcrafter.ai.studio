export type Message = {
  role: 'user' | 'model';
  content: string;
};

export type FeatureType = 'chat' | 'photo' | 'mod' | 'skin' | 'world' | 'addon' | 'pack' | 'template' | 'shader' | 'treasure';

export interface GeneratedContent {
  title: string;
  description: string;
  code?: string | any;
  imageUrl?: string;
}
