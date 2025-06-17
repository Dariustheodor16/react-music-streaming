import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "./firebase";
import { notificationService } from "./api/notificationService";

export const followUser = async (currentUserId, targetUserId) => {
  try {
    const followDocRef = doc(
      firestore,
      "follows",
      `${currentUserId}_${targetUserId}`
    );
    const userDocRef = doc(firestore, "users", targetUserId);
    const currentUserDocRef = doc(firestore, "users", currentUserId);

    await setDoc(followDocRef, {
      followerId: currentUserId,
      followingId: targetUserId,
      createdAt: new Date(),
    });

    await updateDoc(userDocRef, { followers: increment(1) });
    await updateDoc(currentUserDocRef, { following: increment(1) });

    try {
      await notificationService.createNotification({
        userId: targetUserId,
        type: "follow",
        fromUserId: currentUserId,
        itemId: null,
        itemType: null,
        itemTitle: null,
      });
    } catch (error) {
      console.error("Error creating follow notification:", error);
    }

    return { success: true };
  } catch (error) {
    console.error("Error following user:", error);
    return { success: false, error: error.message };
  }
};

export const unfollowUser = async (currentUserId, targetUserId) => {
  try {
    const followDocRef = doc(
      firestore,
      "follows",
      `${currentUserId}_${targetUserId}`
    );
    const userDocRef = doc(firestore, "users", targetUserId);
    const currentUserDocRef = doc(firestore, "users", currentUserId);

    await deleteDoc(followDocRef);

    await updateDoc(userDocRef, { followers: increment(-1) });
    await updateDoc(currentUserDocRef, { following: increment(-1) });

    return { success: true };
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return { success: false, error };
  }
};

export const checkFollowStatus = async (currentUserId, targetUserId) => {
  try {
    const followDocRef = doc(
      firestore,
      "follows",
      `${currentUserId}_${targetUserId}`
    );
    const followDoc = await getDoc(followDocRef);
    return followDoc.exists();
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
};

export const getFollowers = async (userId) => {
  try {
    const q = query(
      collection(firestore, "follows"),
      where("followingId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data().followerId);
  } catch (error) {
    console.error("Error getting followers:", error);
    return [];
  }
};

export const getFollowing = async (userId) => {
  try {
    const q = query(
      collection(firestore, "follows"),
      where("followerId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data().followingId);
  } catch (error) {
    console.error("Error getting following:", error);
    return [];
  }
};
