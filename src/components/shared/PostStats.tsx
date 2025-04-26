import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Models } from "appwrite";

import { checkIsLiked } from "@/lib/utils";
import {
  useGetLikedPosts,
  useSavePost,
  useDeleteSavedPost,
  useGetCurrentUser,
} from "@/lib/react-query/queriesAndMutation";
import Loader from "./Loader";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const location = useLocation();
  const initialLikes = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useGetLikedPosts();
  const { mutate: savePost, isPending:isSavingPost } = useSavePost();
  const { mutate: deleteSavePost,isPending:isDeletingSaved } = useDeleteSavedPost();
  const { data: currentUser } = useGetCurrentUser();

  // Find saved post record for the current post
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  // Whenever savedPostRecord changes, update isSaved
  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [savedPostRecord]);

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let updatedLikes = [...likes];

    if (updatedLikes.includes(userId)) {
      updatedLikes = updatedLikes.filter((id) => id !== userId);
    } else {
      updatedLikes.push(userId);
    }

    setLikes(updatedLikes);
    likePost({ postId: post.$id, likesArray: updatedLikes });
  };

  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (isSaved) {
      setIsSaved(false);
      if (savedPostRecord) {
        deleteSavePost(savedPostRecord.$id);
      }
    } else {
      setIsSaved(true);
      savePost({ userId, postId: post.$id });
    }
  };

  const containerStyles = location.pathname.startsWith("/profile")
    ? "w-full"
    : "";

  return (
    <div
      className={`flex justify-between items-center z-20 ${containerStyles}`}
    >
      <div className="flex gap-2 mr-5">
        <img
          src={checkIsLiked(likes, userId)
            ? "/assets/icons/liked.svg"
            : "/assets/icons/like.svg"}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {
            isSavingPost || isDeletingSaved ?
            <Loader />
            :
            <img
                src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
                alt="save"
                width={20}
                height={20}
                onClick={handleSavePost}
                className="cursor-pointer"/>
        }
      </div>
    </div>
  );
};

export default PostStats;
