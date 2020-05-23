import React, { FC } from 'react'
import { Button, ListGroupItem } from 'react-bootstrap'

import Listing from '../models/interfaces/Listing'

export interface ClassListingProps {
    onTrack: (crn: string) => void
    listing: Listing
}

const ClassListing: FC<ClassListingProps> = ({ listing, onTrack }) => {
    if (listing === null) {
        return <></>
    }

    return (
        <ListGroupItem className="list-group-item list-group-item-action flex-column align-items-start">
            <div className="d-flex w-100 justify-content-between">
                <h4 className="classListing-title">
                    {listing.courseTitle} - {listing.courseReferenceNumber}
                </h4>
            </div>

            <h4 className="classListing-title">
                {listing.faculty !== null &&
                    listing.faculty.length > 0 &&
                    listing.faculty[0].displayName}{' '}
                (
                {listing.creditHours !== null &&
                    listing.creditHours.length > 0 &&
                    `${listing.creditHours} credits)`}
            </h4>
            <p className="mb-2">{listing.scheduleTypeDescription}</p>
            <div className="d-flex w-100 justify-content-between">
                <Button
                    block
                    variant="outline-primary"
                    onClick={() => onTrack(listing.courseReferenceNumber)}
                >
                    <small>Track this class</small>
                </Button>
            </div>
        </ListGroupItem>
    )
}

export default ClassListing
