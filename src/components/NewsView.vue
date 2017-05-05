<template>
    <div class="news container-fluid">
        <div class="row">
            <div class="col-md-10 news-message">
                <p v-if="news.game">
                    <router-link :to="{name:'games_view', params:{ id: news.game.id }}">
                      {{ news.game.title }}
                    </router-link>
                </p>
                <p>{{ formatNews(news) }}</p>
                <p>{{ formatDate(news.date, true) }}</p>
            </div> <!-- info -->
            <div class="col-md-2 news-icon news-blue">
                <div class="center-xy">
                    <i class="fa fa-plus" aria-hidden="true"></i>
                </div>
            </div> <!-- icon -->
        </div> <!-- /.row -->
    </div> <!-- / .news -->
</template>

<script>

import moment from 'moment'

export default {
    props: ['news'],

    methods: {
        formatDate: function(date, displayTime) {
            var dateFormat = "YYYY/MM/DD"
            if(displayTime)
                dateFormat = "YYYY/MM/DD [at] HH:mm"

            return moment(date, dateFormat).fromNow()
        },

        // A generic function to format a news
        formatNews: function(news) {
            var formatedString = news.action
                            .replace('{agent}', news.agent.type)
                            .replace('{target}', news.target.type)
            return formatedString
        }
    },

}
</script>