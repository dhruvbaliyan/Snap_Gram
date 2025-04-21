import { INewUser } from "@/types";
import { ID, Query } from "appwrite";
import {account, appwriteConfig, avatars, databases } from './config';

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
        const session = await account.createEmailPasswordSession(user.email , user.password);
        console.log(session);
        return session;
    } catch (error) {
        console.log(error)
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