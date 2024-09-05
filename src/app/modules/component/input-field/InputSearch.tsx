import { ChangeEvent, FC } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import { KEY } from '../../utils/Constant';

type Props = {
    value?: string
    name?: string
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void
    handleSearch: () => void;
    placeholder?: string;
    type?: string;
    isEnter?: boolean;
    className?: string;
}

const InputSearch: FC<Props> = ({ ...props }) => {
    const { value, name, handleChange, handleSearch, type, className, placeholder, isEnter } = props

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (isEnter && KEY.ENTER === event.key) {
            event.preventDefault();
            handleSearch();
        }
    };

    return (
        <Form.Group className='flex relative'>
            <FormControl
                className={`customs-input ${className ? className : ""}`}
                value={value}
                name={name}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder ? placeholder : ""}
                type={type ? type : "text"}
            />
            <div className="searchTextField" onClick={() => handleSearch()}>
                <i className="bi bi-search"></i>
            </div>
        </Form.Group>
    );
};

export default InputSearch