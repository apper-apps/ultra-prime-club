import Sidebar from "@/components/organisms/Sidebar";
import { useEffect } from "react";

const Layout = ({ children }) => {
  useEffect(() => {
    // Ensure viewport has proper dimensions for external scripts
    const ensureViewportDimensions = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, minimum-scale=1.0';
        document.head.appendChild(meta);
      }
    };

    // Add defensive measures for external script canvas operations
    const preventCanvasErrors = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1 && node.tagName === 'CANVAS') {
                // Ensure canvas has minimum dimensions
                if (node.width === 0) node.width = 1;
                if (node.height === 0) node.height = 1;
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return () => observer.disconnect();
    };

    ensureViewportDimensions();
    const cleanup = preventCanvasErrors();

    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 viewport-container">
      <Sidebar />
      {/* Main Content */}
      <div className="lg:ml-64 main-content">
        <main className="p-6 lg:p-8 main-viewport">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;