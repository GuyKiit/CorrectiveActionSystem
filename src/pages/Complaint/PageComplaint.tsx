import React from 'react'
import Complaint from '.'
import { ListComplaintProvider } from './core/ListComplaintContext'

export default function PageComplaint() {
    return (
        <ListComplaintProvider>
            <Complaint />
        </ListComplaintProvider>
    )
}
