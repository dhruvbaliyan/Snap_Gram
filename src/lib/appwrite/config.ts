// First install app appwrite dependecY
// Import its 

// npm install appwrite   

import {Client , Account, Databases, Storage, Avatars} from 'appwrite'

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_PROJECT_URL,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    // collections 
    post_collectionId : import.meta.env.VITE_APPWRITE_DATABASE_POSTS_ID ,
    save_collectionId : import.meta.env.VITE_APPWRITE_DATABASE_SAVES_ID ,
    user_collectionId : import.meta.env.VITE_APPWRITE_DATABASE_USERS_ID 
};

export const client = new Client();
// console.log(appwriteConfig.projectId);
// console.log(appwriteConfig.url);

client
  .setEndpoint(appwriteConfig.url)
  .setProject(appwriteConfig.projectId)
//   .setSelfSigned(true);

export const account = new Account(client)
export const databases = new Databases(client);

export const storage = new Storage(client);
export const avatars = new Avatars(client);

