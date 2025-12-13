const User = require('../models/User');

const updateStreak = async (req, res, next) => {
  try {
    // Only update streak for authenticated users
    if (req.user && req.user.userId) {
      const userId = req.user.userId;
      const user = await User.findById(userId);
      
      if (user) {
        const now = new Date();
        const lastActivity = user.lastActivityDate;
        
        // Log streak update information for debugging
        console.log(`Updating streak for user ${user.username} (${userId})`);
        console.log(`Last activity: ${lastActivity}`);
        console.log(`Current time: ${now}`);
        
        // If user has no previous activity, start their streak
        if (!lastActivity) {
          user.currentStreak = 1;
          user.lastActivityDate = now;
          await user.save();
          console.log(`New user, setting streak to 1`);
        } else {
          // Calculate the difference in days between now and last activity
          const lastActivityDate = new Date(lastActivity);
          
          // Check if it's been more than 24 hours since last activity
          const timeDiffHours = (now.getTime() - lastActivityDate.getTime()) / (1000 * 3600);
          
          console.log(`Hours since last activity: ${timeDiffHours}`);
          
          // If it's been more than 24 hours since last activity, reset streak
          if (timeDiffHours > 24) {
            user.currentStreak = 1;
            console.log(`More than 24 hours, resetting streak to 1`);
          } 
          // If it's a new day (but less than 24 hours), increment streak
          else if (timeDiffHours >= 0) {
            // Only increment if we haven't already updated today
            const lastActivityDay = new Date(lastActivityDate.getFullYear(), lastActivityDate.getMonth(), lastActivityDate.getDate());
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            // If it's a different day, increment streak
            if (today > lastActivityDay) {
              user.currentStreak += 1;
              console.log(`New day, incrementing streak to ${user.currentStreak}`);
            } else {
              console.log(`Same day, keeping streak at ${user.currentStreak}`);
            }
          }
          
          user.lastActivityDate = now;
          await user.save();
        }
      }
    }
  } catch (error) {
    console.error('Error updating streak:', error);
  }
  
  // Continue with the request
  next();
};

module.exports = updateStreak;