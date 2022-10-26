import { firebaseConfig } from './firebaseConfig';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  NextOrObserver,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  Unsubscribe,
  User
} from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, DocumentData, DocumentReference, DocumentSnapshot, Firestore, getDoc, getDocs, getFirestore, orderBy, query, setDoc, where } from "firebase/firestore";
import { FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Event, EventWithId, Tag, TagWithId, UserInfo } from "../types";

export default class FirebaseApi {
  app: FirebaseApp;
  analytics: Analytics;
  auth: Auth;
  googleAuthProvider: GoogleAuthProvider;
  firestore: Firestore;
  storage: FirebaseStorage;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.auth = getAuth(this.app);
    this.googleAuthProvider = new GoogleAuthProvider();
    this.firestore = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  onAuthStateChanged = (nextOrObserver: NextOrObserver<User>): Unsubscribe => {
    return onAuthStateChanged(this.auth, nextOrObserver);
  };

  signInWithGoogleRedirect = () => {
    return signInWithRedirect(this.auth, this.googleAuthProvider);
  };

  signOut = () => {
    return signOut(this.auth);
  }

  getUserRef = (userId: string) => {
    return doc(this.firestore, "users", userId);
  };

  asyncSetUserInfo = async (userId: string, userInfo: UserInfo) => {
    await setDoc(this.getUserRef(userId), userInfo);
    return await this.asyncGetUserInfo(userId);
  };

  asyncUpdateUserInfo = async (userId: string, userInfo: Partial<UserInfo>) => {
    await setDoc(this.getUserRef(userId), userInfo, { merge: true });
    return await this.asyncGetUserInfo(userId);
  };

  asyncGetUserInfo = async (userId: string): Promise<UserInfo | null> => {
    const docSnap = await getDoc(this.getUserRef(userId));
    if (!docSnap.exists()) {
      return null;
    }
    return {
      username: docSnap.data().username,
      profilePicHandle: docSnap.data().profilePicHandle ?? null,
    };
  };

  asyncUploadImage = async (userId: string, file: File): Promise<string> => {
    const path = userId + '/' + file.name;
    const storageRef = ref(this.storage, path);
    const ret = await uploadBytes(storageRef, file);
    return ret.ref.fullPath;
  };

  asyncGetURLFromHandle = async (handle: string): Promise<string> => {
    const url = await getDownloadURL(ref(this.storage, handle));
    return url;
  };

  getEventRef = (eventId: string) => {
    return doc(this.firestore, "events", eventId);
  };

  asyncGetEvent = async (eventId: string): Promise<EventWithId | null> => {
    const docSnap = await getDoc(this.getEventRef(eventId));
    if (!docSnap.exists()) {
      return null;
    }
    return this.getEventWithIdFromDocSnapshot(docSnap);
  };

  getEventWithIdFromDocSnapshot = (doc: DocumentSnapshot<DocumentData>): EventWithId => {
    return {
      title: doc.data()!.title,
      description: doc.data()!.description,
      tags: doc.data()!.tags,
      userId: doc.data()!.userId,
      eventTime: doc.data()!.eventTime,
      createdTime: doc.data()!.createdTime,
      imageHandle: doc.data()!.imageHandle ?? null,
      id: doc.id,
    }
  };

  asyncCreateEvent = async (event: Event): Promise<EventWithId> => {
    const docRef = await addDoc(collection(this.firestore, "events"), event);
    const eventWithId = await this.asyncGetEvent(docRef.id);
    return eventWithId!;
  };

  asyncUpdateEvent = async (eventId: string, event: Partial<Event>) => {
    await setDoc(this.getEventRef(eventId), event, { merge: true });
    return await this.asyncGetEvent(eventId);
  };

  asyncGetTimeline = async (tags: Array<string>): Promise<Array<EventWithId>> => {
    const q = query(collection(this.firestore, "events"), where("tags", 'array-contains-any', tags), orderBy("eventTime", "desc"));
    const querySnapshot = await getDocs(q);
    const events: Array<EventWithId> = [];
    querySnapshot.forEach((doc) => {
      events.push(this.getEventWithIdFromDocSnapshot(doc));
    });
    return events;
  };

  getTagWithIdFromDocSnapshot = (doc: DocumentSnapshot<DocumentData>): TagWithId => {
    return {
      tagName: doc.data()!.tagName,
      userId: doc.data()!.userId,
      createdTime: doc.data()!.createdTime,
      id: doc.id,
    }
  };

  getTagRef = (tagId: string) => {
    return doc(this.firestore, "tags", tagId);
  };

  asyncGetTag = async (tagId: string): Promise<TagWithId | null> => {
    const docSnap = await getDoc(this.getTagRef(tagId));
    if (!docSnap.exists()) {
      return null;
    }
    return this.getTagWithIdFromDocSnapshot(docSnap);
  };

  asyncGetTags = async (): Promise<Array<TagWithId>> => {
    const q = query(collection(this.firestore, "tags"), orderBy("createdTime", "desc"));
    const querySnapshot = await getDocs(q);
    const tags: Array<TagWithId> = [];
    querySnapshot.forEach((doc) => {
      tags.push(this.getTagWithIdFromDocSnapshot(doc));
    });
    return tags;
  };

  asyncCreateTag = async (tag: Tag): Promise<TagWithId> => {
    const docRef = await addDoc(collection(this.firestore, "tags"), tag);
    const tagWithId = await this.asyncGetTag(docRef.id);
    return tagWithId!;
  };

  asyncDeleteTag = async (tagId: string): Promise<void> => {
    await deleteDoc(this.getTagRef(tagId));
  };
};
