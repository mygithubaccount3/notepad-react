import React from 'react';
import FlashMessage from 'react-flash-message'

const Message = ({message, color}) => (
    <FlashMessage duration={10000}>
        <p style={{color: color}}>{message}</p>
    </FlashMessage>
)

export default Message;
