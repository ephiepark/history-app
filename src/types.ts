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

export interface WithId {
  id: string,
};

export type EventWithId = Event & WithId;
/*
{
 title: string;
  description: string;
  tags: Array<string>;
  userId: string;
  eventTime: string;
  createdTime: number;
  id: string;
}
 */

export const eventTags = ['한국사', '삼국시대', '조선시대', '근현대사'];
