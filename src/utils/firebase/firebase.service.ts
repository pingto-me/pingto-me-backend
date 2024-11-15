import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  getStorage,
  ref,
  getDownloadURL,
  deleteObject,
  FirebaseStorage,
} from 'firebase/storage';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  Auth,
} from 'firebase/auth';

@Injectable()
export class FirebaseService {
  public firestore: admin.firestore.Firestore;
  public auth: admin.auth.Auth;
  public firebaseAuth: Auth;
  public storage: FirebaseStorage;

  constructor() {
    this.firestore = admin.firestore();
    this.auth = admin.auth();

    const firebaseConfig = {
      apiKey: process.env.FIREBASECLIENT_APIKEY,
      authDomain: process.env.FIREBASECLIENT_AUTHDOMAIN,
      projectId: process.env.FIREBASECLIENT_PROJECTID,
      storageBucket: process.env.FIREBASECLIENT_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASECLIENT_MESSAGINGSENDERID,
      appId: process.env.FIREBASECLIENT_APPID,
      measurementId: process.env.FIREBASECLIENT_MEASUREMENTID,
    } as FirebaseOptions;
    const app = initializeApp(firebaseConfig);
    this.firebaseAuth = getAuth(app);

    this.storage = getStorage(app);
  }

  getAuth() {
    return admin.auth();
  }

  getFirestore() {
    return admin.firestore();
  }

  getFirebaseAuth() {
    return this.firebaseAuth;
  }

  createUserWithEmailAndPassword(email: string, password: string) {
    return createUserWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return signInWithEmailAndPassword(this.firebaseAuth, email, password);
  }

  signInWithCustomToken(token: string) {
    return signInWithCustomToken(this.firebaseAuth, token);
  }

  async changePassword(uid: string, newPassword: string) {
    try {
      await admin.auth().updateUser(uid, {
        password: newPassword,
      });
    } catch (error) {}
  }

  async downloadFile(path: string) {
    try {
      const downloadTask = await getDownloadURL(ref(this.storage, `${path}`));
      return downloadTask;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errors: {
            message: error._baseMessage,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteFile(path: string) {
    try {
      await deleteObject(ref(this.storage, `${path}`));
    } catch (error) {}
  }

  async generateSignedUrl(filename: string): Promise<string> {
    const bucket = admin.storage().bucket(ref(this.storage).bucket);

    const cors = [
      {
        origin: ['*'],
        method: ['*'],
        responseHeader: ['Content-Type'],
        maxAgeSeconds: 3600,
      },
    ];
    const metadata = { cors };
    bucket.setMetadata(metadata);

    const options: any = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // URL expires in 15 minutes
    };

    const [url] = await bucket.file(filename).getSignedUrl(options);
    return url;
  }
}
