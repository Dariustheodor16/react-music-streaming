import { useState } from "react";

export const useDropdownMenu = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleMenu = (e) => {
    e?.stopPropagation?.();
    setShowMenu(!showMenu);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const handleMenuItemClick = (action, callback, e) => {
    e?.stopPropagation?.();
    setShowMenu(false);
    if (callback) callback(action);
  };

  return {
    showMenu,
    handleToggleMenu,
    handleCloseMenu,
    handleMenuItemClick,
  };
};
