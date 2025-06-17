import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../services/api";
import { useAuth } from "../../../services/auth/AuthContext";
import { commentService } from "../../../services/api/commentService";
import {
  followUser,
  unfollowUser,
  checkFollowStatus,
} from "../../../services/followService";
import { useAudio } from "../../../services/AudioContext";
import Song from "../MusicBlocks/Song";
import UserIcon from "../../../assets/icons/user.svg?react";
import SendIcon from "../../../assets/icons/send.svg?react";
import PrimaryButton from "../../ui/Buttons/PrimaryButton";
import styled from "styled-components";
import Comment from "../Comments/Comment";
import { formatNumber } from "../../../utils/formatNumbers";

const AlbumContent = ({ album, tracks }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { playSong } = useAudio();
  const [artistData, setArtistData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [loadingArtist, setLoadingArtist] = useState(true);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchArtistData = async () => {
      if (!album.artist) {
        setLoadingArtist(false);
        return;
      }

      try {
        setLoadingArtist(true);
        let userData = null;

        if (album.userId) {
          userData = await userService.getUserById(album.userId);
        }

        if (userData) {
          setArtistData(userData);
          setFollowersCount(userData.followers || 0);
        } else {
          setArtistData(null);
          setFollowersCount(0);
        }
      } catch (error) {
        console.error("Error fetching artist data:", error);
        setArtistData(null);
        setFollowersCount(0);
      } finally {
        setLoadingArtist(false);
      }
    };

    fetchArtistData();
  }, [album.artist, album.userId]);

  useEffect(() => {
    const checkStatus = async () => {
      if (
        !currentUser ||
        !artistData?.id ||
        currentUser.uid === artistData.id
      ) {
        return;
      }

      const status = await checkFollowStatus(currentUser.uid, artistData.id);
      setIsFollowing(status);
    };

    if (artistData?.id) {
      checkStatus();
    }
  }, [currentUser, artistData]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const commentsData = await commentService.getCommentsByAlbumId(
          album.id
        );
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    };

    if (album.id) {
      fetchComments();
    }
  }, [album.id]);

  const handleFollow = async () => {
    if (
      !currentUser ||
      !artistData?.id ||
      currentUser.uid === artistData.id ||
      loadingFollow
    ) {
      return;
    }

    setLoadingFollow(true);

    try {
      if (isFollowing) {
        const result = await unfollowUser(currentUser.uid, artistData.id);
        if (result.success) {
          setIsFollowing(false);
          setFollowersCount((prev) => Math.max(0, prev - 1));
        }
      } else {
        const result = await followUser(currentUser.uid, artistData.id);
        if (result.success) {
          setIsFollowing(true);
          setFollowersCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error with follow operation:", error);
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleArtistClick = () => {
    if (artistData?.username) {
      navigate(`/profile/${artistData.username}`);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser || submittingComment) return;

    try {
      setSubmittingComment(true);
      const comment = await commentService.createComment({
        albumId: album.id,
        userId: currentUser.uid,
        text: newComment.trim(),
      });

      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentDelete = (deletedCommentId) => {
    setComments((prev) =>
      prev.filter((comment) => comment.id !== deletedCommentId)
    );
  };

  return (
    <ContentContainer>
      <LeftSection>
        <ArtistSection>
          {loadingArtist ? (
            <ArtistPhotoSkeleton />
          ) : artistData?.photoURL ? (
            <ArtistPhoto
              src={artistData.photoURL}
              alt={artistData.displayName || album.artist}
              onClick={handleArtistClick}
            />
          ) : (
            <ArtistPhotoFallback
              onClick={artistData?.username ? handleArtistClick : undefined}
              $clickable={!!artistData?.username}
            >
              {(artistData?.displayName || album.artist)[0]?.toUpperCase() ||
                "A"}
            </ArtistPhotoFallback>
          )}

          {loadingArtist ? (
            <ArtistNameSkeleton />
          ) : (
            <ArtistName
              onClick={artistData?.username ? handleArtistClick : undefined}
              $clickable={!!artistData?.username}
            >
              {artistData?.displayName || album.artist}
            </ArtistName>
          )}

          <FollowersInfo>
            <UserIcon />
            <FollowersCount>{formatNumber(followersCount)}</FollowersCount>
          </FollowersInfo>
          {currentUser &&
            artistData?.id &&
            currentUser.uid !== artistData.id && (
              <FollowButton
                onClick={handleFollow}
                $isFollowing={isFollowing}
                disabled={loadingFollow}
              >
                {loadingFollow
                  ? "Loading..."
                  : isFollowing
                  ? "Unfollow"
                  : "Follow"}
              </FollowButton>
            )}
        </ArtistSection>
      </LeftSection>

      <RightSection>
        <TracksSection>
          <SectionTitle>Album Tracks</SectionTitle>
          <TracksList>
            {tracks.map((track, index) => (
              <TrackItem key={track.id}>
                <Song
                  id={track.id}
                  name={track.title}
                  artist={
                    track.artists ? track.artists.join(", ") : album.artist
                  }
                  duration={track.duration || "--:--"}
                  plays={formatNumber(track.plays || 0)}
                  image={track.imageUrl || album.imageUrl}
                  audioUrl={track.audioUrl}
                  genre={track.genre}
                  description={track.description}
                  allSongs={tracks.map((t) => ({
                    id: t.id,
                    name: t.title,
                    artist: t.artists ? t.artists.join(", ") : album.artist,
                    image: t.imageUrl || album.imageUrl,
                    audioUrl: t.audioUrl,
                    duration: t.duration || "--:--",
                    genre: t.genre,
                    description: t.description,
                  }))}
                />
              </TrackItem>
            ))}
          </TracksList>
        </TracksSection>

        <CommentsSection>
          <SectionTitle>Album Comments</SectionTitle>

          {currentUser && (
            <CommentForm onSubmit={handleCommentSubmit}>
              <CommentInputContainer>
                <CommentInput
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment about this album..."
                  disabled={submittingComment}
                  maxLength={300}
                />
                <CharacterCount $isNearLimit={newComment.length > 250}>
                  {newComment.length}/300
                </CharacterCount>
              </CommentInputContainer>
              <SendButton
                type="submit"
                disabled={!newComment.trim() || submittingComment}
              >
                <SendIcon />
              </SendButton>
            </CommentForm>
          )}

          <CommentsList>
            {loadingComments ? (
              <CommentsLoading>Loading comments...</CommentsLoading>
            ) : comments.length === 0 ? (
              <NoComments>
                No comments yet. Be the first to comment! 💬
              </NoComments>
            ) : (
              comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  albumId={album.id}
                  level={0}
                  onDelete={handleCommentDelete}
                />
              ))
            )}
          </CommentsList>
        </CommentsSection>
      </RightSection>
    </ContentContainer>
  );
};

const ContentContainer = styled.div`
  display: flex;
  gap: 48px;
  width: 100%;
  max-width: 1190px;
  margin: 48px auto 0;
  padding: 0 48px;
  box-sizing: border-box;
`;

const LeftSection = styled.div`
  flex: 0 0 171px;
`;

const ArtistSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const ArtistPhoto = styled.img`
  width: 171px;
  height: 171px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: scale(1.05);
  }
`;

const ArtistPhotoFallback = styled.div`
  width: 171px;
  height: 171px;
  border-radius: 50%;
  background: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  font-weight: 600;
  color: #fff;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition: transform 0.2s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: ${({ $clickable }) => ($clickable ? "scale(1.05)" : "none")};
  }
`;

const ArtistPhotoSkeleton = styled.div`
  width: 171px;
  height: 171px;
  border-radius: 50%;
  background: #2a2a2a;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const ArtistNameSkeleton = styled.div`
  width: 120px;
  height: 16px;
  background: #2a2a2a;
  border-radius: 4px;
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.08) 50%,
      transparent 100%
    );
    animation: shimmer 2s infinite;
  }
`;

const ArtistName = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  text-align: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ $clickable }) => ($clickable ? "#ff4343" : "#fff")};
  }
`;

const FollowersInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 13px;
    height: 15px;
    fill: #a2a2a2;
  }
`;

const FollowersCount = styled.span`
  font-size: 14px;
  color: #a2a2a2;
  font-weight: 400;
`;

const FollowButton = styled(PrimaryButton)`
  background: ${({ $isFollowing }) => ($isFollowing ? "#666" : "transparent")};
  border: ${({ $isFollowing }) => ($isFollowing ? "none" : "1px solid #fff")};
  color: ${({ $isFollowing }) => ($isFollowing ? "#fff" : "#fff")};
  padding: 8px 16px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  min-width: 80px;
  height: 32px !important;
  border-radius: 8px !important;

  &:hover {
    background: ${({ $isFollowing }) => ($isFollowing ? "#555" : "#fff")};
    color: ${({ $isFollowing }) => ($isFollowing ? "#fff" : "#000")};
    border-color: ${({ $isFollowing }) =>
      $isFollowing ? "transparent" : "#fff"};
  }

  &:disabled {
    background: #888;
    color: #fff;
    border: none;
    cursor: not-allowed;
  }
`;

const RightSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const TracksSection = styled.div`
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 24px 0;
`;

const TracksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TrackItem = styled.div`
  width: 100%;

  > div {
    width: 100% !important;
    max-width: none !important;
  }
`;

const CommentsSection = styled.div`
  width: 100%;
  margin-top: 48px;
  padding-top: 48px;
  border-top: 1px solid #333;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  padding: 20px;
  background: #191919;
  border-radius: 12px;
  align-items: flex-start;
`;

const CommentInputContainer = styled.div`
  flex: 1;
  position: relative;
`;

const CommentInput = styled.textarea`
  width: 100%;
  background: #232323;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 12px 16px 32px 16px;
  color: #fff;
  font-size: 14px;
  resize: none;
  min-height: 80px;
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
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: ${({ $isNearLimit }) => ($isNearLimit ? "#ff4343" : "#888")};
  font-weight: 500;
  pointer-events: none;
`;

const SendButton = styled.button`
  background: #ff4343;
  border: none;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;

  svg {
    width: 20px;
    height: 20px;
    fill: #fff;
  }

  &:hover:not(:disabled) {
    background: #e03d3d;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
    transform: none;
  }
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CommentsLoading = styled.div`
  text-align: center;
  color: #888;
  font-size: 16px;
  padding: 40px;
`;

const NoComments = styled.div`
  text-align: center;
  color: #888;
  font-size: 16px;
  padding: 40px;
`;

export default AlbumContent;
