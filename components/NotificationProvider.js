import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();
export function useNotification() { return useContext(NotificationContext); }

export default function NotificationProvider({ children }) {
  const [notif, setNotif] = useState(null);

  function showNotification(message, type = "info") {
    setNotif({ message, type });
    setTimeout(() => setNotif(null), 2600);
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notif && (
        <div className={`toast-notif ${notif.type}`}>
          {notif.message}
          <style jsx>{`
            .toast-notif {
              position: fixed; z-index: 9999; bottom: 24px; right: 24px;
              background: #fff; border-left: 6px solid ${notif.type==="success" ? "#36d399" : notif.type==="error" ? "#f87171" : "#6366f1"};
              color: #222; padding: 18px 36px 18px 18px; border-radius: 20px; box-shadow: 0 4px 18px #0002; font-size: 1.15rem; min-width: 210px;
              animation: pop .3s;
            }
            @keyframes pop { from { transform: translateY(20px); opacity:0; } to { transform: none; opacity:1; } }
          `}</style>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

