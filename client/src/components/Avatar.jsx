import { getInitials } from "../utils/helpers";

const sizeMap = {
  xs: "w-8 h-8 text-xs",
  sm: "w-10 h-10 text-sm",
  md: "w-14 h-14 text-base",
  lg: "w-20 h-20 text-xl",
  xl: "w-32 h-32 text-3xl",
};

const Avatar = ({ src, name, size = "md", online = false, className = "" }) => {
  return (
    <div className={`relative shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size]} rounded-full object-cover border-2 border-white shadow-soft`}
        />
      ) : (
        <div
          className={`${sizeMap[size]} rounded-full bg-mocha-gradient text-cream flex items-center justify-center font-heading font-semibold border-2 border-white shadow-soft`}
        >
          {getInitials(name)}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
      )}
    </div>
  );
};

export default Avatar;
