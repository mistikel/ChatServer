import DAO from '../config/db/DAO';
import constants, { TABLES } from '../Constants';
import { v4 as uuid4 } from 'uuid';

// var users = {};

export const IO_EVENTS = {
    JOIN_SOCKET: 'join_socket',
    DISCONNECT_SOCKET: 'disconnect',
    FETCH_CHATS: 'fetch_chats',
    FETCH_MESSAGES: 'fetch_messages',
    NEW_MESSAGE: 'new_message',
    SEND_MESSAGE: 'send_message',
}

export default (io, client) => ({
    JoinSocket: async ({ user_id }) => {
        console.log(IO_EVENTS.JOIN_SOCKET, user_id, client.id);
        const q = `UPDATE ${TABLES.TABLE_USER} SET socket_id = ? WHERE id = ?`;
        await DAO.runQuery(q, { socket_id: client.id, id: user_id });
        // users[user_id] = client.id;
        io.emit(IO_EVENTS.JOIN_SOCKET, client.id);
    },

    FetchChats: async ({ user_id }, callback) => {
        // Fetch all chats
        const q = `SELECT * FROM ${TABLES.TABLE_CHAT} WHERE sender_id = ? OR receiver_id = ?`;
        let chats = await DAO.runQuery(q, { sender_id: user_id, receiver_id: user_id });
        if (chats.length <= 0) {
            callback([]);
            return;
        }

        chats = await Promise.all(chats.map(async (c, index) => {
            if (c.sender_id == user_id) {
                const q = `SELECT handle, avatar FROM ${TABLES.TABLE_USER} WHERE id = ?`;
                const users = await DAO.runQuery(q, { id: c.receiver_id });
                return Object.assign(c, users[0]);
            }

            const q = `SELECT handle, avatar FROM ${TABLES.TABLE_USER} WHERE id = ?`;
            const users = await DAO.runQuery(q, { id: c.sender_id });
            return Object.assign({ ...c, sender_id: c.receiver_id, receiver_id: c.sender_id }, users[0]);
        }))
        callback(chats);
    },

    FetchMessages: async ({ user_id, receiver_id }, callback) => {
        // Fetch chat to obtain chat_id
        const q = `SELECT * FROM ${TABLES.TABLE_CHAT} WHERE sender_id = ? AND receiver_id = ?`;
        let chats = await DAO.runQuery(q, { sender_id: user_id, receiver_id });

        if (chats?.length <= 0) {
            chats = await DAO.runQuery(q, { sender_id: receiver_id, receiver_id: user_id });
        }

        // Fetch messages
        const qMsgs = `SELECT id as _id, message as text, created_date as createdAt, sender_id, chat_id FROM ${TABLES.TABLE_MESSAGE} WHERE chat_id = ? ORDER BY created_date DESC`;
        let msgs = await DAO.runQuery(qMsgs, { chat_id: chats[0].chat_id });
        if (msgs.length <= 0) {
            callback([]);
            return;
        }

        msgs = msgs.map((m, index) => {
            if (m.sender_id == user_id) {
                return Object.assign(m, { user: { _id: 1 } });
            }

            return Object.assign(m, { user: { _id: 2 } });
        });
        callback(msgs);
    },

    SendMessage: async ({ sender_id, receiver_id, chat_id, message }) => {
        let socketIds  = [];
        let newChatId = '';
        // socketIds.push(users[sender_id]);
        // socketIds.push(users[receiver_id]);

        // Check if it's new chat or old
        const qChat = `SELECT * FROM ${TABLES.TABLE_CHAT} WHERE chat_id = ?`;
        const chat = await DAO.runQuery(qChat, { chat_id });

        // If it's new chat create new chat between sender and receiver
        if (Array.isArray(chat) && chat.length <= 0) {
            const qAddChat = `INSERT INTO ${TABLES.TABLE_CHAT} VALUES(?,?,?)`;
            newChatId = uuid4();
            await DAO.runQuery(qAddChat, { chat_id: newChatId, sender_id, receiver_id });
        }

        // Insert new message
        const q = `INSERT INTO ${TABLES.TABLE_MESSAGE} VALUES(?,?,?,?,?,?)`
        const insertData = {
            id: uuid4(),
            message,
            sender_id,
            receiver_id,
            chat_id: Array.isArray(chat) && chat.length <= 0 ? newChatId : chat_id,
            created_date: new Date(),
        }
        await DAO.runQuery(q, insertData);

        // Fetch new message
        const qMsg = `SELECT id as _id, message as text, created_date as createdAt, sender_id FROM ${TABLES.TABLE_MESSAGE} WHERE chat_id = ? AND id = ?`;
        let msgs = await DAO.runQuery(qMsg, { chat_id, id: insertData.id });

        // Fetch socket ids for sender and receiver both
        let qSocketId = `SELECT socket_id FROM ${TABLES.TABLE_USER} WHERE id = ?`;
        let users = await DAO.runQuery(qSocketId, { id: sender_id });
        socketIds.push(users[0].socket_id);
        users = await DAO.runQuery(qSocketId, { id: receiver_id });
        socketIds.push(users[0].socket_id);

        console.log(socketIds);

        socketIds.forEach((id) => {
            io.to(id).emit(
                IO_EVENTS.NEW_MESSAGE,
                msgs.map((m, index) => {
                    return { ...m, chat_id: Array.isArray(chat) && chat.length <= 0 ? newChatId : chat_id }
                })
            )
        })
    }
})