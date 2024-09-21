import { FC, useEffect, useState } from "react";

interface LoaderProps {
  isVisible: boolean;
  duration?: number; // Duration for how long the loader should be visible
}

const Loader: FC<LoaderProps> = ({ isVisible, duration = 1000 }) => {
  const [isLoaderVisible, setLoaderVisible] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setLoaderVisible(true);
      const timer = setTimeout(() => {
        setLoaderVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      setLoaderVisible(false);
    }
  }, [isVisible, duration]);

  return (
    <div
      id="loader"
      className={`fixed top-0 left-0 w-full h-full bg-white dark:bg-bodybg2 flex justify-center items-center z-[9999] transition-opacity duration-500 ${
        isLoaderVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <h1 className="text-xl">Loading...</h1>
    </div>
  );
};

export default Loader;
