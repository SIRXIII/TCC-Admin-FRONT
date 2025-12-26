import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  where,
  addDoc,
  getDocs,
  Timestamp
} from 'firebase/firestore';

/**
 * Firebase Messaging Service
 * Handles real-time message listening and sending via Cloud Firestore
 */

/**
 * Listen to messages for a specific ticket/chat
 * @param {string} ticketId - The ticket/chat ID
 * @param {Function} callback - Callback function to handle new messages
 * @returns {Function} Unsubscribe function
 */
export const listenToMessages = (ticketId, callback) => {
  if (!ticketId) {
    console.error('Ticket ID is required');
    return () => {};
  }

  // Firestore path: conversations/{ticketId}/messages
  const messagesRef = collection(db, `conversations/${ticketId}/messages`);
  const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
  
  // Listen for real-time changes
  const unsubscribe = onSnapshot(
    messagesQuery,
    (snapshot) => {
      const messagesArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messagesArray);
    },
    (error) => {
      console.error('Error listening to messages:', error);
      callback([]);
    }
  );

  return unsubscribe;
};

/**
 * Listen to new messages only (for real-time updates)
 * @param {string} ticketId - The ticket/chat ID
 * @param {Function} callback - Callback function to handle new messages
 * @returns {Function} Unsubscribe function
 */
export const listenToNewMessages = (ticketId, callback) => {
  if (!ticketId) {
    console.error('Ticket ID is required');
    return () => {};
  }

  // Firestore path: conversations/{ticketId}/messages
  const messagesRef = collection(db, `conversations/${ticketId}/messages`);
  const messagesQuery = query(
    messagesRef, 
    orderBy('timestamp', 'desc'),
    limit(50)
  );
  
  const unsubscribe = onSnapshot(
    messagesQuery,
    (snapshot) => {
      const messagesArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messagesArray);
    },
    (error) => {
      console.error('Error listening to new messages:', error);
    }
  );

  return unsubscribe;
};

/**
 * Send a message to Firestore
 * Note: This should typically be done via your backend API
 * This is a helper function if you want to write directly to Firestore
 * @param {string} ticketId - The ticket/chat ID
 * @param {Object} messageData - Message data object
 * @returns {Promise} Promise that resolves when message is sent
 */
export const sendMessageToFirebase = async (ticketId, messageData) => {
  if (!ticketId) {
    throw new Error('Ticket ID is required');
  }

  const messagesRef = collection(db, `conversations/${ticketId}/messages`);
  
  const messageWithTimestamp = {
    ...messageData,
    timestamp: messageData.timestamp || Date.now(),
    created_at: messageData.created_at || Timestamp.now()
  };

  try {
    const docRef = await addDoc(messagesRef, messageWithTimestamp);
    return { id: docRef.id, ...messageWithTimestamp };
  } catch (error) {
    console.error('Error sending message to Firestore:', error);
    throw error;
  }
};

/**
 * Get all messages for a ticket (one-time fetch)
 * @param {string} ticketId - The ticket/chat ID
 * @returns {Promise<Array>} Promise that resolves to array of messages
 */
export const getMessages = async (ticketId) => {
  if (!ticketId) {
    return [];
  }

  try {
    const messagesRef = collection(db, `conversations/${ticketId}/messages`);
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(messagesQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

/**
 * Listen to conversation metadata (unreadCount, lastMessage, etc.)
 * @param {string} ticketId - The ticket/chat ID
 * @param {Function} callback - Callback function to handle conversation updates
 * @returns {Function} Unsubscribe function
 */
export const listenToConversation = (ticketId, callback) => {
  if (!ticketId) {
    console.error('Ticket ID is required');
    return () => {};
  }

  const conversationRef = doc(db, `conversations/${ticketId}`);
  
  const unsubscribe = onSnapshot(
    conversationRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const conversationData = snapshot.data();
        callback({
          id: conversationData.id || ticketId,
          lastMessage: conversationData.lastMessage,
          lastMessageTime: conversationData.lastMessageTime,
          unreadCount: conversationData.unreadCount || 0,
          participants: conversationData.participants || [],
          order_id: conversationData.order_id,
          updatedAt: conversationData.updatedAt
        });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error listening to conversation:', error);
      callback(null);
    }
  );

  return unsubscribe;
};

/**
 * Listen to new unread messages for notifications
 * @param {string} ticketId - The ticket/chat ID
 * @param {string} currentUserId - Current user ID to filter out own messages
 * @param {Function} callback - Callback function to handle new unread messages
 * @returns {Function} Unsubscribe function
 */
export const listenToUnreadMessages = (ticketId, currentUserId, callback) => {
  if (!ticketId) {
    console.error('Ticket ID is required');
    return () => {};
  }

  const messagesRef = collection(db, `conversations/${ticketId}/messages`);
  const messagesQuery = query(
    messagesRef,
    where('isRead', '==', false),
    orderBy('timestamp', 'desc')
  );
  
  let lastMessageTimestamp = Date.now();
  
  const unsubscribe = onSnapshot(
    messagesQuery,
    (snapshot) => {
      const messagesArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter new unread messages from other users
      const newUnreadMessages = messagesArray.filter(msg => {
        const msgTimestamp = msg.timestamp || (msg.created_at?.toMillis?.() || msg.created_at || 0);
        const isNew = msgTimestamp > lastMessageTimestamp;
        const msgSenderId = msg.senderId || msg.sender_id || '';
        const isFromOtherUser = msgSenderId !== currentUserId && 
                              msgSenderId !== currentUserId.toString();
        
        return isNew && isFromOtherUser;
      });

      if (newUnreadMessages.length > 0) {
        // Update last message timestamp
        const latestTimestamp = Math.max(...newUnreadMessages.map(m => 
          m.timestamp || (m.created_at?.toMillis?.() || m.created_at || 0)
        ));
        lastMessageTimestamp = Math.max(lastMessageTimestamp, latestTimestamp);
        
        // Call callback with new messages
        newUnreadMessages.forEach(msg => callback(msg));
      }
    },
    (error) => {
      console.error('Error listening to unread messages:', error);
    }
  );

  return unsubscribe;
};

/**
 * Parse conversation ID to extract participant IDs
 * Format: PAR-2_RID-1 means partner_id=2, rider_id=1
 * @param {string} conversationId - Conversation ID like "PAR-2_RID-1"
 * @returns {Object} Object with participant IDs { partnerId, riderId, travelerId }
 */
const parseConversationId = (conversationId) => {
  const parts = conversationId.split('_');
  const participants = {
    partnerId: null,
    riderId: null,
    travelerId: null
  };

  parts.forEach(part => {
    if (part.startsWith('PAR-')) {
      participants.partnerId = part.replace('PAR-', '');
    } else if (part.startsWith('RID-')) {
      participants.riderId = part.replace('RID-', '');
    } else if (part.startsWith('TRA-') || part.startsWith('TRAV-')) {
      participants.travelerId = part.replace(/TRA(V)?-/, '');
    }
  });

  return participants;
};

/**
 * Get user ID in Firebase format (PAR-2, RID-1, etc.)
 * @param {Object} user - User object
 * @returns {string} User ID in Firebase format
 */
const getUserFirebaseId = (user) => {
  if (user.partner_id) return `PAR-${user.partner_id}`;
  if (user.rider_id) return `RID-${user.rider_id}`;
  if (user.traveler_id) return `TRA-${user.traveler_id}`;
  if (user.id) {
    // Try to determine type from user.type
    if (user.type === 'Partner') return `PAR-${user.id}`;
    if (user.type === 'Rider') return `RID-${user.id}`;
    if (user.type === 'Traveler') return `TRA-${user.id}`;
  }
  return user.id?.toString() || '';
};

/**
 * Listen to all conversations for a user and get unread messages
 * @param {Object} user - Current user object
 * @param {Function} callback - Callback function to handle new unread messages
 * @returns {Function} Unsubscribe function
 */
export const listenToAllConversations = (user, callback) => {
  if (!user) {
    console.error('User object is required');
    return () => {};
  }

  const currentUserFirebaseId = getUserFirebaseId(user);
  const currentUserId = user.id?.toString() || user.partner_id?.toString() || user.rider_id?.toString() || user.traveler_id?.toString() || '';

  if (!currentUserFirebaseId && !currentUserId) {
    console.error('Could not determine user ID');
    return () => {};
  }

  const conversationsRef = collection(db, 'conversations');
  const unsubscribes = [];

  const unsubscribe = onSnapshot(
    conversationsRef,
    (snapshot) => {
      snapshot.docs.forEach(doc => {
        const conversationId = doc.id;
        const conversation = doc.data();
        const participants = conversation.participants || [];
        
        // Parse conversation ID to get participant IDs
        const parsedParticipants = parseConversationId(conversationId);
        
        // Check if current user is a participant
        const isParticipant = 
          participants.includes(currentUserFirebaseId) ||
          participants.includes(currentUserId) ||
          participants.includes(currentUserFirebaseId.toString()) ||
          participants.includes(currentUserId.toString()) ||
          (parsedParticipants.partnerId && user.partner_id && parsedParticipants.partnerId === user.partner_id.toString()) ||
          (parsedParticipants.riderId && user.rider_id && parsedParticipants.riderId === user.rider_id.toString()) ||
          (parsedParticipants.travelerId && user.traveler_id && parsedParticipants.travelerId === user.traveler_id.toString()) ||
          (parsedParticipants.partnerId && user.id && user.type === 'Partner' && parsedParticipants.partnerId === user.id.toString()) ||
          (parsedParticipants.riderId && user.id && user.type === 'Rider' && parsedParticipants.riderId === user.id.toString()) ||
          (parsedParticipants.travelerId && user.id && user.type === 'Traveler' && parsedParticipants.travelerId === user.id.toString());
        
        if (isParticipant) {
          // Listen to messages in this conversation
          const messagesRef = collection(db, `conversations/${conversationId}/messages`);
          
          // Clean up previous listener for this conversation
          const existingUnsubscribe = unsubscribes.find(u => u.conversationId === conversationId);
          if (existingUnsubscribe) {
            existingUnsubscribe.unsubscribe();
            unsubscribes.splice(unsubscribes.indexOf(existingUnsubscribe), 1);
          }
          
          const messagesQuery = query(
            messagesRef,
            where('isRead', '==', false),
            orderBy('timestamp', 'desc')
          );
          
          const messageUnsubscribe = onSnapshot(
            messagesQuery,
            (messagesSnapshot) => {
              const messagesArray = messagesSnapshot.docs.map(doc => ({
                id: doc.id,
                conversationId,
                ...doc.data()
              }));

              // Filter unread messages from other users
              const unreadMessages = messagesArray.filter(msg => {
                const msgSenderId = msg.senderId || msg.sender_id || '';
                
                // Check if message is from current user
                const isFromCurrentUser = 
                  msgSenderId === currentUserFirebaseId ||
                  msgSenderId === currentUserId ||
                  msgSenderId === currentUserFirebaseId.toString() ||
                  msgSenderId === currentUserId.toString() ||
                  (msgSenderId.startsWith('PAR-') && parsedParticipants.partnerId && user.partner_id && msgSenderId === `PAR-${user.partner_id}`) ||
                  (msgSenderId.startsWith('RID-') && parsedParticipants.riderId && user.rider_id && msgSenderId === `RID-${user.rider_id}`) ||
                  (msgSenderId.startsWith('TRA-') && parsedParticipants.travelerId && user.traveler_id && msgSenderId === `TRA-${user.traveler_id}`);
                
                return !isFromCurrentUser;
              });

              // Call callback with unread messages
              unreadMessages.forEach(msg => callback(msg));
            },
            (error) => {
              console.error(`Error listening to messages for conversation ${conversationId}:`, error);
            }
          );

          unsubscribes.push({ conversationId, unsubscribe: messageUnsubscribe });
        }
      });
    },
    (error) => {
      console.error('Error listening to conversations:', error);
    }
  );

  return () => {
    unsubscribes.forEach(({ unsubscribe }) => unsubscribe());
    unsubscribe();
  };
};

