<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark mb-3">

        <!--Logo-->
        <router-link to="/" class="navbar-brand">
            <img src="../assets/images/logo.svg" width="30" height="30" class="d-inline-block align-top" alt="Logo"
                 hspace="5"> DeChat
        </router-link>

        <!-- Mobile nav -->
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Other navbar items -->
        <div class="collapse navbar-collapse" id="navbarNav">

            <!-- Home nav -->
            <ul class="navbar-nav">
                <li class="nav-item">
                    <router-link class="nav-link" to="/">Home</router-link>
                </li>
            </ul>

            <!-- Right dropdown -->
            <ul class="navbar-nav ml-auto">
                <!-- TODO: Check if user logged in -->
                <li v-if="!loggedIn" class="nav-item">
                    <router-link to="/users/login" class="nav-link">Login</router-link>
                </li>
                <li v-if="loggedIn" class="nav-item dropdown">

                    <!-- Dropdown text -->
                    <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown" id="navBarDropdownMenuLink">{{username}}</a>

                    <!-- Dropdown items -->
                    <div class="dropdown-menu dropdown-menu-right">
                        <router-link to="/messages" class="dropdown-item"><a>Messages</a></router-link>
                        <router-link to="/contacts" class="dropdown-item"><a>Contacts</a></router-link>
                        <router-link to="/users/profile" class="dropdown-item">Profile</router-link>
                        <a href="#" @click.prevent="logout" class="dropdown-item">Logout <i
                            class="fa fa-sign-out float-right mt-1" aria-hidden="true"></i></a>
                    </div>
                </li>
            </ul>
        </div>

    </nav>
</template>

<script>
    import {isEmpty} from '../helpers/helpers.js';

    export default {
        computed: {
            loggedIn() {
                return ! isEmpty(this.$store.getters.user);
            },
            username() {
                return this.$store.getters.username;
            }
        },
        methods: {
            logout() {
                this.$store.dispatch('logout');
                this.$router.push({ path: '/users/login' });
            }
        }
    }
</script>
