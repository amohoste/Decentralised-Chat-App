import Home from './components/Home.vue';

// Contacts
import Contacts from './components/contacts/Contacts.vue';
import ContactList from './components/contacts/contactlist/ContactList.vue';
import ContactInfo from './components/contacts/ContactInfo.vue';
import EditContact from './components/contacts/EditContact.vue';
import AddContact from './components/contacts/AddContact.vue';

// Messages
import Messages from './components/messages/Messages.vue';
import MessageList from './components/messages/messagelist/MessageList.vue';
import Chat from './components/messages/chat/Chat.vue';
import NewMessage from './components/messages/NewMessage';

// Users
import Users from './components/users/Users.vue';
import Login from './components/users/Login.vue';
import Profile from './components/users/Profile.vue';

export const routes = [
    { path: '/', component: Home },
    { path: '/messages', component: Messages, children: [
            { path: '', component: MessageList },
            { path: 'new', component: NewMessage },
            { path: ':id', component: Chat }

        ] },
    { path: '/contacts', component: Contacts, children: [
            { path: '', component: ContactList },
            { path: 'add', component: AddContact },
            { path: ':id', component: ContactInfo },
            { path: ':id/edit', component: EditContact }
        ]},
    { path: '/users', component: Users , children : [
            { path: 'login', component:  Login },
            { path: 'profile', component: Profile }
        ] }
];
