import { Activity } from "@/interfaces/activity.interface";

export const categorizeActivities = (activities: Activity[]) => {
  const now = new Date();

  const past = activities.filter(
    (activity) => new Date(activity.activity_start_date) < now
  );

  const ongoing = activities.filter(
    (activity) =>
      new Date(activity.activity_start_date) <= now &&
      new Date(activity.activity_start_date).getTime() + activity.activity_duration * 60000 > now.getTime()
  );

  const upcoming = activities.filter(
    (activity) => new Date(activity.activity_start_date) > now
  );

  return { past, ongoing, upcoming };
};
