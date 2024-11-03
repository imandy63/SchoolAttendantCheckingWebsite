import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width = "100%",
  height = "1em",
  count = 1,
}) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`animate-pulse h-4 bg-gray-300 rounded ${className}`}
          style={{ width: width, height: height }}
        />
      ))}
    </div>
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className,
}) => {
  return (
    <div className={className}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} height="1em" className="mb-2" />
      ))}
    </div>
  );
};

export const SkeletonButton: React.FC<{ className?: string }> = ({
  className,
}) => {
  return <Skeleton height="2em" className={`w-1/2 ${className}`} />;
};

export const SkeletonInput: React.FC<{ className?: string }> = ({
  className,
}) => {
  return <Skeleton height="2.5em" className={`w-full ${className}`} />;
};
