<template>
    <div class="media text-muted pt-3">

        <!-- Profile image -->
        <img v-if="contact.image != null" alt="36x36" class="mr-2 rounded" :src="contact.image" style="width: 36px; height: 36px;">
        <img v-else alt="36x36" class="mr-2 rounded" src="../../../assets/images/profile_picture.jpg" style="width: 36px; height: 36px;">


        <div :class="['media-body small lh-125', { 'pb-3 border-bottom border-gray': !last } ]">

            <div class="d-flex justify-content-between align-items-center w-100">

                <!-- Fullname -->
                <router-link :to="'/contacts/' + contact.id"><strong class="text-gray-dark">{{contact.firstname}} {{contact.lastname}}</strong></router-link>

                <!-- Delete and edit buttons -->
                <div>
                    <router-link :to="'/contacts/' + contact.id + '/edit'">Edit</router-link> |
                    <a href="#" @click.prevent="deletecontact">Delete</a>
                </div>

            </div>

            <!-- Nickname -->
            <span class="d-block">@ {{contact.nickname}}</span>
        </div>
    </div>



</template>

<script>
    export default {
        props: ['contact', 'last'],
        methods: {
            deletecontact() {
                this.$store.dispatch('removeContact', [this.$http, this.contact.id, this.$store.getters.user.datapod, this.$store.getters.user.maker]);
            }
        }
    }


</script>
