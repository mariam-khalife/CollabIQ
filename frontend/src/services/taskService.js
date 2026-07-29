import { apiRequest } from "./api";

export const getProjectTasks = async (projectId) =>
  apiRequest(`/tasks/project/${projectId}`);

export const getUserTasks = async (userId) =>
  apiRequest(`/tasks/user/${userId}`);

export const createTask = async (taskData) => {
  return apiRequest("/tasks/", {
    method: "POST",
    body: taskData,
  });
};

export const updateTask = async (taskId, taskData) => {
  return apiRequest(`/tasks/${taskId}`, {
    method: "PUT",
    body: taskData,
  });
};

export const updateTaskStatus = async (
  taskId,
  status
) => {
  return apiRequest(`/tasks/${taskId}/status`, {
    method: "PATCH",
    body: {
      status,
    },
  });
};

export const deleteTask = async (taskId) => {
  return apiRequest(`/tasks/${taskId}`, {
    method: "DELETE",
  });
};