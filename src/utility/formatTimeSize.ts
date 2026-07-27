export const formatDate = (dateStr: string) => {
  if (!dateStr) return "Chưa rõ thời gian";
  try {
    let date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
    }

    // Force Vietnam Time (GMT+7) regardless of browser locale
    const vietnamTime = date.getTime() + 7 * 60 * 60 * 1000;
    const vietnamDate = new Date(vietnamTime);

    const day = vietnamDate.getUTCDate().toString().padStart(2, "0");
    const month = (vietnamDate.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = vietnamDate.getUTCFullYear();
    const hours = vietnamDate.getUTCHours().toString().padStart(2, "0");
    const minutes = vietnamDate.getUTCMinutes().toString().padStart(2, "0");

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

// Helper to format seconds into MM:SS string
export const formatTime = (seconds: number) => {
  if (!seconds) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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

export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
