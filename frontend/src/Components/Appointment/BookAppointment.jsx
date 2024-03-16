import React from 'react'
import { InlineWidget } from 'react-calendly'
import { useParams } from 'react-router-dom'

function BookAppointment({user}) {
    const {id} = useParams();
    return (
        <div>
            <InlineWidget styles={{
                height: '90vh', width:'1200px'
            }} 
            url={`https://calendly.com/${id}`} />
        </div>
    )
}

export default BookAppointment
