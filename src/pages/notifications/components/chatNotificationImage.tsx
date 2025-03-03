import React, { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { Channel } from 'stream-chat';

import { useAppChat } from '@/contexts/appChat';
import { getChannelDisplayImage } from '@/services/chat';
import { ChatAvatar } from '@/shared';

type Props = {
    channelId: string;
};

const ChatNotificationImage: FunctionComponent<Props> = ({
    channelId
}: Props) => {
    const { chatClient } = useAppChat();

    const [chatChannel, setChatChannel] = useState<Channel | null>(null);

    useEffect(() => {
        if (chatClient !== null && chatClient.userID) {
            if (chatClient.activeChannels[channelId]) {
                setChatChannel(chatClient.activeChannels[channelId]);
            } else {
                chatClient
                    .queryChannels({
                        cid: { $eq: channelId },
                        members: { $in: [chatClient.userID] }
                    })
                    .then((channels) => {
                        if (channels.length > 0) {
                            setChatChannel(channels[0]);
                        }
                    });
            }
        } else {
            setChatChannel(null);
        }
    }, [chatClient, channelId]);

    const displayImage = useMemo(() => {
        if (chatClient === null || chatChannel === null) {
            return undefined;
        } else {
            return getChannelDisplayImage(chatChannel, chatClient.user);
        }
    }, [chatClient, chatChannel]);

    return (
        <ChatAvatar path={displayImage} width={32} height={32} online={false} />
    );
};

export default ChatNotificationImage;
