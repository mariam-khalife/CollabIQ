import { apiRequest } from "./api";

export const getNotifications = async ({
  type,
  unread,
} = {}) => {
  const parameters = new URLSearchParams();

  if (type) {
    parameters.set("type", type);
  }

  if (typeof unread === "boolean") {
    parameters.set("unread", String(unread));
  }

  const query = parameters.toString();

  return apiRequest(
    `/notifications/${query ? `?${query}` : ""}`
  );
};

export const getUnreadCount = async () =>
  apiRequest("/notifications/unread-count");

export const markNotificationAsRead = async (
  notificationId
) =>
  apiRequest(
    `/notifications/${notificationId}/read`,
    {
      method: "PUT",
    }
  );

export const markAllNotificationsAsRead = async () =>
  apiRequest("/notifications/read-all", {
    method: "PUT",
  });