import Loader from "@/components/shared/Loader";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";
import PostCard from "@/components/shared/PostCard";

const Home = () => {
  // * const { data: posts, isPending: isPostLoading, isError: isErrorPosting } = useGetRecentPosts();
  const { data: posts, isPending: isPostLoading } = useGetRecentPosts();

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold text-left w-full md:h2-bold">
            Home Feed
          </h2>

          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard post= {post}/>
                
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
