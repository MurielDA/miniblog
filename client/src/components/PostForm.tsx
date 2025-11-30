import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postAPI } from '../api';
import { AxiosError } from 'axios';

interface PostFormProps {
  onPostCreated: () => void;
}

const PostForm = ({ onPostCreated }: PostFormProps) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }

    if (content.length > 280) {
      setError('Content must not exceed 280 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await postAPI.create({ content: content.trim() });
      setContent('');
      onPostCreated();
    } catch (err) {
        if(err instanceof AxiosError){
            setError(err.response?.data?.message || 'Failed to create post');
        }else{
            setError('Failed to create post');
        }
      
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.username[0].toUpperCase()}
          </div>

          {/* Input */}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="w-full border-none outline-none resize-none text-xl placeholder-gray-400"
              rows={3}
            />

            {/* Character count and submit */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t">
              <span
                className={`text-sm ${
                  content.length > 280 ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {content.length}/280
              </span>

              <button
                type="submit"
                disabled={isLoading || !content.trim() || content.length > 280}
                className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Posting...' : 'Post'}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
