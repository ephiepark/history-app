export interface UserInfo {
  username: string;
  profilePicHandle: string | null;
};

export interface WithLoadingState {
  loadState: 'idle' | 'loading' | 'failed';
};

export interface Event {
  title: string;
  description: string;
  tags: Array<string>;
  userId: string;
  eventTime: string;
  createdTime: number;
};

export const eventTags = ['한국사', '삼국시대', '조선시대', '근현대사'];
