import React from 'react'
import { ADDRESS } from '../../utils/constants'

const ContactInfo = () => {
  return (
    <div className="h-full">
      {/* Map - Full height to match form */}
      <div className="relative overflow-hidden gold-border h-full min-h-[400px]">
        <iframe
          title="The Golden Frame Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59865.65392565861!2d72.9269375577027!3d20.316678026817282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0cb0e5b8b30ef%3A0x3dd1fa97c2303cd0!2sThe%20Golden%20Frame%20Gaming%20Lounge%20and%20Cafe!5e0!3m2!1sen!2sin!4v1794638687188!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) saturate(0.6)' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-sm px-3 py-2 border border-gold/20">
          <p className="text-gold text-xs font-body tracking-wider">THE GOLDEN FRAME · Silvassa</p>
          <p className="text-gray/60 text-[10px] font-body mt-0.5">{ADDRESS}</p>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo
