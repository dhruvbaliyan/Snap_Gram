import { INewPost, INewUser } from "@/types";
import { ID, Query } from "appwrite";
import {account, appwriteConfig, avatars, databases,storage } from './config';

// goes to authentication
export async function createUserAccount (user:INewUser){
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );
        // console.log(user.email)
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);
        
        const newUser = await saveToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: new URL(avatarUrl)
        });

        return newUser;
    } catch (error) {
        console.error("❌ Error creating user:", error);
        return error;
    }
}

// goes to db collection
export async function saveToDB(user:{
    accountId:string,
    email: string,
    name:string,
    imageUrl:URL,
    username?:string,
}){
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.user_collectionId,
            ID.unique(),
            user
        );
        
        return newUser;
    } catch (error) {
        console.log(error);
        
    }
}

export async function signInAccount(user:{
    email:string;
    password:string
}) {
    try {
        console.log(user);
        
        const session = await account.createEmailPasswordSession(user.email , user.password);
        console.log(session);
        return session;
    } catch (error) {
        console.log(error)
    }
}

export async function signOutAccount(){
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getAccount() {
    try {
        
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      console.log(error);
    }
}

export async function getCurrentUser(){
    try {
        const currentAccount = await getAccount();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.user_collectionId,
            [Query.equal('accountId' , currentAccount.$id)]
        )
        if(!currentUser)    throw Error;

        return currentUser.documents[0];
    } catch (error) {
        // console.log(error);
        return null;
    }
}

export async function CreatePost(post:INewPost){
   
    try {
        
        // Uploaded File
        const file = await uploadFile(post.file[0]);
    
        if(!file)   throw Error;

        // URL
        const preview = await FilePreview(file.$id);
        if(!preview){
            deleteFile(preview);
        }
        console.log(preview);
        
        const tags = post.tags?.replace(/ /g, "").split(",") || [];

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.post_collectionId,
            ID.unique(),
            {
              creator: post.userId,
              caption: post.caption,
              imageURL: preview,
              imageId: file.$id,
              location: post.location,
              tags: tags,
            }
          );

          if (!newPost) {
            await deleteFile(file.$id);
            throw Error;
          }
          
          return newPost;

    } catch (error) {
        throw error;
    }


}

export async function uploadFile(file:File){
    try {
        const uploadFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );
        return uploadFile;
    } catch (error) {
        throw error
    }
}

export async function FilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFileView(
        appwriteConfig.storageId,
        fileId
      );
      return fileUrl;
    } catch (error) {
      throw error;
    }
  }
  

export async function deleteFile(fileId:string){
    try {
        await storage.deleteFile(
            appwriteConfig.storageId,
            fileId
        )
        return{ status:"ok"};
    } catch (error) {
        console.log(error);
        
    }
}

export async function getRecentPosts(){
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.post_collectionId,
            [Query.orderDesc('$createdAt'),Query.limit(20)]
        )
        if(!posts)  {
            console.log("Error Posting");
            
        };

        return posts;
    } catch (error) {
        console.log(error);
        
    }
}