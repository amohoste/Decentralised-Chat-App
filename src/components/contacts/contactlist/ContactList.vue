<template>

    <div class="my-3 p-3 bg-white card card-body rounded box-shadow">

        <!-- Heading -->
        <div class="row border-gray border-bottom pb-2">

            <!-- Name display -->
            <div class="col-8">
                <h5 class="mb-0">Contacts</h5>
            </div>

            <!-- Add contact button -->
            <div class="col-4">
                <small class="d-block text-right">
                    <router-link to="/contacts/add">
                        <div style="font-size:1.6em">
                            <i class="fa fa-plus"></i>
                        </div>
                    </router-link>
                </small>
            </div>
        </div>

        <!-- Contacts -->
        <div v-if="!contactListEmpty" class="media text-muted pt-3">
            <div class="media-body pb-2 pt-2 small lh-125">
                <div class="d-flex justify-content-between align-items-center w-100">
                    <strong class="text-gray-dark">No contacts yet</strong>
                </div>
            </div>
        </div>

        <div v-else>
            <!-- Load in all contacts-->
            <contact-list-item v-for="(contact, id, index) in contacts" :contact="contact" :key="id" :last="index === (Object.keys(contacts).length - 1)"></contact-list-item>
        </div>
    </div>


</template>

<script>

    import ContactListItem from './ContactListItem.vue';
    import {isEmpty} from '../../../helpers/helpers.js';

    export default {
        components: {
            contactListItem: ContactListItem
        },
        computed: {
            contacts() {
                return this.$store.getters.contacts
            },
            contactListEmpty() {
                return ! isEmpty(this.$store.getters.contacts);
            }
        }
    }
</script>
