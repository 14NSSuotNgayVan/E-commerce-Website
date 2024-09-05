import React from 'react'
import {Breadcrumb} from 'react-bootstrap'
import '../../../../app/modules/component/style.scss'
interface BreadcrumbItem {
  text: string
  url: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

const BreadcrumbsWidget: React.FC<BreadcrumbProps> = ({items}) => {
  return (
    <Breadcrumb className='bg-transparent fs-5'>
      {items.map((item, index) => (
        <Breadcrumb.Item key={index} href={item.url} active={index === items.length - 1}>
          {item.text}
          {index < items.length - 1 && <i className='bi bi-chevron-right '></i>}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )
}

export default BreadcrumbsWidget
