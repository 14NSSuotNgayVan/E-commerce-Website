import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import "./style.scss"

type VariationPlacement = "top-start" | "top-end" | "bottom-start" | "bottom-end" | "right-start" | "right-end" | "left-start" | "left-end";
type BasePlacement = "top" | "bottom" | "right" | "left";
type AutoPlacement = "auto" | "auto-start" | "auto-end";
type Placement = AutoPlacement | BasePlacement | VariationPlacement;

interface IProps {
    children: any;
    title: string;
    className?: string;
    placement?: Placement;
    delay?: number;
}

function CustomTooltip(props: IProps) {
    const { children, title, className, delay, placement } = props
    return (
        <OverlayTrigger
            placement={placement || "auto"}
            delay={delay || 50}
            overlay={
                <Tooltip
                    id="tooltip"
                    className={`
                        custom-tooltip
                        ${className ? className : ""}
                    `}
                >
                    {title}
                </Tooltip>
            }
        >
            {children}
        </OverlayTrigger>
    )
}

export default CustomTooltip