import { INewPost, INewUser, IUpdatePost } from '@/types'
import {useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
  } from '@tanstack/react-query'
import { CreatePost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getUserPosts, likedPost, savePost, searchPosts, signInAccount, signOutAccount, updatePost } from '../appwrite/api'
import { QUERY_KEYS } from './queryKeys'


export const useCreateUserAccount =()=>{
    return useMutation({
        mutationFn: ( user: INewUser) => createUserAccount(user)
    })
}
export const useSignInAccount =()=>{
    return useMutation({
        mutationFn: (user: {
            email: string;
            password: string;
        }) => signInAccount(user)
    })
}

export const useSignOutAccount =()=>{
    return useMutation({
        mutationFn:() => signOutAccount()
    })
}

export const useCreatePost =()=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:(post:INewPost) => CreatePost(post),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetRecentPosts =()=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: ()=>getRecentPosts()
    })
}

export const useGetLikedPosts = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[] }) => 
        likedPost(postId, likesArray),
      onSuccess:(data)=>{
        queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
        });
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });

      } // <-- Add return here
      
    });
  };
  

  export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
        savePost(userId, postId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
  };


  export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_POSTS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        });
      },
    });
  };

  export const useGetCurrentUser = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      queryFn: getCurrentUser,
    });
  };


  export const useGetPostById = (postId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
      queryFn: () => getPostById(postId),
      enabled: !!postId,
    });
  };


export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};


export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
};


export const useGetPosts = ()=>{
  return useInfiniteQuery({
  queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
  queryFn: ({ pageParam = null }) => getInfinitePosts(pageParam),
  initialPageParam : null,
  getNextPageParam: (lastPage:any) => {
    if (!lastPage || lastPage.documents.length === 0) return null;
    return lastPage.documents[lastPage.documents.length - 1].$id;
  },
});
}

export const useSearchPosts = (searchTerm:string)=>{
  return useQuery({
    queryKey:[QUERY_KEYS.SEARCH_POSTS,searchTerm],
    queryFn:()=>searchPosts(searchTerm),
    enabled:!!searchTerm,
  })
}