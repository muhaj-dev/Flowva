import React from 'react';
import { X } from 'lucide-react';
import { FaHome, FaCompass, FaBook, FaLayerGroup, FaCreditCard, FaGift, FaCog } from 'react-icons/fa';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  currentUser?: {
    email: string;
  };
}

const menuItems = [
  { icon: FaHome, label: 'Home', path: '#' },
  { icon: FaCompass, label: 'Discover', path: '#' },
  { icon: FaBook, label: 'Library', path: '#' },
  { icon: FaLayerGroup, label: 'Tech Stack', path: '#' },
  { icon: FaCreditCard, label: 'Subscriptions', path: '#' },
  { icon: FaGift, label: 'Rewards Hub', path: '#', active: true },
  { icon: FaCog, label: 'Settings', path: '#' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose, currentUser }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 bottom-0">
        {/* Logo */}
        <div className="p-2 px-7 flex justify-start">
          <img
            src="https://app.flowvahub.com/assets/flowva_logo-xVpZI3-U.png"
            alt="Flowva Logo"
            // width={25}
            // height={20}
            className="w-[145px] h-[60px] mt-2 object-contain"
          />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 space-y-2 mt-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-[rgb(144,19,254,0.2)] text-[#9013FE] font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* User Profile */}
        {currentUser && (
          <div className="mt-auto py-3 relative flex justify-center">
            <div className="absolute top-0 left-4 right-4 border-t border-[#64748B]"></div>
            <div className="w-full flex items-center justify-between px-4">
              <button className="flex items-center border-none">
                <div className="w-10 h-10 rounded-full bg-[#9013FE] flex items-center justify-center text-white font-bold text-lg mr-3">
                  {currentUser.email.charAt(0).toUpperCase()}
                </div>
                <div className="text-start">
                  <span className="text-[0.9rem] font-semibold">
                    {currentUser.email.split('@')[0]}
                  </span>
                  <p className="text-[0.8rem] text-[#718096] truncate overflow-x-hidden max-w-[153px]">
                    {currentUser.email}
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isMobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onMobileClose}
        />

        {/* Sidebar Content */}
        <aside
          className={`absolute left-0 top-0 bottom-0 w-64 bg-white h-full transform transition-transform duration-300 ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <img
              src="https://app.flowvahub.com/assets/flowva_logo-xVpZI3-U.png"
              alt="Flowva Logo"
              className="w-[145px] h-[60px] object-contain"
            />
            <button onClick={onMobileClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className=" flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    item.active
                      ? 'bg-[rgb(144,19,254,0.2)] text-[#9013FE] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={onMobileClose}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* User Profile */}
          {currentUser && (
            <div className="mt-auto  p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#9013FE] flex items-center justify-center text-white font-bold text-lg">
                  {currentUser.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {currentUser.email.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
};
