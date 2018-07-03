<template>
    <div class="my-3 p-3 bg-white card card-body rounded box-shadow" v-on:keyup.enter="addContact">

        <!-- Heading -->
        <div class="row border-bottom border-gray pb-2 mb-3">
            <!-- Name display -->
            <div class="col-8">
                <h5>Add Contact</h5>
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
                    <input v-model="datapod" type="text" class="form-control" placeholder="http://example.com" required>
                </div>
            </div>

            <!-- Username -->
            <div class="form-group">
                <label>Nickname</label>
                <div class="input-group mb-2 mr-sm-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">@</div>
                    </div>
                    <input v-model="nickname" type="text" class="form-control" placeholder="Nickname" required>
                </div>
            </div>

            <button :disabled="isDisabled" @click.stop="addContact" class="btn btn-primary">Submit</button>
        </form>

    </div>
</template>

<script>
    import dataprovider from '../../data/dataprovider.js';

    export default {
        data() {
            return {
                datapod: '',
                nickname: ''
            }
        },
        computed: {
            isDisabled() {
                return this.datapod === '' || this.nickname === '';
            }
        },
        methods: {
            addContact() {
                try {
                    if (!this.isDisabled) {
                        let user = this.$store.getters.user;
                        console.log(user);
                        dataprovider.verifyContact(user.datapod, this.datapod).then(() => {
                            return dataprovider.hasContact(user.datapod, user.maker, user.datapod);
                        }).then(hascontact => {
                            if (hascontact) {
                                throw(new Error("Contact already exists"));
                            } else {
                                this.$store.dispatch('addContact', [this.$http, user.datapod, user.maker, this.datapod, this.nickname]);
                                this.$router.push({ path: '/contacts' });
                            }
                        }).catch((err) => {
                            alert(err);
                        });
                    }
                }
                catch(err) {
                    alert("Invalid datapod");
                }

            }
        }
    }
</script>
