import PostForm from "@/components/forms/PostForm"

const CreatePosts = () => {
  return (
    <div className='flex flex-1'>
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img 
            src="/assets/icons/add-post.svg" 
            alt="addPost" />
            <h2 className="h3-bold md:h2-bold text-left width-full">
              Create Post
            </h2>
        </div>

        <PostForm action="create"/>
      </div>
    </div>
  )
}

export default CreatePosts