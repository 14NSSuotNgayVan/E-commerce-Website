import TextValidator from './TextValidator'
import { KEY } from '../../utils/Constant';

function TextArea({ ...props }) {
    const { onChange, ...newProps } = props
    const handleKeyDown = (e: any) => {
        if (e.key === KEY.ENTER) {
            e.preventDefault();
            const cursorPosition = e.target.selectionStart;
            const newText =
                cursorPosition === 0
                    ? `- ${props?.value?.substring(cursorPosition)}`
                    : `${props?.value?.substring(0, cursorPosition)}\n- ${props?.value?.substring(cursorPosition)}`;
            onChange(newText)
        }
    };

    const handleChange = (event: any) => {
        const newValue = event.target.value;
        if (newValue) {
            if (!props?.value?.startsWith('-')) {
                onChange('- ' + newValue)
            } else {
                onChange(newValue)
            }
        } else {
            onChange(newValue)
        }
    };

    return (
        <TextValidator
            {...newProps}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
        />
    )
}

export default TextArea