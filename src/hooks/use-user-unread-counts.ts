import { useState, useEffect } from 'react';
import { User } from '@/api/user.api';

export interface UserUnreadCounts {
  [userId: string]: number;
}

export const useUserUnreadCounts = (users: User[] = []) => {
  const [unreadCounts, setUnreadCounts] = useState<UserUnreadCounts>({});

  // Initialize unread counts for all users
  useEffect(() => {
    const initialCounts: UserUnreadCounts = {};
    users.forEach(user => {
      if (!(user.userId in unreadCounts)) {
        initialCounts[user.userId] = 0;
      }
    });
    if (Object.keys(initialCounts).length > 0) {
      setUnreadCounts(prev => ({ ...prev, ...initialCounts }));
    }
  }, [users]);

  const updateUnreadCount = (userId: string, count: number) => {
    setUnreadCounts(prev => ({
      ...prev,
      [userId]: count
    }));
  };

  const incrementUnreadCount = (userId: string) => {
    setUnreadCounts(prev => ({
      ...prev,
      [userId]: (prev[userId] || 0) + 1
    }));
  };

  const decrementUnreadCount = (userId: string) => {
    setUnreadCounts(prev => ({
      ...prev,
      [userId]: Math.max(0, (prev[userId] || 0) - 1)
    }));
  };

  const resetUnreadCount = (userId: string) => {
    setUnreadCounts(prev => ({
      ...prev,
      [userId]: 0
    }));
  };

  const getUnreadCount = (userId: string): number => {
    return unreadCounts[userId] || 0;
  };

  return {
    unreadCounts,
    updateUnreadCount,
    incrementUnreadCount,
    decrementUnreadCount,
    resetUnreadCount,
    getUnreadCount,
  };
}; 