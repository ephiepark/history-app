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
  imageHandle: string | null;
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

// export const eventTags = ['한국사', '삼국시대', '조선시대', '근현대사'];

export interface Tag {
  tagName: string;
  createdTime: number;
  userId: string;
};

export type TagWithId = Tag & WithId;

export const getTagsFromIds = (allTags: Array<TagWithId>, tagIds: Array<string>): Array<TagWithId> => {
  return tagIds.map((tagId) => allTags.find((tag) => tag.id === tagId)!);
};

export interface Filter {
  tagIds: Array<string>;
};

export interface SavedFilter {
  savedFilters: Array<Filter>;
  userId: string;
  createdTime: number;
};

export type SavedFilterWithId = SavedFilter & WithId;
