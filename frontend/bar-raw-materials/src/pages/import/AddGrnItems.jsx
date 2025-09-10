import React from 'react'
import { useParams } from 'react-router-dom'

const AddGrnItems = () => {
    const params = useParams();
    console.log("Grn id:", params.grnId);
    return (
        <div>AddGrnItems</div>
    )
}

export default AddGrnItems