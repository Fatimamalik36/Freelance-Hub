export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const timeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "y", secs: 31536000 },
    { label: "mo", secs: 2592000 },
    { label: "d", secs: 86400 },
    { label: "h", secs: 3600 },
    { label: "m", secs: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.secs);
    if (count >= 1) return `${count}${interval.label} ago`;
  }
  return "just now";
};

export const getInitials = (name = "") => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const truncate = (text = "", length = 120) => {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
};

export const CATEGORIES = [
  "Design",
  "Development",
  "Writing",
  "Marketing",
  "Video & Animation",
  "Mobile Development",
  "Music & Audio",
  "Business",
];

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return path;
};
