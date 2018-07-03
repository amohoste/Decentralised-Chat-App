import dataprovider from '../../data/dataprovider.js';
import sorters from '../../helpers/sorters.js';

import Vue from 'vue'

const state = {
    messageIdCounter: 0,
    user: { },
    contacts: { },
    messages: { },
    profile: { },
    last_messages: {}
};

const mutations = {
    // USER
    'SET_USER' (state, user) {
        state.user = user;
    },
    'UPDATE_USER'(state, user) {
        const newuser = Object.assign(user, state.user);
        state.user = newuser;
    },
    'SET_PROFILE' (state, profile) {
    state.profile = profile;
    },
    'UPDATE_PROFILE' (state, profile) {
        state.profile = profile;
    },
    // CONTACTS
    'SET_CONTACTS' (state, contacts) {
        state.contacts = contacts;
    },
    UPDATE_CONTACT (state, [contact, id]) {
        Vue.delete(state.contacts, id);
        Vue.set(state.contacts, contact.id, contact);
    },
    'ADD_CONTACT' (state, [contact, id]) {
        console.log(contact);
        console.log(id);
        Vue.set(state.contacts, id, contact);
    },
    'REMOVE_CONTACT' (state, id) {
        if (state.contacts[id]) {
            for (const messageid of state.contacts[id].messages) {
                if (state.messages[messageid]) {
                    Vue.delete(state.messages, messageid);
                }
            }
            Vue.delete(state.contacts, id);
        }
    },
    // MESSAGES
    'CLEAR_MESSAGES' (state) {
        state.messages = {};
    },
    'CLEAR_LAST_MESSAGES' (state) {
        state.last_messages = {};
    },
    'SET_LAST_MESSAGES' (state, messages) {
        state.last_messages = messages;
    },
    'SET_CONTACT_MESSAGES' (state, [contactId, messages]) {
        let keys = Object.keys(messages);
        const newmessages = Object.assign(messages, state.messages);
        state.messages = newmessages;
        let contact = state.contacts[contactId];
        contact.messages = keys;
        Vue.set(state.contacts, contactId, contact);
    },
    'ADD_MESSAGE' (state, [contactId, message, messageId]) {
        Vue.set(state.messages, messageId, message);
        state.contacts[contactId].messages.push(messageId);
    },
    // RESET
    'CLEAR_STATE' (state) {
        state.profile = {};
        state.messages = {};
        state.user = {};
        state.contacts = {};
        state.last_messages = {};
        state.messageIdCounter = 0;
    }, 'RESET_COUNTER' (state) {
        state.messageIdCounter = 0;
    },
    'INCREMENT_COUNTER' (state) {
        state.messageIdCounter += 1;
    }
};

const actions = {
    // USER
    login({commit}, [username, datapod, maker]) {
        commit('SET_USER', {username: username, datapod: datapod, maker: maker});
    },
    logout({commit}) {
        commit('CLEAR_STATE');
        commit('RESET_COUNTER');
    },
    updateProfile({commit}, [http, datapod, maker, profile]) {
        commit('UPDATE_PROFILE', profile);
        dataprovider.updateOwnerInfo(http, datapod, maker, profile).then(() => {

        }).catch(err => {
            console.log(err);
        });
    },
    loadProfile({commit}, [datapod, maker]) {
        dataprovider.getOwnerInfo(datapod, maker).then((profile) => {
            commit('SET_PROFILE', profile);
        }).catch(err => {
            console.log(err);
        })
    },
    // CONTACTS
    updateContact({commit}, [http, id, datapod, maker, reference, nickname]) {

        dataprovider.updateContact(http, datapod, maker, decodeURIComponent(id), reference, nickname).then(() => {
            return dataprovider.getFullContact(datapod, maker, reference);
        }).then(contact => {
            console.log(contact);
            commit('UPDATE_CONTACT', [contact, id]);
        }).catch((err) => {
            console.error(err);
        });
    },
    removeContact({commit}, [http, contactId, datapod, maker]) {
        commit('REMOVE_CONTACT', contactId);
        dataprovider.deleteContact(http, datapod, maker, decodeURIComponent(contactId)).then(() => {

        }).catch((err) => {
            console.error(err);
        });
    },
    addContact({commit}, [http, datapod, maker, contact, nickname]) {
        dataprovider.addContact(http, datapod, maker, contact, nickname).then(() => {
            return dataprovider.getFullContact(datapod, maker, contact);
        }).then(contact => {
            commit('ADD_CONTACT', [contact, contact.id]);
        }).catch(err => {
            console.log(err);
        });
    },
    loadContacts({commit}, [datapod, maker]) {
        if (maker != null) {
            dataprovider.getContacts(maker, datapod).then(contacts => {
                let add = {};
                for (const contact of contacts) {
                    let tmp = {};
                    tmp.datapod = contact.datapod;
                    tmp.nickname = contact.nickname;
                    tmp.firstname = contact.firstname;
                    tmp.lastname = contact.lastname;
                    tmp.image = contact.image;
                    tmp.messages = contact.messages;
                    tmp.id = contact.id;
                    add[contact.id] = tmp;
                }
                commit('SET_CONTACTS', add);
            });
        }
    },
    // MESSAGES
    loadMessages({commit}, [datapod, maker]) {
        dataprovider.getAllMessages(datapod, maker).then(last_messages => {
            commit('CLEAR_LAST_MESSAGES');
            commit('SET_LAST_MESSAGES', last_messages);
        }).catch(err => {
            console.log(err);
        });
    },
    loadContactMessages({commit}, [datapod, maker, contactId]) {
        dataprovider.getChat(datapod, maker, decodeURIComponent(contactId)).then(messages => {
            let obj = {};
            messages.forEach(message => {
                obj[state.messageIdCounter] = message;
                commit('INCREMENT_COUNTER');
            });
            commit('SET_CONTACT_MESSAGES', [contactId, obj])
        }).catch(err => {
            console.log(err);
        });
    },
    sendMessage({commit}, [http, datapod, maker, contactId, message]) {
        commit('ADD_MESSAGE', [contactId, {content: message, creation_date: new Date(Date.now()), received: false}, state.messageIdCounter]);
        commit('INCREMENT_COUNTER');

        dataprovider.sendMessage(http, datapod, maker, decodeURIComponent(contactId), message).then(() => {

        }).catch(err => {
            console.log(err);
        })
    }
};

const getters = {
    user: state => {
        return state.user;
    },
    username: state => {
        return state.user.username;
    },
    last_messages: state => {
        return state.last_messages;
    },
    contacts: state => {
        return state.contacts;
    },
    contact: (state) => {
        return id => state.contacts[id];
    },
    messages: (state) => {
        return state.messages;
    },
    message: (state) => {
        return id => state.messages[id];
    },
    contactMessages: (state) => {
        return id => state.contacts[id].messages.map(id => state.messages[id]).sort(sorters.sort_by_properties(new Map([["creation_date", "desc"]])));
    },
    profile: state => {
        return state.profile;
    }
};

export default {state, mutations, actions, getters}
