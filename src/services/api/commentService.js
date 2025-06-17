import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  increment,
  getDoc,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { userService } from "./userService";
import { notificationService } from "./notificationService";
import { trackService } from "./trackService";
import { albumService } from "./albumService";

export const commentService = {
  async createComment({ songId, albumId, userId, text, parentId = null }) {
    try {
      const user = await userService.getUserById(userId);

      const commentData = {
        userId,
        text,
        userName: user?.displayName || "Anonymous",
        userPhoto: user?.photoURL || null,
        createdAt: new Date(),
        likes: 0,
        replyCount: 0,
        parentId,
      };

      if (songId) {
        commentData.songId = songId;
      }
      if (albumId) {
        commentData.albumId = albumId;
      }

      const docRef = await addDoc(
        collection(firestore, "comments"),
        commentData
      );

      if (parentId) {
        await updateDoc(doc(firestore, "comments", parentId), {
          replyCount: increment(1),
        });
      }

      try {
        let itemData;
        let itemOwnerId;
        let itemType;
        let itemId;

        if (songId) {
          itemData = await trackService.getTrackById(songId);
          itemOwnerId = itemData?.userId;
          itemType = "song";
          itemId = songId;
        } else if (albumId) {
          itemData = await albumService.getAlbumById(albumId);
          itemOwnerId = itemData?.userId;
          itemType = "album";
          itemId = albumId;
        }

        if (itemOwnerId && itemOwnerId !== userId) {
          await notificationService.createNotification({
            userId: itemOwnerId,
            type: "comment",
            fromUserId: userId,
            itemId: itemId,
            itemType: itemType,
            itemTitle: itemData?.title || itemData?.name || "Unknown",
            commentText:
              text.length > 50 ? `${text.substring(0, 50)}...` : text,
          });
        }
      } catch (error) {
        console.error("Error creating comment notification:", error);
      }

      return {
        id: docRef.id,
        ...commentData,
      };
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  async getCommentsBySongId(songId) {
    try {
      const q = query(
        collection(firestore, "comments"),
        where("songId", "==", songId),
        where("parentId", "==", null),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  async getCommentsByAlbumId(albumId) {
    try {
      const q = query(
        collection(firestore, "comments"),
        where("albumId", "==", albumId),
        where("parentId", "==", null),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching album comments:", error);
      throw error;
    }
  },

  async getReplies(parentId) {
    try {
      const q = query(
        collection(firestore, "comments"),
        where("parentId", "==", parentId),
        orderBy("createdAt", "asc")
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching replies:", error);
      throw error;
    }
  },

  async toggleCommentLike(commentId, userId) {
    try {
      const likeId = `${userId}_${commentId}`;
      const likeRef = doc(firestore, "commentLikes", likeId);
      const commentRef = doc(firestore, "comments", commentId);

      const likeDoc = await getDoc(likeRef);

      if (likeDoc.exists()) {
        await deleteDoc(likeRef);
        await updateDoc(commentRef, {
          likes: increment(-1),
        });
        return false;
      } else {
        await setDoc(likeRef, {
          userId: userId,
          commentId: commentId,
          createdAt: new Date(),
        });
        await updateDoc(commentRef, {
          likes: increment(1),
        });
        return true;
      }
    } catch (error) {
      console.error("Error toggling comment like:", error);
      throw error;
    }
  },

  async isCommentLiked(commentId, userId) {
    try {
      const likeId = `${userId}_${commentId}`;
      const likeRef = doc(firestore, "commentLikes", likeId);
      const likeDoc = await getDoc(likeRef);
      return likeDoc.exists();
    } catch (error) {
      console.error("Error checking comment like status:", error);
      return false;
    }
  },

  async getCommentLikeStatuses(commentIds, userId) {
    try {
      const statuses = new Map();

      for (const commentId of commentIds) {
        const isLiked = await this.isCommentLiked(commentId, userId);
        statuses.set(commentId, isLiked);
      }

      return statuses;
    } catch (error) {
      console.error("Error getting comment like statuses:", error);
      return new Map();
    }
  },

  async deleteComment(commentId, userId) {
    try {
      const commentRef = doc(firestore, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) {
        throw new Error("Comment not found");
      }

      const commentData = commentDoc.data();

      if (commentData.userId !== userId) {
        throw new Error("Unauthorized: You can only delete your own comments");
      }

      const batch = writeBatch(firestore);

      if (!commentData.parentId) {
        const repliesQuery = query(
          collection(firestore, "comments"),
          where("parentId", "==", commentId)
        );
        const repliesSnapshot = await getDocs(repliesQuery);

        repliesSnapshot.docs.forEach((replyDoc) => {
          batch.delete(replyDoc.ref);
        });

        for (const replyDoc of repliesSnapshot.docs) {
          const replyLikesQuery = query(
            collection(firestore, "commentLikes"),
            where("commentId", "==", replyDoc.id)
          );
          const replyLikesSnapshot = await getDocs(replyLikesQuery);
          replyLikesSnapshot.docs.forEach((likeDoc) => {
            batch.delete(likeDoc.ref);
          });
        }
      } else {
        const parentRef = doc(firestore, "comments", commentData.parentId);
        batch.update(parentRef, {
          replyCount: increment(-1),
        });
      }

      const likesQuery = query(
        collection(firestore, "commentLikes"),
        where("commentId", "==", commentId)
      );
      const likesSnapshot = await getDocs(likesQuery);
      likesSnapshot.docs.forEach((likeDoc) => {
        batch.delete(likeDoc.ref);
      });

      batch.delete(commentRef);

      await batch.commit();

      return { success: true };
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },
};
