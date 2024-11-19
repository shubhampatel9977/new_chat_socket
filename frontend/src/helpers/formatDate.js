function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    
    if (date >= today) {
      // If the date is today, return time in AM/PM format
      return date.toLocaleTimeString('en-US', timeOptions);
    } else if (date >= yesterday && date < today) {
      // If the date is yesterday, return "Yesterday"
      return 'Yesterday';
    } else {
      // If the date is older, return date in DD/MM/YY format
      return date.toLocaleDateString('en-GB');
    }
}

module.exports = formatDate;