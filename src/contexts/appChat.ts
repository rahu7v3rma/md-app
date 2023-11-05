import { createContext, useContext } from 'react';
import { StreamChat } from 'stream-chat';

const AppChatContext = createContext<{
    chatClient: StreamChat | null;
    setActiveChatChannel?: (channelId: string | null) => void;
}>({ chatClient: null, setActiveChatChannel: undefined });

const AppChatProvider = AppChatContext.Provider;

const useAppChat = () => {
    const { chatClient, setActiveChatChannel } = useContext(AppChatContext);
    return { chatClient, setActiveChatChannel };
};

export { AppChatProvider, useAppChat };
