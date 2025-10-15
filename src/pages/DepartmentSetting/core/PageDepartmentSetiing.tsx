import React from 'react'
import DepartmentSetting from '..'
import { ListDepartmentSettingProvider } from './ListDepartmentSettingContext'

export default function PageDepartmentSetting() {
    return (
        <ListDepartmentSettingProvider>
            <DepartmentSetting />
        </ListDepartmentSettingProvider>
    )
}
