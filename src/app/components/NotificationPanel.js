import { useEffect, useState } from 'react';
import axios from 'axios';

export default function NotificationPanel({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/notifications', {
          withCredentials: true,
        });
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 2 * 60 * 60 * 1000); // every 2 hours

    return () => clearInterval(interval);
  }, []);

  return (
    <aside>
      <ul className="space-y-3 text-gray-700 text-sm h-80 overflow-y-auto pr-2 border rounded-lg  overflow-hidden ">
        {notifications.length > 0 ? (
          notifications.map((note, index) => (
            <li key={index}>🔔 {note.message}</li>
          ))
        ) : (
          <li className='text-center'>No notifications</li>
        )}
      </ul>
    </aside>
  );
}