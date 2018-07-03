<template>
    <div class="my-3 p-3 bg-white card card-body rounded box-shadow" v-on:keyup.enter="updateProfile">

        <!-- Heading -->
        <div class="row border-bottom border-gray pb-2 mb-3">
            <div class="col-8">
                <h5>Profile</h5>
            </div>
        </div>

        <!-- Card Form -->
        <form v-on:submit.prevent>

            <div class="form-row">

                <!-- Profile picture url -->
                <div class="form-group col-9 col-md-10">
                    <label>Profile Picture Url</label>
                    <div class="input-group mb-2 mr-sm-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text">URL</span>
                        </div>
                        <input v-model="profile.image" type="text" class="form-control" id="image" placeholder="http://example.com">
                    </div>
                </div>

                <!--gender -->
                <div class="form-group col-3 col-md-2">
                    <label>Gender</label>
                    <select id="gender" class="form-control" v-model="profile.gender">
                        <option value="" selected>Choose...</option>
                        <option v-for="gender in genders" :value="gender.toLowerCase()">{{gender}}</option>
                    </select>


                </div>

            </div>


            <div class="form-row">

                <!-- Firstname -->
                <div class="form-group col-6">
                    <label>Firstname</label>
                    <input type="text" class="form-control" id="firstname" placeholder="Firstname" v-model="profile.firstname" required>
                </div>

                <!-- Lastname -->
                <div class="form-group col-6">
                    <label>Lastname</label>
                    <input type="text" class="form-control" id="lastname" placeholder="Lastname" v-model="profile.lastname" required>
                </div>

            </div>

            <div class="form-row">

                <!-- Email -->
                <div class="form-group col-md-6">
                    <label>Email</label>
                    <div class="input-group mb-2 mr-sm-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">@</div>
                        </div>
                        <input type="email" class="form-control" id="email" placeholder="user@example.com" v-model="profile.email">
                    </div>
                </div>

                <!-- Phone number -->
                <div class="form-group col-md-6">
                    <label>Phone Number</label>
                    <input type="tel" class="form-control" id="phone" placeholder="Phone" v-model="profile.phone">
                </div>

            </div>

            <button :disabled="isDisabled" @click.stop="updateProfile" class="btn btn-primary mb-2">Confirm Changes</button>
        </form>

    </div>
</template>

<script>
    import { isEmpty } from '../../helpers/helpers.js';

    export default {
        data() {
            return {
                /*
                profile: {
                    id: 1,
                    firstname: 'Amory',
                    lastname: 'Hoste',
                    gender: 'Male',
                    email: 'amory.hoste@example.com',
                    phone: '+32499999999',
                    image: 'https://www.jqueryscript.net/images/Simplest-Responsive-jQuery-Image-Lightbox-Plugin-simple-lightbox.jpg'
                },*/
                genders: [
                    'Male', 'Female'
                ]
            }
        },
        computed: {
            isDisabled() {
                return this.profile.firstname === '' || this.profile.lastname === '' || this.profile.gender === '' || this.profile.email === '' || this.profile.phone === '' || this.profile.image === '';
            },
            profile() {
                return this.$store.getters.profile;
            }
        },
        methods: {
            updateProfile() {
                if (!this.isDisabled) {
                    let user = this.$store.getters.user;
                    this.$store.dispatch('updateProfile', [this.$http, user.datapod, user.maker, this.profile]);
                }
            }
        },
        mounted: function () {
            let user = this.$store.getters.user;
            if (isEmpty(this.$store.getters.profile) && !isEmpty(user)) {
                this.$store.dispatch('loadProfile', [user.datapod, user.maker]);
            }
        }
    }
</script>
