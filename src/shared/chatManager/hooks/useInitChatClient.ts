import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';

import { useAppDispatch } from '@/hooks';
import { refreshProfileSession, UserSelectors } from '@/reducers/user';
import { UserChatProfile } from '@/types/user';

const useInitChatClient = () => {
    const dispatch = useAppDispatch();

    const { chatProfile } = UserSelectors();

    const [chatClient, setChatClient] = useState<StreamChat | null>(null);

    useEffect(() => {
        const setupClient = async (apiKey: string, userId: string) => {
            const user = { id: userId };

            try {
                const client = StreamChat.getInstance(apiKey);

                await client.connectUser(user, () => {
                    return dispatch(refreshProfileSession({}))
                        .unwrap()
                        .then(
                            (updatedChatProfile: UserChatProfile) =>
                                updatedChatProfile.token
                        );
                });

                return client;
            } catch (error: any) {
                console.log(
                    `An error occurred while connecting the user: ${error?.message}`
                );

                return undefined;
            }
        };

        let hookClient: StreamChat | undefined;

        // if a chat profile is loaded setup the chat client
        if (chatProfile?.apiKey && chatProfile?.userId) {
            setupClient(chatProfile.apiKey, chatProfile.userId).then(
                (client) => {
                    if (client) {
                        // keep chat client as state and also as a local
                        // variable so we can disconnect on unmount
                        setChatClient(client);
                        hookClient = client;
                    }
                }
            );
        }

        return () => {
            hookClient?.disconnectUser();
            setChatClient(null);
        };
    }, [chatProfile?.apiKey, chatProfile?.userId, dispatch]);

    return {
        chatClient
    };
};

export default useInitChatClient;
