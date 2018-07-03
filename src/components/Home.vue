<template>
    <!-- Main index page -->
    <section class="jumbotron text-center bg-light">
        <div class="container">
            <!-- Title -->
            <h1 class="display-4 font-weight-normal">Welcome</h1>

            <!-- Description -->
            <p class="lead text-muted">DeChat is a decentralized messaging app that lets you sent messages, add friends and much more while keeping your
                precious data in your own pod.</p>

            <!-- Butons -->
            <p>
                <router-link class="btn btn-outline-secondary btn-lg mb-2" to="/messages">Open messages</router-link>
                <router-link class="btn btn-outline-primary btn-lg mb-2" to="/contacts">Open contacts</router-link>
            </p>
        </div>
    </section>
</template>
