"use client";

import * as React from "react";
import { cx } from "../../tools/cx";
import { symToStr } from "tsafe/symToStr";
import "../../styles/components/sds-card.css";
import { SDSEvent } from "./SDSEvent";

export type SDSMeetingCardProps = {
    className?: string;
    style?: React.CSSProperties;
    href?: string;
    title?: React.ReactNode;
    /** Start date (Date or ISO string). */
    date: string | Date;
    time?: string;
    location?: string;
    /** Number of attendees / registration info. */
    attendees?: string;
};

/**
 * A meeting / committee card, built on top of the event block with an optional
 * attendees line — used for council meetings, public consultations, etc.
 */
export const SDSMeetingCard = (props: SDSMeetingCardProps) => {
    const { className, style, attendees, ...eventProps } = props;

    return (
        <div className={cx("sds-meeting-card", className)} style={style}>
            <SDSEvent {...eventProps} />
            {attendees !== undefined && <p className="sds-meeting-card__attendees">{attendees}</p>}
        </div>
    );
};

SDSMeetingCard.displayName = symToStr({ SDSMeetingCard });

export default SDSMeetingCard;