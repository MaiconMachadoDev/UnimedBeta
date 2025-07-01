import { Link } from "react-router-dom";

const PostDetail = ({ post, showBody = false }) => {
  return (
    <div className="mb-8 p-4 bg-white shadow-lg rounded-lg w-full max-w-4xl">
        <p className="text-start text-sm text-gray-500 mb-3">
          Postado por <span className="font-medium text-indigo-600">{post.createdBy}</span>
        </p>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
      )}
      
      <h2 className="text-2xl font-bold text-indigo-700 mb-2">{post.title}</h2>

      {/* 🔑 Se showBody for true, mostra o conteúdo */}
      {showBody ? (
        <p className="text-gray-700 mb-4">{post.body}</p>
      ) : (
        <Link
          to={`/posts/${post.id}`}
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Ler mais
        </Link>
      )}

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="text-xs text-gray-500 mt-2">
        <p>Postado em:</p>{new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
      </div>
    </div>
  );
};

export default PostDetail;
