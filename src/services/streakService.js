/**
 * Streak tracking service for LearnMate AI.
 * Persists daily streak data in localStorage and computes calendar-based increments and resets.
 */

const STORAGE_KEY = 'learnmate_streak';

/**
 * Returns the current local date in YYYY-MM-DD format.
 */
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Computes difference in calendar days between dateStr1 and dateStr2 (dateStr2 - dateStr1).
 */
export function getDaysDifference(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return null;
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  const dFirst = new Date(y1, m1 - 1, d1);
  const dSecond = new Date(y2, m2 - 1, d2);
  const diffTime = dSecond.getTime() - dFirst.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Retrieves the current streak status, resetting to 0 if a day was missed.
 */
export function getStreakData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        streakDays: 0,
        lastActiveDate: null,
        isActiveToday: false
      };
    }

    const parsed = JSON.parse(raw);
    const today = getLocalDateString();
    const streakDays = typeof parsed.streakDays === 'number' ? parsed.streakDays : 0;
    const lastActiveDate = parsed.lastActiveDate || null;
    const isActiveToday = lastActiveDate === today;

    // If last active was before yesterday (missed at least 1 day), streak resets to 0
    if (lastActiveDate && !isActiveToday) {
      const diff = getDaysDifference(lastActiveDate, today);
      if (diff > 1) {
        const resetData = {
          streakDays: 0,
          lastActiveDate,
          isActiveToday: false
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
        return resetData;
      }
    }

    return {
      streakDays,
      lastActiveDate,
      isActiveToday
    };
  } catch (e) {
    console.error("Error reading streak data:", e);
    return {
      streakDays: 0,
      lastActiveDate: null,
      isActiveToday: false
    };
  }
}

/**
 * Records daily learning activity.
 * Increments streak if consecutive day, sets to 1 if starting fresh or after a break,
 * or retains streak if already recorded today.
 */
export function recordDailyActivity() {
  try {
    const current = getStreakData();
    const today = getLocalDateString();

    if (current.isActiveToday) {
      return {
        ...current,
        isNewIncrement: false,
        message: "You're already active today! Daily streak preserved."
      };
    }

    let newStreak = 1;
    if (current.lastActiveDate) {
      const diff = getDaysDifference(current.lastActiveDate, today);
      if (diff === 1) {
        // Logged in on consecutive day
        newStreak = current.streakDays + 1;
      } else {
        // Missed days, start new streak at 1
        newStreak = 1;
      }
    } else {
      // First day of activity
      newStreak = 1;
    }

    const updatedData = {
      streakDays: newStreak,
      lastActiveDate: today,
      isActiveToday: true
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    return {
      ...updatedData,
      isNewIncrement: true,
      message: newStreak === 1
        ? "🔥 Daily streak started! 1 Day"
        : `🔥 Daily streak extended to ${newStreak} Days!`
    };
  } catch (e) {
    console.error("Failed to record daily activity", e);
    return {
      streakDays: 1,
      lastActiveDate: getLocalDateString(),
      isActiveToday: true,
      isNewIncrement: false,
      message: "Daily activity recorded."
    };
  }
}

/**
 * Resets streak back to 0.
 */
export function resetStreak() {
  const data = {
    streakDays: 0,
    lastActiveDate: null,
    isActiveToday: false
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to reset streak", e);
  }
  return data;
}
