import { useState, FunctionComponent, ReactNode } from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

interface AccordionItemProps {
    title: string;
    eventKey: string;
    defaultActive?: boolean;
    children: ReactNode;
    // buttonCollapse : 
}

const CollapseMenu: FunctionComponent<AccordionItemProps> = ({ title, eventKey, defaultActive = false, children }) => {
    const [open, setOpen] = useState(defaultActive);

    const toggleCollapse = () => setOpen(!open);

    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id={`${eventKey}-heading`}>
                <Button
                    onClick={toggleCollapse}
                    aria-controls={`${eventKey}-collapse`}
                    aria-expanded={open}
                    className={`accordion-button text-dark bg-light ${open && 'collapsed'}`}
                    variant="light"
                >
                    {title}
                </Button>
            </h2>
            <Collapse in={open}>
                <div id={`${eventKey}-collapse`} className="accordion-collapse" aria-labelledby={`${eventKey}-heading`}>
                    <div className="accordion-body">{children}</div>
                </div>
            </Collapse>
        </div>
    );
};

export default CollapseMenu;
