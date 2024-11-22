
export function getScheduledDate(dayOfWeek: string): Date {
    const today = new Date();
    const currentDay = today.getDay();
    const targetDay = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
      .indexOf(dayOfWeek);

    let daysToAdd = targetDay - currentDay;
    if (daysToAdd <= 0) {
      daysToAdd += 7; // Move to next week if day has passed
    }

    const scheduledDate = new Date(today);
    scheduledDate.setDate(today.getDate() + daysToAdd);
    return scheduledDate;
  }