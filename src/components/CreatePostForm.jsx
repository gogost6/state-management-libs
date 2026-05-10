import { useCreatePostMutation } from "../features/posts/postsApi";

export default function CreatePostForm() {
  const [createPost] = useCreatePostMutation();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const title = form.title.value;
    const body = form.body.value;
    await createPost({ title, body });
    form.reset();
  };

  return (
    <form onSubmit={handleCreatePost} className="card post-form">
      <p className="eyebrow">Submit content</p>
      <h2>Create a new post</h2>
      <div className="form-field">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Enter a title…"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="body">Body</label>
        <textarea
          name="body"
          id="body"
          rows="4"
          placeholder="Write something…"
          required
        ></textarea>
      </div>
      <button type="submit" className="primary form-submit">
        Create Post
      </button>
    </form>
  );
}
