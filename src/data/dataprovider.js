import parser from '../helpers/parsers';
import url_helper from '../helpers/url_helpers';
import {_} from 'vue-underscore';
import sorters from '../helpers/sorters';
import random from '../helpers/randoms.js';

/*****************************
 *         Contacts          *
 *****************************/
function getContacts(me, graph) {
    const ldf = window.ldf;
    const fragmentsClient = new ldf.FragmentsClient(graph);

    const query = `
    PREFIX me: <${me}>
    PREFIX schema: <http://schema.org/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>


    SELECT DISTINCT ?person ?nickname ?givenName ?familyName ?image WHERE
    {
        GRAPH <${graph}> {
            me: foaf:knows ?person .
            ?person foaf:nick ?nickname.
        }
        ?person foaf:givenName ?givenName;
                foaf:familyName ?familyName .
        OPTIONAL{ ?person foaf:img ?image . }
        FILTER (lang(?givenName) = '')
        FILTER (lang(?familyName) = '')
    } ORDER BY ?givenName ?familyName
    `;

    return executeQuery(new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient })).then(results => {
        return results.map(res => {
            return {
                'firstname': parser.parseString(res['?givenName']),
                'lastname': parser.parseString(res['?familyName']),
                'nickname': parser.parseString(res['?nickname']),
                'id': encodeURIComponent(res['?person']),
                'image': res['?image'],
                'datapod': res['?person'],
                'messages': []
            }
        });
    })
}

function deleteContact(http, graph, me, contact) {
    const query = `
    PREFIX me: <${me}>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    DELETE FROM <${graph}> { 
        me: foaf:knows ?person .
        ?person a foaf:Person;
	    foaf:nick ?nick .
    } WHERE {
        ?person a foaf:Person;
	    foaf:nick ?nick .
        FILTER (?person=<${contact}>)
    }   
    `;

    let url = url_helper.build_url({
        base: 'http://groep24.webdev.ilabt.imec.be:2004/sparql',
        endpoint: 'http://groep24.webdev.ilabt.imec.be:8890/sparql',
        graph: graph,
        query: query
    });

    return http.post(url);
}

function verifyDatapod(datapod) {
    return getOwner(datapod).then(() => {
        return true;
    });
}

function verifyContact(datapod, contact) {
    const ldf = window.ldf;
    const fragmentsClient = new ldf.FragmentsClient(datapod);

    var query = `
    PREFIX contact: <${contact}>
    PREFIX schema: <http://schema.org/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT DISTINCT ?givenName WHERE
    {
        contact: foaf:givenName ?givenName .
    }
    `;

    return executeQuery(new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient })).then(result => {
        if (result.length > 0 && result[0]['?givenName'] != null) {
            return;
        } else {
            throw(new Error("Url doesn't point to a valid datapod"));
        }
    });
}

function hasContact(datapod, me, contactlink) {
    const ldf = window.ldf;
    const fragmentsClient = new ldf.FragmentsClient(datapod);

    const query = `
    PREFIX me: <${me}>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    ASK WHERE {
        me: foaf:knows <${contactlink}>
      }
    `;
    return executeQuery(new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient })).then(result => {
        return result[0];
    });
}

function addContact(http, graph, me, contact, nickname) {
    const query = `
    PREFIX me: <${me}>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    INSERT { 
        <${contact}> a foaf:Person;
	                 foaf:nick "${nickname}".
        me: foaf:knows <${contact}>.
    }
    `;

    let url = url_helper.build_url({
        base: 'http://groep24.webdev.ilabt.imec.be:2004/sparql',
        endpoint: 'http://groep24.webdev.ilabt.imec.be:8890/sparql',
        graph: graph,
        query: query
    });

    return http.post(url);
}

function getFullContact(datapod, me, contact) {
    const ldf = window.ldf;

    const fragmentsClient = new ldf.FragmentsClient(datapod);

    const query = `
    PREFIX me: <${me}>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT ?person ?nickname ?givenName ?familyName ?image WHERE {
        FILTER (lang(?givenName) = '')
        FILTER (lang(?familyName) = '')
        ?person a foaf:Person;
                foaf:nick ?nickname;
                foaf:givenName ?givenName;
                foaf:familyName ?familyName .
        OPTIONAL{ ?person foaf:img ?image . }
        FILTER (?person=<${contact}>)
    } LIMIT 1
    `;

    return executeQuery(new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient })).then(results => {
        return results.map(res => {
            return {
                'firstname': parser.parseString(res['?givenName']),
                'lastname': parser.parseString(res['?familyName']),
                'nickname': parser.parseString(res['?nickname']),
                'id': encodeURIComponent(res['?person']),
                'image': res['?image'],
                'datapod': res['?person'],
                'messages': []
            }
        })[0];
    })
}

function updateContact (http, graph, me, old, contact, nickname) {

    const query = `
    PREFIX me: <${me}>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    MODIFY <${graph}>
    DELETE { 
        me: foaf:knows <${old}> .
        <${old}> foaf:nick ?nick;
                 a foaf:Person .
    } 
    INSERT {
        me: foaf:knows <${contact}> .
        <${contact}> foaf:nick "${nickname}";
                     a foaf:Person .
    } WHERE {
        <${old}> foaf:nick ?nick .
    }   
    `;

    let url = url_helper.build_url({
        base: 'http://groep24.webdev.ilabt.imec.be:2004/sparql',
        endpoint: 'http://groep24.webdev.ilabt.imec.be:8890/sparql',
        graph: graph,
        query: query
    });

    return http.post(url);
}

function getContactInfo(contact, fragmentsClient) {
    const ldf = window.ldf;
    var query = `
    PREFIX schema: <http://schema.org/>
	PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT DISTINCT ?givenName ?familyName ?image WHERE
    {
        <${contact}> foaf:givenName ?givenName;
                     foaf:familyName ?familyName .
        OPTIONAL{ <${contact}> foaf:img ?image . }
    } LIMIT 1
    `;

    return executeQuery(new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient })).then(result => {
        return result.map(res => {
            return {
                'firstname': parser.parseString(res['?givenName']),
                'lastname': parser.parseString(res['?familyName']),
                'image': res['?image']
            }
        })[0];
    });
}

/*****************************
 *         Messages          *
 *****************************/
function getAllMessages(datapod, me) {
    const ldf = window.ldf;
    const fragmentsClient = new ldf.FragmentsClient(datapod);

    var query = `
    PREFIX schema: <http://schema.org/>
	PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT DISTINCT ?sender ?recipient ?date ?text WHERE
    {
        ?message a schema:Message;
                 schema:sender ?sender;
	         schema:recipient ?recipient;
	         schema:dateSent ?date;
	         schema:Text ?text.
        FILTER(?sender=<${me}> || ?recipient=<${me}>)
    }
    `;

    return executeQuery(new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient })).then(result => {

        // Parse message fields
        let messages = result.map(res => {
                return {
                    'sender': res['?sender'],
                    'recipient': res['?recipient'],
                    'creation_date': parser.parseDate(res['?date']),
                    'content': parser.parseString(res['?text']),
                    'received': res['?sender'] !== me
                };
        });


        // Sort messages
        messages = messages.sort(sorters.sort_by_properties(new Map([["creation_date", "desc"]])));

        // Get unique messages based on other person
        return _.uniq(messages, false, a => {
            return !a.received ? new URL(a.recipient).toString() : new URL(a.sender).toString()
        });

    }).then((messages) => {
        // Get corresponding contacts for uniques
        let contacts = messages.map(message => !message.received ? getContactInfo(message.recipient, fragmentsClient) : getContactInfo(message.sender, fragmentsClient));

        return Promise.all(contacts).then((contacts) => {
            return clean(contacts.map((contact, index) => {
                if (contact) {
                    return {
                        'lastmessage': (messages[index].received ? contact.firstname + ': ' : 'You: ') + messages[index].content,
                        'firstname': contact.firstname,
                        'lastname': contact.lastname,
                        'id': messages[index].received ? encodeURIComponent(messages[index].sender) : encodeURIComponent(messages[index].recipient),
                        'image': contact.image,
                        'time': messages[index].creation_date.getHours() + ':' + (messages[index].creation_date.getMinutes() < 10 ? '0' : '') + messages[index].creation_date.getMinutes()
                    }
                }
            }));
        });

    });
}

function getChat(datapod, me, contact) {

    const ldf = window.ldf;
    const fragmentsClient = new ldf.FragmentsClient(datapod);

    var query = `
    PREFIX schema: <http://schema.org/>
	PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT DISTINCT ?date ?text ?sender WHERE
    {
        ?message a schema:Message;
                 schema:sender ?sender;
	         schema:recipient ?recipient;
	         schema:dateSent ?date;
	         schema:Text ?text.
        FILTER((?sender=<${me}> && ?recipient=<${contact}>) || (?recipient=<${me}> && ?sender=<${contact}>))
    }
    `;

    return executeQuery(new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient })).then(result => {
        // Parse message fields
        return clean(result.map(res => {
            return {
                'creation_date': parser.parseDate(res['?date']),
                'content': parser.parseString(res['?text']),
                'received': res['?sender'] !== me
            }
        }));
    });

}

function sendMessage(http, datapod, me, contact, message) {
    let url = url_helper.get_base_url(me) + '/messages/' + random.generateHash();
    const msg = createMessage(http, url, me, contact, message);

    const c = getDatapod(contact).then(pod => {
        return addMessage(http, url, pod);
    });
    const m = addMessage(http, url, datapod);

    return Promise.all([msg, c, m]).then(() => {
        return;
    });
}

function createMessage(http, url, me, contact, message) {
    const query = `
    PREFIX this: <${url}>
    PREFIX schema: <http://schema.org/>

    INSERT {
        this: a schema:Message;
            schema:sender <${me}>;
            schema:recipient <${contact}>;
            schema:dateSent "${new Date(Date.now()).toJSON()}";
            schema:Text "${message}".
    }
    `;


    let req = url_helper.build_url({
        base: 'http://groep24.webdev.ilabt.imec.be:2004/sparql',
        endpoint: 'http://groep24.webdev.ilabt.imec.be:8890/sparql',
        graph: url,
        query: query
    });

    return http.post(req);
}

function addMessage(http, url, pod) {
    const query = `
    PREFIX schema: <http://schema.org/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    INSERT {
        <${url}> a schema:Message.
    }
    `;

    let req = url_helper.build_url({
        base: 'http://groep24.webdev.ilabt.imec.be:2004/sparql',
        endpoint: 'http://groep24.webdev.ilabt.imec.be:8890/sparql',
        graph: url,
        query: query
    });

    return http.post(req);
}

/*****************************
 *         User          *
 *****************************/
function getOwner(datapod) {
    const ldf = window.ldf;
    const fragmentsClient = new ldf.FragmentsClient(datapod);

    var query = `
    PREFIX : <${datapod}>
    PREFIX schema: <http://schema.org/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT DISTINCT ?maker WHERE
    {
        : foaf:maker ?maker .
    }
    `;

    return executeQuery(new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient })).then(result => {
        return result[0]['?maker'];
    });
}

function getOwnerInfo(datapod, me) {
    const ldf = window.ldf;
    const fragmentsClient = new ldf.FragmentsClient(datapod);

    var query = `
    PREFIX me: <${me}>
    PREFIX schema: <http://schema.org/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT DISTINCT ?givenName ?familyName ?gender ?phone ?mail ?image WHERE
    {
        me: foaf:givenName ?givenName;
            foaf:familyName ?familyName .
        OPTIONAL{ me: foaf:gender ?gender . }
        OPTIONAL{ me: foaf:phone ?phone . }
        OPTIONAL{ me: foaf:mbox ?mail . }
        OPTIONAL{ me: foaf:img ?image . }
        FILTER (lang(?givenName) = '')
        FILTER (lang(?familyName) = '')
        FILTER (lang(?gender) = '')
    } LIMIT 1
    `;

    return executeQuery(new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient })).then(result => {
        return result.map(res => {
            return {
                'firstname': parser.parseString(res['?givenName']),
                'lastname': parser.parseString(res['?familyName']),
                'phone': res['?phone'] ? parser.parseString(res['?phone']) : null,
                'gender': res['?gender'] ? parser.parseGender(res['?gender']) : null,
                'email': res['?mail'] ? parser.parseString(res['?mail']) : null,
                'image': res['?image']
            }
        })[0];
    });
}

function updateOwnerInfo(http, graph, me, ownerInfo) {

    const query = `
    PREFIX me: <${me}>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    MODIFY <${graph}>
    DELETE { 
        me: foaf:givenName ?givenName;
            foaf:familyName ?familyName;
            foaf:gender ?gender;
            foaf:phone ?phone;
            foaf:mbox ?mail;
            foaf:img ?image .
    } 
    INSERT {
        me: foaf:givenName "${ownerInfo.firstname}";
            foaf:familyName "${ownerInfo.lastname}" .
        ${ownerInfo.gender != '' ? 'me: foaf:gender "' + ownerInfo.gender + '" .' : "" }
        ${ownerInfo.phone != '' ? 'me: foaf:phone "' + ownerInfo.phone + '" .' : "" }
        ${ownerInfo.email != '' ? 'me: foaf:mbox "' + ownerInfo.email + '" .' : "" }
        ${ownerInfo.image != '' ? 'me: foaf:img <' + ownerInfo.image + '> .' : "" }
    } WHERE {
        me: foaf:givenName ?givenName;
            foaf:familyName ?familyName.
        OPTIONAL{ me: foaf:gender ?gender . }
        OPTIONAL{ me: foaf:phone ?phone . }
        OPTIONAL{ me: foaf:mbox ?mail . }
        OPTIONAL{ me: foaf:img ?image . }
    }   
    `;

    let url = url_helper.build_url({
        base: 'http://groep24.webdev.ilabt.imec.be:2004/sparql',
        endpoint: 'http://groep24.webdev.ilabt.imec.be:8890/sparql',
        graph: graph,
        query: query
    });

    return http.post(url);
}


/*****************************
 *         Helpers           *
 *****************************/
function executeQuery(iterator) {
    return new Promise((resolve, reject) => {

        let results = [];
        iterator.on('data', function (result) { results.push(result) });
        iterator.on('end', () => {
            resolve(results);
        });
        iterator.on('error', (err) => {
            reject(err);
        });
    })
}

function deleteMissing(object) {
    let obj = object;
    Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : '');
    return obj;
}

function clean(arr) {
    let temp = [];
    for(let i of arr)
        i && temp.push(i); // copy each non-empty value to the 'temp' array

    return temp;
}

function getDatapod(owner) {
    const ldf = window.ldf;
    const fragmentsClient = new ldf.FragmentsClient('http://groep24.webdev.ilabt.imec.be:5000/datapods-sparql');

    const query = `
	PREFIX pim: <http://www.w3.org/ns/pim/space#>
    SELECT DISTINCT ?datapod WHERE {
        <${owner}> pim:storage ?datapod
     }
    `;

    return executeQuery(new ldf.SparqlIterator(query, { fragmentsClient: fragmentsClient })).then(result => {
        // Parse message fields
        return result[0]['?datapod'];
    });
}

/*****************************
 *         Exports          *
 *****************************/
export default {
    getContacts,
    getOwner,
    verifyDatapod,
    deleteContact,
    verifyContact,
    hasContact,
    addContact,
    getFullContact,
    updateContact,
    getOwnerInfo,
    updateOwnerInfo,
    getAllMessages,
    getChat,
    sendMessage
}
