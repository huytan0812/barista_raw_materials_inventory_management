import React from 'react'
import { useParams } from 'react-router-dom'

const VerifiedGrn = () => {
  const params = useParams();
  console.log(params.grnId);
  return (
    <div>VerifiedGrn</div>
  )
}

export default VerifiedGrn