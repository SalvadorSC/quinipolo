import React, { useEffect, useState } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { useUser as useUserData } from '../../Context/UserContext/UserContext';

interface Notification {
  _id: string;
  type: 'new_quinipolo' | 'reminder' | 'correction';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  quinipoloId?: string;
  leagueId?: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { userData } = useUserData();

  const fetchNotifications = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const response = await axios.get(`/api/notifications/${userId}`);
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: Notification) => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (userData.moderatedLeagues && userData.moderatedLeagues.length > 0) {
      fetchNotifications();
      // Poll for new notifications every minute
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [userData.moderatedLeagues]);

  // Only show notifications for moderators
  if (!userData.moderatedLeagues || userData.moderatedLeagues.length === 0) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      await axios.patch(`/api/notifications/${userId}/read-all`);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: 360,
          },
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography>No hay notificaciones</Typography>
          </MenuItem>
        ) : (
          <>
            <MenuItem onClick={handleMarkAllAsRead}>
              <Typography variant="body2" color="primary">
                Marcar todas como leídas
              </Typography>
            </MenuItem>
            {notifications.map((notification) => (
              <MenuItem
                key={notification._id}
                onClick={() => handleMarkAsRead(notification._id)}
                sx={{
                  backgroundColor: notification.isRead ? 'inherit' : 'action.hover',
                  display: 'block',
                  whiteSpace: 'normal',
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="primary">
                    {notification.title}
                  </Typography>
                  <Typography variant="body2">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(notification.createdAt)}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </>
        )}
      </Menu>
    </>
  );
};

export default Notifications; 