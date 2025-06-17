import { useState, useEffect } from "react";
import { useAuth } from "../../../services/auth/AuthContext";
import { commentService } from "../../../services/api/commentService";
import { formatDate } from "../../../utils/dateUtils";
import EmptyHeartIcon from "../../../assets/icons/empty-heart.svg?react";
import FilledHeartIcon from "../../../assets/icons/heart.svg?react";
import ReplyIcon from "../../../assets/icons/reply.svg?react";
import SendIcon from "../../../assets/icons/send.svg?react";
import DeleteIcon from "../../../assets/icons/delete.svg?react";
import styled from "styled-components";

const Comment = ({
  comment,
  onReply,
  level = 0,
  songId = null,
  albumId = null,
  onDelete,
}) => {
  const { currentUser } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes || 0);
  const [likingComment, setLikingComment] = useState(false);
  const [deletingComment, setDeletingComment] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadLikeStatus = async () => {
      if (currentUser && comment.id) {
        const liked = await commentService.isCommentLiked(
          comment.id,
          currentUser.uid
        );
        setIsLiked(liked);
      }
    };
    loadLikeStatus();
  }, [comment.id, currentUser]);

  const loadReplies = async () => {
    if (loadingReplies || replies.length > 0) return;

    try {
      setLoadingReplies(true);
      const repliesData = await commentService.getReplies(comment.id);
      setReplies(repliesData);
    } catch (error) {
      console.error("Error loading replies:", error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleShowReplies = async () => {
    if (!showReplies && replies.length === 0) {
      await loadReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !currentUser || submittingReply) return;

    try {
      setSubmittingReply(true);
      const replyData = {
        text: replyText.trim(),
        userId: currentUser.uid,
        parentId: comment.id,
      };

      if (songId) replyData.songId = songId;
      if (albumId) replyData.albumId = albumId;

      const newReply = await commentService.createComment(replyData);

      setReplies((prev) => [...prev, newReply]);
      setReplyText("");
      setShowReplyForm(false);
      setShowReplies(true);

      comment.replyCount = (comment.replyCount || 0) + 1;
    } catch (error) {
      console.error("Error posting reply:", error);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLikeComment = async () => {
    if (!currentUser || likingComment) return;

    try {
      setLikingComment(true);
      const newLikedState = await commentService.toggleCommentLike(
        comment.id,
        currentUser.uid
      );
      setIsLiked(newLikedState);
      setLikeCount((prev) =>
        newLikedState ? prev + 1 : Math.max(0, prev - 1)
      );
    } catch (error) {
      console.error("Error liking comment:", error);
    } finally {
      setLikingComment(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!currentUser || deletingComment) return;

    try {
      setDeletingComment(true);
      await commentService.deleteComment(comment.id, currentUser.uid);
      if (onDelete) {
        onDelete(comment.id);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    } finally {
      setDeletingComment(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleReplyDelete = (deletedReplyId) => {
    setReplies((prev) => prev.filter((reply) => reply.id !== deletedReplyId));
    comment.replyCount = Math.max(0, (comment.replyCount || 0) - 1);
  };

  const canDelete = currentUser && currentUser.uid === comment.userId;

  return (
    <CommentContainer $level={level}>
      <CommentMain>
        <CommentAvatar>
          {comment.userPhoto ? (
            <CommentUserPhoto src={comment.userPhoto} alt={comment.userName} />
          ) : (
            <CommentUserFallback>
              {comment.userName?.[0]?.toUpperCase() || "U"}
            </CommentUserFallback>
          )}
        </CommentAvatar>

        <CommentContent>
          <CommentHeader>
            <CommentUserName>{comment.userName || "Anonymous"}</CommentUserName>
            <CommentTime>{formatDate(comment.createdAt)}</CommentTime>
            {canDelete && (
              <DeleteButton
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deletingComment}
                title="Delete comment"
              >
                <DeleteIcon />
              </DeleteButton>
            )}
          </CommentHeader>

          <CommentText>{comment.text}</CommentText>

          <CommentActions>
            <ActionButton
              onClick={handleLikeComment}
              disabled={likingComment}
              $active={isLiked}
            >
              {isLiked ? <FilledHeartIcon /> : <EmptyHeartIcon />}
              <span>{likeCount > 0 && likeCount}</span>
            </ActionButton>

            {currentUser && level < 2 && (
              <ActionButton onClick={() => setShowReplyForm(!showReplyForm)}>
                <ReplyIcon />
                <span>Reply</span>
              </ActionButton>
            )}

            {comment.replyCount > 0 && (
              <ActionButton onClick={handleShowReplies}>
                <span>
                  {showReplies ? "Hide" : "Show"} {comment.replyCount}{" "}
                  {comment.replyCount === 1 ? "reply" : "replies"}
                </span>
              </ActionButton>
            )}
          </CommentActions>
        </CommentContent>
      </CommentMain>
      {showDeleteConfirm && (
        <DeleteConfirmModal>
          <DeleteConfirmContent>
            <DeleteConfirmText>
              Are you sure you want to delete this comment?
              {comment.replyCount > 0 && (
                <DeleteWarning>
                  This will also delete {comment.replyCount}{" "}
                  {comment.replyCount === 1 ? "reply" : "replies"}.
                </DeleteWarning>
              )}
            </DeleteConfirmText>
            <DeleteConfirmActions>
              <CancelButton
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletingComment}
              >
                Cancel
              </CancelButton>
              <ConfirmDeleteButton
                onClick={handleDeleteComment}
                disabled={deletingComment}
              >
                {deletingComment ? "Deleting..." : "Delete"}
              </ConfirmDeleteButton>
            </DeleteConfirmActions>
          </DeleteConfirmContent>
        </DeleteConfirmModal>
      )}

      {showReplyForm && currentUser && (
        <ReplyForm onSubmit={handleReplySubmit}>
          <ReplyInputContainer>
            <ReplyInput
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${comment.userName}...`}
              disabled={submittingReply}
              maxLength={300}
            />
            <CharacterCount $isNearLimit={replyText.length > 250}>
              {replyText.length}/300
            </CharacterCount>
          </ReplyInputContainer>
          <ReplyActions>
            <CancelButton
              type="button"
              onClick={() => {
                setShowReplyForm(false);
                setReplyText("");
              }}
            >
              Cancel
            </CancelButton>
            <SendButton
              type="submit"
              disabled={!replyText.trim() || submittingReply}
            >
              <SendIcon />
            </SendButton>
          </ReplyActions>
        </ReplyForm>
      )}

      {showReplies && (
        <RepliesContainer>
          {loadingReplies ? (
            <LoadingReplies>Loading replies...</LoadingReplies>
          ) : (
            replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                level={level + 1}
                songId={songId}
                albumId={albumId}
                onDelete={handleReplyDelete}
              />
            ))
          )}
        </RepliesContainer>
      )}
    </CommentContainer>
  );
};

const CommentContainer = styled.div`
  margin-left: ${({ $level }) => $level * 32}px;
  border-left: ${({ $level }) => ($level > 0 ? "2px solid #333" : "none")};
  padding-left: ${({ $level }) => ($level > 0 ? "16px" : "0")};
`;

const CommentMain = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #191919;
  border-radius: 12px;
  margin-bottom: 12px;
`;

const CommentAvatar = styled.div`
  flex-shrink: 0;
`;

const CommentUserPhoto = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const CommentUserFallback = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
`;

const CommentContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const CommentUserName = styled.span`
  color: #fff;
  font-weight: 600;
  font-size: 14px;
`;

const CommentTime = styled.span`
  color: #888;
  font-size: 12px;
`;

const CommentText = styled.p`
  color: #d9d9d9;
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 12px 0;
  word-break: break-word;
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ $active }) => ($active ? "#ff4343" : "#888")};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;

  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }

  &:hover:not(:disabled) {
    color: ${({ $active }) => ($active ? "#e03d3d" : "#fff")};
    background: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-left: auto;

  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }

  &:hover:not(:disabled) {
    color: #ff4343;
    background: rgba(255, 67, 67, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ReplyForm = styled.form`
  display: flex;
  gap: 12px;
  margin: 0 0 16px 52px;
  padding: 16px;
  background: #232323;
  border-radius: 8px;
`;

const ReplyInputContainer = styled.div`
  flex: 1;
  position: relative;
`;

const ReplyInput = styled.textarea`
  width: 100%;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 8px 12px 24px 12px;
  color: #fff;
  font-size: 13px;
  resize: none;
  min-height: 60px;
  font-family: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #ff4343;
  }

  &::placeholder {
    color: #888;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CharacterCount = styled.div`
  position: absolute;
  bottom: 4px;
  right: 8px;
  font-size: 10px;
  color: ${({ $isNearLimit }) => ($isNearLimit ? "#ff4343" : "#666")};
  font-weight: 500;
  pointer-events: none;
`;

const ReplyActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CancelButton = styled.button`
  background: none;
  border: 1px solid #666;
  color: #888;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #888;
    color: #fff;
  }
`;

const SendButton = styled.button`
  background: #ff4343;
  border: none;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    fill: #fff;
  }

  &:hover:not(:disabled) {
    background: #e03d3d;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const RepliesContainer = styled.div`
  border-top: 1px solid #333;
  padding-top: 12px;
`;

const LoadingReplies = styled.div`
  color: #888;
  font-size: 13px;
  text-align: center;
  padding: 16px;
`;

const DeleteConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DeleteConfirmContent = styled.div`
  background: #232323;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  margin: 20px;
  border: 1px solid #444;
`;

const DeleteConfirmText = styled.div`
  color: #fff;
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 1.4;
`;

const DeleteWarning = styled.div`
  color: #ff8a80;
  font-size: 14px;
  margin-top: 8px;
  font-style: italic;
`;

const DeleteConfirmActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ConfirmDeleteButton = styled.button`
  background: #ff4343;
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #e03d3d;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

export default Comment;
