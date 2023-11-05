import React, { FunctionComponent } from 'react';
import {
    isMessageWithStylesReadByAndDateSeparator,
    useMessageContext
} from 'stream-chat-react-native';

import Check from '@/assets/svg/check';
import DoubleCheck from '@/assets/svg/doubleCheck';

type Props = Record<string, never>;

const MessageStatus: FunctionComponent<Props> = ({}: Props) => {
    const { isMyMessage, message } = useMessageContext();

    if (!isMyMessage || message.type === 'error') {
        return null;
    }

    if (
        isMessageWithStylesReadByAndDateSeparator(message) &&
        (typeof message.readBy === 'number' || message.readBy === true)
    ) {
        return <DoubleCheck />;
    } else if (message.status === 'received') {
        return <Check />;
    } else {
        return null;
    }
};

export default MessageStatus;
