<template>
    <div class="my-3 p-3 bg-white card card-body rounded box-shadow">

        <!-- Heading -->
        <div class="row border-bottom border-gray pb-2 mb-0">
            <!-- Name display -->
            <div class="col-8">
                <h5>{{contact.firstname}} {{contact.lastname}}</h5>
            </div>

            <!-- Back button -->
            <div class="col-4">
                <small class="d-block text-right">
                    <router-link to="/contacts/">
                        <h6 style="display:inline">
                            <i class="fa fa-chevron-left"></i> Contacts</h6>
                    </router-link>
                </small>
            </div>
        </div>


        <div class="row mt-3">
            <!-- Name display -->
            <div class="col-3">
                <div class="card">

                    <!-- Contact image -->
                    <img v-if="contact.image != null" class="card-img-top" :src="contact.image" alt="Profile picture">
                    <img v-else class="card-img-top" src="../../assets/images/profile_picture.jpg" alt="Profile picture">

                </div>
            </div>

            <!-- TODO: add extra properties -->
            <!-- Contact Info properties -->
            <div class="col-9">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <Strong>Nickname: </Strong>{{contact.nickname}}</li>
                    <li class="list-group-item">
                        <Strong>Firstname: </Strong>{{contact.firstname}}</li>
                    <li class="list-group-item">
                        <Strong>Lastname: </Strong>{{contact.lastname}}</li>
                </ul>
            </div>
        </div>


    </div>
</template>

<script>
    export default {
        computed: {
            contact() {
                return this.$store.getters.contact(encodeURIComponent(this.$route.params.id));
            }
        },
    }
</script>
