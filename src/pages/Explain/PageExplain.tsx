import React from 'react'
import Complaint from '.'
import { ListExplainProvider } from './core/ListExplainContext'

export default function PageExplain() {
    return (
        <ListExplainProvider>
            <Complaint />
        </ListExplainProvider>
    )
}
