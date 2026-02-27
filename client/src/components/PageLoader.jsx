import React from "react";

const PageLoader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/30 dark:bg-black/30 backdrop-blur-2xl transition-colors duration-300">
            {/* Background Accent Gradients */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.1),transparent_50%)]"></div>
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.1),transparent_50%)]"></div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-48 h-48 md:w-72 md:h-72 overflow-hidden rounded-full">
                    <img
                        src="https://res.cloudinary.com/mann2729/image/upload/v1772186319/Loading_cnrqgu.gif"
                        alt="Loading..."
                        className="w-full h-full object-contain scale-125"
                    />
                </div>
                <p className="mt-6 dark:text-white text-black font-bold tracking-[0.2em] uppercase text-xs ">
                    OverClocking your experience...
                </p>
            </div>
        </div>
    );
};

export default PageLoader;
