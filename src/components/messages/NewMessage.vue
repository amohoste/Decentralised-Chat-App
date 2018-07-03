<template>
    <div class="my-3 p-3 bg-white card card-body rounded box-shadow" v-on:keyup.enter="newMessage">

        <!-- Heading -->
        <div class="row border-bottom border-gray pb-2 mb-3">
            <!-- Name display -->
            <div class="col-8">
                <h5>New message</h5>
            </div>

            <!-- Back button -->
            <div class="col-4">
                <small class="d-block text-right">
                    <router-link to="/messages/">
                        <h6 style="display:inline">
                            <i class="fa fa-chevron-left"></i> Messages</h6>
                    </router-link>
                </small>
            </div>
        </div>

        <!-- Card Form -->
        <form v-on:submit.prevent>

            <!-- Recipient -->
            <div class="form-group">
                <label>Recipient</label>
                <div class="input-group mb-2 mr-sm-2">

                    <select class="custom-select" id="select-recipient" v-model="selectedContact" required>
                        <option value="" selected>Choose...</option>
                        <option v-for="contact in contacts" :value="contact.id">{{contact.firstname}} {{contact.lastname}} - @{{contact.nickname}}</option>
                    </select>

                    <div class="input-group-append">
                        <!-- Submit button -->
                        <button :disabled="isDisabled" @click.stop="newChat" class="btn btn-primary">Submit</button>
                    </div>
                </div>
            </div>
        </form>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectedContact: '' // Dit is een id
            }
        },
        computed: {
            isDisabled() {
                return this.selectedContact === '' ;
            }
        },
        methods: {
            newChat() {
                this.$router.push({ path: '/messages/' + this.selectedContact });
            }
        },
        computed: {
            contacts() {
                return this.$store.getters.contacts
            }
        }
    }
</script>
