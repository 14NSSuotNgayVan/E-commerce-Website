
interface Iprops {
  listData: any[];
  fieldTitle: string;
  activeIndex: number;
  handleChangeActiveItem: (index: number, dataActive: any) => void;
}

function ListMenuVertical(props: Iprops) {
  const { listData, fieldTitle, activeIndex, handleChangeActiveItem } = props;
  return (
    <ul className="tab-vertical">
      {listData?.map((item, index) => (
        <li
          className="nav-item"
          key={index}
          onClick={() => handleChangeActiveItem(index, item)}
        >
          <a className={`nav-link ${index === activeIndex ? "active" : ""}`}>{item[fieldTitle]}</a>
        </li>
      ))}
    </ul>
  );
}

export default ListMenuVertical;
