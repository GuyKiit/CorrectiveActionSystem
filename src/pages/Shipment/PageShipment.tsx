import React from 'react'
import Complaint from '.'
import { ListComplaintProvider } from './core/ListComlaintContext'

export default function PageComplaint() {
    return (
        <ListComplaintProvider>
            <Complaint />
        </ListComplaintProvider>
    )
}
