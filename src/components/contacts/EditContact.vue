<template>
    <div class="my-3 p-3 bg-white card card-body rounded box-shadow" v-on:keyup.enter="updateContact">

        <!-- Heading -->
        <div class="row border-bottom border-gray pb-2 mb-3">

            <!-- Name display -->
            <div class="col-8">
                <h5>Edit Contact</h5>
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

        <!-- Card Form -->
        <form v-on:submit.prevent>

            <!-- Url -->
            <div class="form-group">
                <label>Data pod URL</label>
                <div class="input-group mb-2 mr-sm-2">
                    <div class="input-group-prepend">
                        <span class="input-group-text">URL</span>
                    </div>
                    <input v-model="contact.datapod" type="text" class="form-control" name="reference" placeholder="http://example.com" required>
                </div>
            </div>

            <!-- Username -->
            <div class="form-group">
                <label>Nickname</label>
                <div class="input-group mb-2 mr-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">@</div>
                    </div>
                    <input v-model="contact.nickname" type="text" class="form-control" name="nickname" placeholder="Nickname" required>
                </div>
            </div>

            <button :disabled="isDisabled" @click.stop="updateContact" class="btn btn-primary">Submit</button>
        </form>

    </div>

</template>

<script>
    import dataprovider from '../../data/dataprovider.js';

    export default {
        computed: {
            isDisabled() {
                return this.contact.nickname === '' || this.contact.reference === '';
            },
            contact() {
                return this.$store.getters.contact(encodeURIComponent(this.$route.params.id));
            }
        },
        methods: {
            updateContact() {
                try {
                    if (!this.isDisabled) {
                        let user = this.$store.getters.user;
                        dataprovider.verifyContact(user.datapod, this.contact.datapod).then(() => {
                            this.$store.dispatch('updateContact', [this.$http, encodeURIComponent(this.$route.params.id), user.datapod, user.maker, this.contact.datapod, this.contact.nickname]);
                            this.$router.push({ path: '/contacts' });
                        }).catch((err) => {
                            alert(err);
                        });
                    }
                }
                catch(err) {
                    alert(err);
                }
            }
        }
    }
</script>
