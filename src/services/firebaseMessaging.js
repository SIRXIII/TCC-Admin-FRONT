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
  setDoc,
  updateDoc,
  getDocs,
  getDoc,
  Timestamp,
  serverTimestamp,
  increment
} from 'firebase/firestore';

/**
 * Firebase Messaging Service
 * Handles real-time message listening and sending via Cloud Firestore
 */

/**
 * Listen to messages for a specific conversation
 * @param {string} conversationId - The conversation ID
 * @param {Function} callback - Callback function to handle new messages
 * @returns {Function} Unsubscribe function
 */
export const listenMessages = (conversationId, callback) => {
  if (!conversationId) {
    console.error('Conversation ID is required');
    return () => {};
  }

  // Firestore path: conversations/{conversationId}/messages
  const messagesRef = collection(db, `conversations/${conversationId}/messages`);
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
 * Listen to messages for a specific ticket/chat (alias for backward compatibility)
 * @param {string} ticketId - The ticket/chat ID
 * @param {Function} callback - Callback function to handle new messages
 * @returns {Function} Unsubscribe function
 */
export const listenToMessages = listenMessages;

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
 * Writes message with docId = Date.now() and updates conversation metadata
 * @param {string} conversationId - The conversation ID
 * @param {Object} messageData - Message data object { senderId, receiverId, message, order_id? }
 * @returns {Promise} Promise that resolves when message is sent
 */
export const sendMessage = async (conversationId, messageData) => {
  if (!conversationId) {
    throw new Error('Conversation ID is required');
  }

  if (!messageData.senderId || !messageData.receiverId || !messageData.message) {
    throw new Error('senderId, receiverId, and message are required');
  }

  const timestamp = Date.now();
  const messageId = timestamp.toString(); // Use timestamp as docId
  
  // Create message document
  const messageDoc = {
    senderId: messageData.senderId,
    receiverId: messageData.receiverId,
    message: messageData.message,
    isRead: false,
    timestamp: timestamp,
    order_id: messageData.order_id || null,
    created_at: Timestamp.fromMillis(timestamp)
  };

  try {
    // Write message with specific docId
    const messageRef = doc(db, `conversations/${conversationId}/messages/${messageId}`);
    await setDoc(messageRef, messageDoc);

    // Update conversation metadata
    const conversationRef = doc(db, `conversations/${conversationId}`);
    const conversationDoc = await getDoc(conversationRef);
    
    const updateData = {
      lastMessage: messageData.message,
      lastMessageTime: timestamp,
      updatedAt: serverTimestamp()
    };

    if (conversationDoc.exists()) {
      // Update existing conversation
      const currentData = conversationDoc.data();
      const unreadCount = currentData.unreadCount || {};
      
      // Increment receiver's unreadCount
      const receiverId = messageData.receiverId.toString();
      updateData.unreadCount = {
        ...unreadCount,
        [receiverId]: (unreadCount[receiverId] || 0) + 1
      };

      // Ensure participants array includes both users
      const participants = currentData.participants || [];
      if (!participants.includes(messageData.senderId)) {
        participants.push(messageData.senderId);
      }
      if (!participants.includes(messageData.receiverId)) {
        participants.push(messageData.receiverId);
      }
      updateData.participants = participants;

      await updateDoc(conversationRef, updateData);
    } else {
      // Create new conversation
      await setDoc(conversationRef, {
        id: conversationId,
        participants: [messageData.senderId, messageData.receiverId],
        unreadCount: {
          [messageData.receiverId.toString()]: 1
        },
        ...updateData
      });
    }

    return { id: messageId, ...messageDoc };
  } catch (error) {
    console.error('Error sending message to Firestore:', error);
    throw error;
  }
};

/**
 * Send a message to Firestore (alias for backward compatibility)
 * @param {string} ticketId - The ticket/chat ID
 * @param {Object} messageData - Message data object
 * @returns {Promise} Promise that resolves when message is sent
 */
export const sendMessageToFirebase = sendMessage;

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

/**
 * Listen to all conversations for a user (realtime conversation list)
 * @param {string} userId - Current user ID
 * @param {Function} callback - Callback function to handle conversation updates
 * @returns {Function} Unsubscribe function
 */
export const listenConversations = (userId, callback) => {
  if (!userId) {
    console.error('User ID is required');
    return () => {};
  }

  const conversationsRef = collection(db, 'conversations');
  
  const unsubscribe = onSnapshot(
    conversationsRef,
    (snapshot) => {
      const conversations = [];
      
      snapshot.docs.forEach(doc => {
        const conversationData = doc.data();
        const participants = conversationData.participants || [];
        
        // Check if current user is a participant
        const isParticipant = 
          participants.includes(userId) ||
          participants.includes(userId.toString()) ||
          participants.some(p => p.toString() === userId.toString());
        
        if (isParticipant) {
          const unreadCount = conversationData.unreadCount || {};
          const userUnreadCount = unreadCount[userId.toString()] || unreadCount[userId] || 0;
          
          conversations.push({
            id: doc.id,
            conversationId: doc.id,
            lastMessage: conversationData.lastMessage || '',
            lastMessageTime: conversationData.lastMessageTime || 0,
            unreadCount: userUnreadCount,
            participants: participants,
            order_id: conversationData.order_id,
            updatedAt: conversationData.updatedAt
          });
        }
      });

      // Sort by lastMessageTime descending
      conversations.sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0));
      
      callback(conversations);
    },
    (error) => {
      console.error('Error listening to conversations:', error);
      callback([]);
    }
  );

  return unsubscribe;
};

/**
 * Mark messages as read and reset unreadCount for a user
 * @param {string} conversationId - The conversation ID
 * @param {string} userId - User ID to mark messages as read for
 * @returns {Promise} Promise that resolves when messages are marked as read
 */
export const markMessagesAsRead = async (conversationId, userId) => {
  if (!conversationId || !userId) {
    throw new Error('Conversation ID and User ID are required');
  }

  try {
    // Get all unread messages from other users
    const messagesRef = collection(db, `conversations/${conversationId}/messages`);
    const unreadQuery = query(
      messagesRef,
      where('isRead', '==', false),
      where('receiverId', '==', userId.toString())
    );
    
    const snapshot = await getDocs(unreadQuery);
    const batch = [];
    
    // Update all unread messages
    snapshot.docs.forEach(doc => {
      batch.push(updateDoc(doc.ref, { isRead: true }));
    });

    // Reset unreadCount for this user in conversation
    const conversationRef = doc(db, `conversations/${conversationId}`);
    const conversationDoc = await getDoc(conversationRef);
    
    if (conversationDoc.exists()) {
      const currentData = conversationDoc.data();
      const unreadCount = currentData.unreadCount || {};
      unreadCount[userId.toString()] = 0;
      
      batch.push(updateDoc(conversationRef, { unreadCount }));
    }

    await Promise.all(batch);
    return { success: true, count: snapshot.docs.length };
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

