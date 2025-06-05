import { useState } from "react";

export const useTabs = (initialTab = "everything") => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const changeTab = (tab) => setActiveTab(tab);

  return { activeTab, changeTab };
};
