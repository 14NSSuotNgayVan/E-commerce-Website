import { OptionSelect } from '../models/models'

type Props = {
  data: OptionSelect[]
}


export const CustomSelectComponent = (props: Props) => {
  const { data } = props;
  return (
    <select className="input form-select">
      {data.map(item => <option value={item.name}>{item.name}</option> )}
    </select>
  )
}