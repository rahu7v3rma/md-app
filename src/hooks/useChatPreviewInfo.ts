import { useEffect, useState } from 'react';
import type { Channel } from 'stream-chat';
import { useChatContext } from 'stream-chat-react-native';

import {
    getChannelDisplayImage,
    getChannelDisplayTitle,
    getChannelIsOnline,
    getChannelMembers
} from '@/services/chat';

type Props = {
    channel: Channel;
};

const useChannelPreviewInfo = ({ channel }: Props) => {
    const { client } = useChatContext();

    const [displayTitle, setDisplayTitle] = useState<string | undefined>(
        getChannelDisplayTitle(channel, client.user)
    );

    const [displayImage, setDisplayImage] = useState<string | undefined>(
        getChannelDisplayImage(channel, client.user)
    );

    const [isOnline, setIsOnline] = useState<boolean>(
        getChannelIsOnline(channel, client.user)
    );

    const [members, setMembers] = useState<number>(getChannelMembers(channel));

    useEffect(() => {
        const handleEvent = () => {
            setDisplayTitle((currentDisplayTitle) => {
                const newDisplayTitle = getChannelDisplayTitle(
                    channel,
                    client.user
                );
                return currentDisplayTitle !== newDisplayTitle
                    ? newDisplayTitle
                    : currentDisplayTitle;
            });
            setDisplayImage((currentDisplayImage) => {
                const newDisplayImage = getChannelDisplayImage(
                    channel,
                    client.user
                );
                return currentDisplayImage !== newDisplayImage
                    ? newDisplayImage
                    : currentDisplayImage;
            });
            setIsOnline(getChannelIsOnline(channel, client.user));
            setMembers(getChannelMembers(channel));
        };

        client.on('channel.updated', handleEvent);
        channel.watch();

        return () => {
            channel.stopWatching();
            client.off('channel.updated', handleEvent);
        };
    }, [client, channel]);

    return {
        displayImage: displayImage,
        displayTitle: displayTitle,
        isOnline: isOnline,
        totalMembers: members
    };
};

export default useChannelPreviewInfo;
