<template>
    <!-- Login page -->
    <form class="row" v-on:keyup.enter="login" v-on:submit.prevent>
        <div class="col-md-6 mx-auto">
            <div class="text-center">
                <div class="mt-3 form-signin">
                    <img class="mb-3 mx-auto" src="../../assets/images/logo.svg" alt="" width="72" height="72">
                    <h2 class="h3 mb-3 font-weight-normal">Please sign in</h2>

                    <!-- Username -->
                    <input v-model="username" type="username" class="form-control" placeholder="Username" name="username" required autofocus>

                    <!-- Password -->
                    <input v-model="datapod" type="datapod" class="form-control" placeholder="Datapod"  name="datapod" required>

                    <button @click.stop="login" :disabled="isDisabled" class="btn btn-lg btn-primary btn-block mt-2">Sign in</button>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
    import dataprovider from '../../data/dataprovider.js';

    let executeQuery = function(iterator) {
        return new Promise((resolve, reject) => {

            let results = [];
            iterator.on('data', function (result) { results.push(result) });
            iterator.on('end', () => {
                resolve(results);
            });
            iterator.on('error', (err) => {
                reject(err);
            });
        })
    };



    export default {
        data() {
            return {
                username: '',
                datapod: ''
            }
        },
        computed: {
            isDisabled() {
                return this.username == '' || this.datapod == '';
            }
        },
        methods: {
            login() {
                try {
                    dataprovider.verifyDatapod(this.datapod).then(() => {
                        return dataprovider.getOwner(this.datapod);
                    }).then(maker => {
                        this.$store.dispatch('login', [this.username, this.datapod, maker]);
                        this.$store.dispatch('loadContacts', [this.datapod, maker]);
                        this.$router.push({ path: '/messages' });
                    }).catch(err => {
                        console.log(err);
                        alert("Invalid datapod");
                    });
                }
                catch(err) {
                    alert("Invalid datapod");
                }

            }
        }
    }
</script>
