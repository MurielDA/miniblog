import { useState, useEffect } from 'react';
import type { Comment } from '../types';
import { commentsAPI } from '../api';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { AxiosError } from 'axios';

interface CommentsListProps {
  postId: string;
  isOpen: boolean;
  onCommentCreated?: () => void;
  onCommentDeleted?: () => void;
}
const CommentsList = ({ postId, isOpen, onCommentCreated, onCommentDeleted }: CommentsListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchComments = async (pageNum: number = 1, append: boolean = false) => {
    if (!isOpen) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await commentsAPI.getPostComments(postId, pageNum, 20);
      const { data, pagination } = response.data.data;

      if (append) {
        setComments((prev) => [...prev, ...data]);
      } else {
        setComments(data);
      }

      setHasMore(pageNum < pagination.totalPages);
    } catch (err) {
      if(err instanceof AxiosError){
                setError(err.response?.data?.message || 'Failed to create comment');
        }else{
                setError('Failed to create comment');
        }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postId]);

  const handleCommentCreated = () => {
    fetchComments(1, false);
    setPage(1);
    onCommentCreated?.();
  };

  const handleCommentDeleted = () => {
    fetchComments(1, false);
    setPage(1);
    onCommentDeleted?.();
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage, true);
  };

  if (!isOpen) return null;

  return (
    <div className="border-t mt-4">
      {/* Comment Form */}
      <CommentForm postId={postId} onCommentCreated={handleCommentCreated} />

      {/* Comments List */}
      <div className="mt-4">
        {error && (
          <div className="text-red-500 text-sm py-2 px-4 bg-red-50 rounded">
            {error}
          </div>
        )}

        {isLoading && comments.length === 0 ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <>
            <div className="divide-y">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={handleCommentDeleted}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center py-3">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="text-orange-500 hover:underline text-sm font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Load more comments'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentsList;