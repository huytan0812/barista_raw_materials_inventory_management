import React, {useState, useContext, createContext} from 'react'

const MessageContext = createContext();

export const MessageProvider = ({children}) => {
    const [message, setMessage] = useState("");
    return (
        <MessageContext.Provider
            value={{
                'message': message,
                'setMessage': setMessage
            }}
        >
            {children}
        </MessageContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMessageContext = () => {
    return useContext(MessageContext);
}

