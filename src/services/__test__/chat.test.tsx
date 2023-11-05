import { StreamChat } from 'stream-chat';

import {
    getChannelDisplayImage,
    getChannelDisplayTitle,
    getChannelIsOnline,
    getChannelMembers
} from '@/services/chat';
import { ChannelGenerator, currentUser, members } from '@/utils/mockData';

const user_id =
    '1ba586c0b89202f7307b61f1229330978a843afc98589ffc6a62f209225d3528';
const apiKey = '9h8revtjvfgt';
const chatProfile_token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMWJhNTg2YzBiODkyMDJmNzMwN2I2MWYxMjI5MzMwOTc4YTg0M2FmYzk4NTg5ZmZjNmE2MmYyMDkyMjVkMzUyOCIsImV4cCI6MTY5OTAxMDM3OX0.c24e8bhf820zqRDXCKx7HCh77VlfOGG4Gxg3SbkqdPs';

export const client = StreamChat.getInstance(apiKey);

const channelGenerator = new ChannelGenerator(
    client,
    user_id,
    chatProfile_token
);

jest.unmock('stream-chat');
jest.unmock('@/services/chat');

beforeAll(async () => {
    await channelGenerator.initChannel();
    channelGenerator.setMembers(members);
});

afterAll(() => {
    channelGenerator._client?.disconnectUser();
});

describe('getChannelDisplayTitle tests', () => {
    it('returns the channel name when it exists', async () => {
        expect(channelGenerator.channel).not.toBeNull();
        channelGenerator.setName('Coach');
        channelGenerator.channel &&
            expect(
                getChannelDisplayTitle(channelGenerator.channel, currentUser)
            ).toEqual('Coach');
    });

    it('returns the other member name when there are two members and no channel name', () => {
        expect(channelGenerator.channel).not.toBeNull();
        channelGenerator.setName('');
        channelGenerator.channel &&
            expect(
                getChannelDisplayTitle(channelGenerator.channel, currentUser)
            ).toEqual('Coach Coach Test Coach 1');
    });

    it('returns undefined when no channel name and not two members', () => {
        let _members = { ...members };
        delete _members?.e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9;
        expect(channelGenerator.channel).not.toBeNull();
        channelGenerator.setMembers(_members);
        channelGenerator.setName('');
        channelGenerator.channel &&
            expect(
                getChannelDisplayTitle(channelGenerator.channel, currentUser)
            ).toEqual('');
    });
});

describe('getChannelDisplayImage tests', () => {
    it('returns the channel image when it exists', () => {
        channelGenerator.setImage('channel_image');
        channelGenerator.setMembers(members);
        channelGenerator.channel &&
            expect(
                getChannelDisplayImage(channelGenerator.channel, currentUser)
            ).toEqual('channel_image');
    });

    it('returns the other member image when there are two members and no channel image', () => {
        channelGenerator.setName('Coach');
        channelGenerator.setImage('');
        channelGenerator.channel &&
            expect(
                getChannelDisplayImage(channelGenerator.channel, currentUser)
            ).toEqual('coach image');
    });

    it('returns undefined when no channel image and not two members', () => {
        let _members = { ...members };
        delete _members.e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9;
        channelGenerator.setName('Coach');
        channelGenerator.setImage('');
        channelGenerator.setMembers(_members);
        channelGenerator.channel &&
            expect(
                getChannelDisplayImage(channelGenerator.channel, currentUser)
            ).toEqual('');
    });
});

describe('getChannelIsOnline tests', () => {
    it('returns true when the other member is online', () => {
        let _members = { ...members };
        _members
            ?.e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9
            ?.user &&
            (_members.e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9.user.online =
                true);
        channelGenerator.setMembers(_members);
        channelGenerator.channel &&
            expect(
                getChannelIsOnline(channelGenerator.channel, currentUser)
            ).toBeTruthy();
    });

    it('returns false when the other member is not online', () => {
        members
            ?.e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9
            ?.user?.online &&
            (members.e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9.user.online =
                false);
        channelGenerator.setMembers(members);
        channelGenerator.channel &&
            expect(
                getChannelIsOnline(channelGenerator.channel, currentUser)
            ).toBeFalsy();
    });

    it('returns false when there are not two members', () => {
        let _members = { ...members };
        delete _members.e0bc614e4fd035a488619799853b075143deea596c477b8dc077e309c0fe42e9;
        channelGenerator.setMembers(_members);
        channelGenerator.channel &&
            expect(
                getChannelIsOnline(channelGenerator.channel, currentUser)
            ).toBeFalsy();
    });
});

describe('getChannelMembers tests', () => {
    it('returns the number of channel members', () => {
        channelGenerator.setMembers(members);
        channelGenerator.channel &&
            expect(getChannelMembers(channelGenerator.channel)).toEqual(2);
    });

    it('returns 0 when there are no channel members', () => {
        channelGenerator.setMembers({});
        channelGenerator.channel &&
            expect(getChannelMembers(channelGenerator.channel)).toEqual(0);
    });
});
