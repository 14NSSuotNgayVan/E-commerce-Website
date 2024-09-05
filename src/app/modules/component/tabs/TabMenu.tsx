import React, { FC, useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { tab } from "../../models/tabModels";
import { TYPE_OF } from "../../constant";

type TabMenuProps = {
  danhsachTabs: tab[];
  keyDanhSachTabs?: string;
  isScrollTab?: boolean;
  id: string;
  scrollDistance?: number;
}

export const TabMenu: FC<TabMenuProps> = (props) => {
  const { danhsachTabs, isScrollTab, id, scrollDistance } = props;
  const [scrollTab, setScrollTab] = useState<boolean>(isScrollTab || false)
  const [activeTab, setActiveTab] = useState<string>("0");
  const [tabs, setTabs] = useState<tab[]>([]);
  const [isLeftScroll, setIsLeftScroll] = useState<boolean>(false);
  const [isRightScroll, setIsRightScroll] = useState<boolean>(false);
  const [scrollNumber, setScrollNumber] = useState<number>(scrollDistance || 300);
  useEffect(() => {
    setTabs(danhsachTabs);
  }, [danhsachTabs])

  const handleTabSelect: (eventKey: string | null) => void = (eventKey) => {
    if (eventKey) {
      setActiveTab(eventKey);
    }
  };

  const getTotalWidth = (selector: string) => {
    const arr = document.querySelectorAll(`${selector}`);
    let totalWidth = 0;
    arr.forEach(item => totalWidth += item.getBoundingClientRect().width);
    return totalWidth;
  }

  const setScrollButton = (scrollTab: Element, scrollLeft?: number) => {
    if (isScrollTab) {
      const tabWidth = scrollTab.getBoundingClientRect().width;
      const scrollWidth = getTotalWidth(`#customs-tab-${id} ul li`);

      if (scrollWidth > tabWidth) {
        setScrollTab(true)
        const left = scrollLeft ? scrollLeft : scrollTab.scrollLeft;
        left === 0 ? setIsLeftScroll(false) : setIsLeftScroll(true)
        left > scrollWidth - tabWidth - 1 ? setIsRightScroll(false) : setIsRightScroll(true)
      } else {
        setScrollTab(false);
      }
    }
  }

  const scrollLeft = () => {
    const scrollTab = document.querySelector(`#customs-tab-${id} ul`)
    if (scrollTab) {
      scrollTab.scrollLeft -= scrollNumber;
      setScrollButton(scrollTab);
    }
  }

  const scrollRight = () => {
    const scrollTab = document.querySelector(`#customs-tab-${id} ul`)
    if (scrollTab) {
      scrollTab.scrollLeft += scrollNumber;
      setScrollButton(scrollTab);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        const scrollTab = document.querySelector(`#customs-tab-${id} ul`)
        if (scrollTab) setScrollButton(scrollTab);
      }, 300)
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [])

  useEffect(() => {
    if (scrollDistance) setScrollNumber(scrollDistance);
  }, [scrollDistance])

  return (
    <div id={`customs-tab-${id}`} className={`${isScrollTab && 'tab-scroll'} tab-relative`}>
      <button className={`button-tab button-tab-left ${(!isLeftScroll || !scrollTab) && 'hidden'}`} onClick={scrollLeft} disabled={!isLeftScroll}>
        <i className="bi bi-chevron-left"></i>
      </button>
      <button className={`button-tab button-tab-right ${(!isRightScroll || !scrollTab) && 'hidden'}`} onClick={scrollRight} disabled={!isRightScroll}>
        <i className="bi bi-chevron-right"></i>
      </button>
      <Tabs
        className={`tabs nav nav-tabs customs-tabs ${scrollTab && 'px-8'}`}
        activeKey={activeTab}
        onSelect={handleTabSelect}
        transition={true}
      >
        {tabs.map((item, index) => {
          return (
            <Tab
              className="tab"
              eventKey={index}
              key={item.eventKey}
              title={
                <div className={`label-tab-${id} label`}>
                  <span className="tab-name-label"><span className="tab-name-text" data-text={item?.title} >{item?.title}</span> {(item.quantity || item.quantity === 0) && <div className="total-element-label">{item.quantity}</div>}</span>
                </div>
              }
            >
              {Number(activeTab) === index && (typeof item.component === TYPE_OF.FUNCTION ? (item as tab).component(activeTab) : (item as tab).component)}
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
}

export default TabMenu;
