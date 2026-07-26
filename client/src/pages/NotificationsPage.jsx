import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import MainLayout from "../layout/MainLayout";
import EmptyState from "../components/EmptyState";
import useNotifications from "../hooks/useNotifications";
import notificationService from "../services/notificationService";
import { timeAgo } from "../utils/helpers";
import { useState } from "react";

const typeIcons = {
  job_application: "📋",
  application_accepted: "✅",
  application_rejected: "❌",
  new_message: "💬",
  payment: "💰",
  review: "⭐",
  job_posted: "📢",
  general: "🔔",
};

const NotificationsPage = () => {
  const { notifications, unreadCount, fetchNotifications, markAllRead } = useNotifications();
  const [localNotifs, setLocalNotifs] = useState(notifications);

  const list = notifications.length ? notifications : localNotifs;

  const handleDelete = async (id) => {
    await notificationService.deleteNotification(id);
    fetchNotifications();
  };

  return (
    <MainLayout>
      <section className="py-12">
        <div className="section-container max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-ink/60">{unreadCount} unread notifications</p>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="btn-secondary !py-2 !px-4 text-sm">
                <CheckCheck size={15} /> Mark all read
              </button>
            )}
          </div>

          {list.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications yet"
              description="You'll see updates about jobs, messages, and payments here."
            />
          ) : (
            <div className="space-y-3">
              {list.map((n, i) => (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`glass-card p-5 flex items-start gap-4 ${!n.read ? "border-l-4 border-mocha" : ""}`}
                >
                  <span className="text-2xl shrink-0">{typeIcons[n.type] || "🔔"}</span>
                  <div className="flex-1 min-w-0">
                    {n.link ? (
                      <Link to={n.link} className="text-sm text-ink hover:text-mocha">
                        {n.message}
                      </Link>
                    ) : (
                      <p className="text-sm text-ink">{n.message}</p>
                    )}
                    <p className="text-xs text-ink/40 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  <button onClick={() => handleDelete(n._id)} className="text-ink/30 hover:text-red-500 shrink-0">
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default NotificationsPage;
