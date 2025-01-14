import React from 'react'
import {useParams} from "react-router"

function CompaniesEdit() {
    const {id} = useParams();
    console.log(id);
  return (
    <div>CompaniesEdit</div>
  )
}

export default CompaniesEdit