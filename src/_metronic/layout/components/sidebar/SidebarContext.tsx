import { FC, SetStateAction, createContext, useContext, useState } from "react";
import { WithChildren } from "../../../helpers";
import { useLayout } from "../../core";

type SidebarContextProps = {
  isToggleOn?: boolean | undefined;
  setIsToggleOn?: React.Dispatch<SetStateAction<boolean | undefined>>;
}

const initState = {
  isToggleOn: false,
  setIsToggleOn: () => {}
}

export const SidebarContext = createContext<SidebarContextProps>(initState);
export const useSidebarContext = () => useContext(SidebarContext);

const SidebarProvider: FC<WithChildren> = ({ children }) => {
  const { config } = useLayout()
  const [isToggleOn, setIsToggleOn] = useState<boolean | undefined>((config as any )?.app?.sidebar?.default?.minimize?.desktop?.default || true);

  return (
    <SidebarContext.Provider value={{ isToggleOn, setIsToggleOn }}>
      {children}
    </SidebarContext.Provider>
  )
}

export default SidebarProvider;