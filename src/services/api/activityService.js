import activitiesData from "@/services/mockData/activities.json";

const activities = [...activitiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    await delay(280);
    return [...activities];
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === id);
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  },

  async create(activityData) {
    await delay(350);
    const newActivity = {
      ...activityData,
      Id: Math.max(0, ...activities.map(a => a.Id)) + 1,
      date: new Date().toISOString()
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async update(id, activityData) {
    await delay(300);
    const index = activities.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Activity not found");
    }
    activities[index] = { ...activities[index], ...activityData };
    return { ...activities[index] };
  },

  async delete(id) {
    await delay(250);
    const index = activities.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Activity not found");
    }
    activities.splice(index, 1);
    return true;
  }
};