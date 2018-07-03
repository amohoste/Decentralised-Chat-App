<template>

    <div>
        <div class="mx-auto text-center">
            <a href="#" @click.prevent="refreshMessages">
                <span style="font-size:1.3em"><i class="fa fa-refresh"></i></span>
            </a>
        </div>
        <!-- Message dialog -->
        <div class="my-3 pt-3 pl-3 pr-3 pb-2 pb-0 bg-white card card-body rounded box-shadow">

            <!-- Heading -->
            <div class="row pt-1 mb-4 border-bottom border-gray">
                <!-- Name display -->
                <div class="col-7 media text-muted ">

                    <img v-if="contact.image" alt="32x32" class="mr-2 rounded" :src="contact.image"
                         style="width: 38px; height: 38px;">
                    <img v-else alt="32x32" class="mr-2 rounded" src="../../../assets/images/profile_picture.jpg"
                         style="width: 38px; height: 38px;">

                    <div class="media-body pb-3 mb-0 small lh-125">
                        <div class="d-flex justify-content-between align-items-center w-100">
                            <strong class="text-gray-dark">{{contact.firstname}} {{contact.lastname}}</strong>
                        </div>
                        <span class="d-block">@{{contact.nickname}}</span>
                    </div>
                </div>

                <!-- Back button -->
                <div class="col-5">
                    <small class="d-block text-right">
                        <router-link to="/messages/">
                            <h6 style="display:inline">
                                <i class="fa fa-chevron-left"></i> Messages
                            </h6>
                        </router-link>
                    </small>
                </div>
            </div>

            <!-- messages -->
            <div class="container pre-scrollable downscroll">

                <!-- No Messages -->
                <div v-if="!messages" class="row pb-2 pt-4">
                    <div class="col-10 media text-muted">
                        <div class="media-body pb-3 mb-0 small lh-125">

                        </div>
                    </div>
                </div>

                <div v-else v-for="message in messages">

                    <!-- Received message -->
                    <received-message v-if="message && message.received" :message="message"></received-message>

                    <!-- Sent message -->
                    <send-message v-else-if="message" :message="message"></send-message>

                </div>

            </div>

            <!-- Bottom border -->
            <div class="media text-muted pt-3 mb-3 border-bottom border-gray"></div>

            <!-- send message form -->
            <div class="input-group mb-3">
            <textarea v-model="message"  v-on:keyup.enter="sendMessage" class="form-control messagebox" name="message" placeholder="Type a message..."
                      data-emojiable="true"
                      data-emoji-input="unicode"></textarea>
                <div class="input-group-append">
                    <button @click="sendMessage" class="btn btn-primary">Send</button>
                </div>
            </div>
        </div>
    </div>


</template>


<script>
    import ReceivedMessage from './ReceivedMessage.vue';
    import SendMessage from './SendMessage.vue';

    export default {
        data() {
            return {
                message: ''
            }
        },
        computed: {
            contact() {
                console.log(this.$store.getters.contacts);
                console.log(this.$route.params.id);
                console.log(encodeURIComponent(this.$route.params.id));
                console.log(this.$store.getters.contact(encodeURIComponent(this.$route.params.id)));
                return this.$store.getters.contact(encodeURIComponent(this.$route.params.id));
            },
            messages() {
                return this.$store.getters.contactMessages(encodeURIComponent(this.$route.params.id));
            }
        },
        components: {
            receivedMessage: ReceivedMessage,
            sendMessage: SendMessage
        },
        methods: {
            sendMessage() {
                if (this.message !== '') {
                    let user = this.$store.getters.user;
                    this.$store.dispatch('sendMessage', [this.$http, user.datapod, user.maker, encodeURIComponent(this.$route.params.id), this.message]);
                    this.message = '';
                }
            },
            refreshMessages() {
                let user = this.$store.getters.user;
                if (user) {
                    this.$store.dispatch('loadContactMessages', [user.datapod, user.maker, encodeURIComponent(this.$route.params.id)]);
                }
            }
        },
        mounted: function () {
            this.refreshMessages();
        }
    }
</script>
