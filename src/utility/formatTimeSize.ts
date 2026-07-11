// Helper to format ISO Date string into DD/MM/YYYY HH:mm
export const formatDate = (dateStr: string) => {
  if (!dateStr) return "Chưa rõ thời gian";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (e) {
    return dateStr;
  }
};

// Helper to format duration in seconds into MM:SS string
export const formatDuration = (secs: number) => {
  if (!secs) return "00:00";
  const mins = Math.floor(secs / 60);
  const remainingSecs = Math.round(secs % 60);
  return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
};

// Helper to format file size in bytes to human-readable string (KB/MB)
export const formatFileSize = (bytes: number) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};
