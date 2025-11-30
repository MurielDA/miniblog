import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { commentsAPI } from '../api';

interface CommentItemProps {
  comment: Comment;
  onDelete?: () => void;
}

const CommentItem = ({ comment, onDelete }: CommentItemProps) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const isAuthor = user?.id === comment.author.id;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setIsDeleting(true);
    try {
      await commentsAPI.delete(comment.id);
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex space-x-3 py-3">
      {/* Avatar */}
      <Link to={`/profile/${comment.author.id}`}>
        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 hover:opacity-80 transition">
          {comment.author.username[0].toUpperCase()}
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 rounded-2xl px-4 py-2">
          <div className="flex justify-between items-start">
            <Link
              to={`/profile/${comment.author.id}`}
              className="font-semibold hover:underline"
            >
              {comment.author.username}
            </Link>
            {isAuthor && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-500 hover:bg-red-50 px-2 py-1 rounded transition text-sm"
                title="Delete comment"
              >
                {isDeleting ? '...' : '×'}
              </button>
            )}
          </div>
          <p className="text-gray-800 mt-1 break-words">{comment.content}</p>
        </div>
        <div className="flex items-center space-x-4 mt-1 px-4">
          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;