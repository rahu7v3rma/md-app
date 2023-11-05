import React, { FunctionComponent, useState } from 'react';

import { AppChatProvider } from '@/contexts/appChat';

import { useChatNotifications, useInitChatClient } from './hooks';

type Props = {
    children?: React.ReactNode;
};

const ChatManager: FunctionComponent<Props> = ({ children }: Props) => {
    const { chatClient } = useInitChatClient();

    const [activeChatChannel, setActiveChatChannel] = useState<string | null>(
        null
    );

    useChatNotifications(chatClient, activeChatChannel);

    return (
        <AppChatProvider value={{ chatClient, setActiveChatChannel }}>
            {children}
        </AppChatProvider>
    );
};

export default ChatManager;
