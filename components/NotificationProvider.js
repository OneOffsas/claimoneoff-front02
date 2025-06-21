import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export default function NotificationProvider({ children }) {
  const [notif, setNotif] = useState(null);

  function showNotification(message, type = "info", duration = 4000) {
    setNotif({ message, type });
    setTimeout(() => setNotif(null), duration);
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notif && (
        <div className={`notif-toast notif-${notif.type}`}>
          {notif.message}
        </div>
      )}
      <style jsx global>{`
        .notif-toast {
          position: fixed;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          min-width: 220px;
          max-width: 85vw;
          background: #fff;
          color: #222;
          border-radius: 12px;
          box-shadow: 0 6px 28px #2b43c714;
          padding: 18px 28px;
          font-size: 1.08rem;
          font-weight: 700;
          z-index: 9999;
          border-left: 8px solid #2b43c7;
          animation: notif-pop 0.4s cubic-bezier(0.18,1.6,0.19,0.94);
        }
        .notif-success { border-left-color: #20c997; color: #1b8f62; }
        .notif-error   { border-left-color: #fd5b5b; color: #b91c1c; }
        .notif-info    { border-left-color: #2b43c7; }
        @keyframes notif-pop {
          0% { opacity: 0; transform: translateX(-50%) translateY(50px) scale(0.9);}
          90% { opacity: 1; transform: translateX(-50%) translateY(-6px) scale(1.04);}
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1);}
        }
      `}</style>
    </NotificationContext.Provider>
  );
}
