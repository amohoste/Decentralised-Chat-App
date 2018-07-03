<template>
    <div class="my-3 bg-white card card-body rounded box-shadow messagecard">

        <!-- Heading -->
        <div class="row border-gray pb-2">

            <!-- Name display -->
            <div class="col-8">
                <h5 class="border-gray pb-2 mb-0">Messages
                    <a href="#" @click.prevent="refreshMessages" class="ml-2">
                        <span style="font-size:1em">
                            <i class="fa fa-refresh"></i>
                        </span>
                    </a>
                </h5>
            </div>

            <!-- New message button -->
            <div class="col-4">
                <small class="d-block text-right">
                    <router-link to="/messages/new">
                        <span style="font-size:1.6em">
                            <i class="fa fa-plus"></i>
                        </span>
                    </router-link>
                </small>
            </div>
        </div>

        <!-- Messages -->
        <div v-if="!messageListEmpty" class="row border-top border-gray pt-4">
            <div class="col-10 media text-muted">
                <div class="media-body pb-3 mb-0 small lh-125">
                    <div class="d-flex justify-content-between align-items-center w-100">
                        <strong class="text-gray-dark">No messages yet</strong>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <!-- Load in all contacts-->
            <message-list-item v-for="(item, i) in messageListItems" :key="i" :item="item"></message-list-item>
        </div>
    </div>
</template>

<script>
    import MessageListItem from './MessageListItem.vue';
    import {isEmpty} from '../../../helpers/helpers.js';

    export default {
        components: {
            MessageListItem: MessageListItem
        },
        computed: {
            messageListItems() {
                return this.$store.getters.last_messages;
            },
            messageListEmpty() {
                return ! isEmpty(this.$store.getters.last_messages);
            }
        },
        methods: {
            refreshMessages() {
                let user = this.$store.getters.user;
                if (user) {
                    this.$store.dispatch('loadMessages', [user.datapod, user.maker]);
                }
            }
        },
        mounted: function () {
            this.refreshMessages();
        }
    }
</script>


