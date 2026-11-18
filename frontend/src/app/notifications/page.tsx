
"use client";

import { useState } from "react";

type Notification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const markAsRead = (id: number) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  return (
    <main className="page">
      <div className="container">
        <h1>My Notifications</h1>

        {notifications.length === 0 ? (
          <div className="empty">
            <p>You have no notifications yet.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification ${
                notification.read ? "read" : "unread"
              }`}
            >
              <h3>{notification.title}</h3>

              <p className="message">{notification.message}</p>

              {!notification.read ? (
                <button onClick={() => markAsRead(notification.id)}>
                  Mark as Read
                </button>
              ) : (
                <p>
                  <small>Already read</small>
                </p>
              )}
            </div>
          ))
        )}

        <a href="/dashboard" className="back">
          Back to Dashboard
        </a>
      </div>

      <style jsx>{`
        .page {
          font-family: Arial, sans-serif;
          background: #f5f5f5;
          min-height: 100vh;
          margin: 0;
          padding: 25px;
          color: black;
        }

        .container {
          max-width: 750px;
          margin: auto;
        }

        h1 {
          color: #c62828;
          text-align: center;
        }

        .notification {
          background: white;
          padding: 18px;
          margin: 15px 0;
          border-radius: 10px;
          box-shadow: 0 2px 6px #ddd;
        }

        .unread {
          border-left: 5px solid #c62828;
        }

        .read {
          border-left: 5px solid #aaa;
        }

        .message {
          color: #444;
          line-height: 1.5;
        }

        button {
          background: #c62828;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
        }

        .back {
          display: inline-block;
          margin-top: 15px;
          color: #c62828;
          text-decoration: none;
        }

        .empty {
          text-align: center;
          background: white;
          padding: 25px;
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}
