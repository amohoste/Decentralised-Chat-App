<template>
    <div>
        <div class="row">
            <!-- datum -->
            <div class="col-8">
                <div class="media text-muted pb-1 mb-1 small lh-125">
                    <strong class="text-gray-dark">{{date}}</strong>
                </div>
            </div>
            <div class="col-4">
                <!-- Empty col -->
            </div>
        </div>

        <div class="row">
            <!-- inhoud -->
            <div class="col-8">
                <div class="card bg-light mb-3 float-left">
                    <div class="card-body">
                        <p class="card-text">{{message.content}}</p>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <!-- Empty col -->
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        props: ['message'],
        computed: {
            date() {
                let dat = this.message.creation_date;
                return dat.toDateString() + ' - ' + dat.getHours() + ':' + (dat.getMinutes() < 10 ? '0' : '') + dat.getMinutes()
            }
        }
    }
</script>
