import React from 'react'
import {useParams} from 'react-router-dom'

const AddSalesOrderItems = (props) => {
    const params = useParams();
    console.log("Sales order id:", params.salesOrderId);
    return (
        <div>AddSalesOrderItems</div>
    )
}

export default AddSalesOrderItems