import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { userService } from "./userService";

export const notificationService = {
  async createNotification({
    userId,
    type,
    fromUserId,
    itemId,
    itemType,
    itemTitle,
    commentText = null,
  }) {
    try {
      const fromUser = await userService.getUserById(fromUserId);

      const notificationData = {
        userId,
        type,
        fromUserId,
        fromUserName: fromUser?.displayName || "Unknown User",
        fromUserPhoto: fromUser?.photoURL || null,
        itemId,
        itemType,
        itemTitle,
        commentText,
        read: false,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(firestore, "notifications"), notificationData);
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  },

  async getUserNotifications(userId, limitCount = 20) {
    try {
      const q = query(
        collection(firestore, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  },

  async markAsRead(notificationId) {
    try {
      await updateDoc(doc(firestore, "notifications", notificationId), {
        read: true,
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  },

  async markAllAsRead(userId) {
    try {
      const q = query(
        collection(firestore, "notifications"),
        where("userId", "==", userId),
        where("read", "==", false)
      );

      const snapshot = await getDocs(q);
      const batch = [];

      snapshot.docs.forEach((doc) => {
        batch.push(updateDoc(doc.ref, { read: true }));
      });

      await Promise.all(batch);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  },

  async deleteNotification(notificationId) {
    try {
      await deleteDoc(doc(firestore, "notifications", notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  },

  async deleteMultipleNotifications(notificationIds) {
    try {
      const deletePromises = notificationIds.map((id) =>
        deleteDoc(doc(firestore, "notifications", id))
      );

      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting multiple notifications:", error);
      throw error;
    }
  },
};
