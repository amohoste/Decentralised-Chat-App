<template>
    <!-- Load in contacts -->
    <div class="row border-top border-gray pb-3 pt-3">

        <!-- Sender -->
        <div class="col-10 media text-muted">
            <!-- Profile image -->
            <img v-if="item.image != null" alt="48x48" class="mr-2 rounded" :src="item.image" style="width: 48px; height: 48px;">
            <img v-else alt="48x48" class="mr-2 rounded" src="../../../assets/images/profile_picture.jpg" style="width: 48px; height: 48px;">


            <!-- User info -->
            <div class="media-body small">
                <div class="d-flex justify-content-between align-items-center w-100">
                    <router-link :to="'/messages/' + item.id">
                        <strong class="text-gray-dark">{{item.firstname}} {{item.lastname}}</strong>
                    </router-link>
                </div>
                <span class="crop-text-line pt-1">{{item.lastmessage}}</span>
            </div>
        </div>

        <!-- Last message -->
        <div class="col-2 media text-muted text-right">
            <div class="media-body small">
                {{item.time}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['item']

    }
</script>
