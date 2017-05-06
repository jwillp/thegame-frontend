<template>
    <div class="news container-fluid">
        <div class="row">
            <div class="col-xs-10 news-message">
                <p v-if="news.game">
                    <router-link :to="{name:'games_view', params:{ id: news.game.id }}">
                      {{ news.game.title }}
                    </router-link>
                </p>

                <p v-if="news.iid == 'USER_COMPLETED_CHALLENGE_EVENT'">
                    <router-link :to="{name:'user_profile', params:{ id: news.agent.object_id }}">
                      {{ news.agent.object.username }} 
                    </router-link>
                      completed a score for challenge
                    <router-link :to="{name:'challenge_view', params:{ id: news.target.object_id }}">
                      {{ news.target.object.title }}
                    </router-link>
                </p>

                <p v-else-if="news.iid == 'USER_CANCELED_CHALLENGE_EVENT'">
                    <router-link :to="{name:'user_profile', params:{ id: news.agent.object_id }}">
                      {{ news.agent.object.username }} 
                    </router-link>
                      canceled a score for challenge
                    <router-link :to="{name:'challenge_view', params:{ id: news.target.object_id }}">
                      {{ news.target.object.title }}
                    </router-link>
                </p>

                <p v-else-if="news.iid == 'USER_CREATED_CHALLENGE_EVENT'">
                    <router-link :to="{name:'user_profile', params:{ id: news.agent.object_id }}">
                      {{ news.agent.object.username }} 
                    </router-link>
                      created challenge
                    <router-link :to="{name:'challenge_view', params:{ id: news.target.object_id }}">
                      {{ news.target.object.title }}
                    </router-link>
                    worth <b>{{ news.target.object.nb_points }} pts</b>
                </p>

                <p v-else>
                    {{ formatNews(news) }}
                </p>
                <p>{{ formatDate(news.date, true) }}</p>
            </div> <!-- info -->

            <!-- ICONS -->
            <div v-if="news.iid == 'USER_COMPLETED_CHALLENGE_EVENT'"
                 class="col-xs-2 news-icon news-green">
                <div class="center-xy">
                    <i class="glyphicon glyphicon-plus" aria-hidden="true"></i>
                    {{ news.target.object.nb_points }}
                </div>
            </div> 

            <div v-else-if="news.iid == 'USER_CANCELED_CHALLENGE_EVENT'"
                 class="col-xs-2 news-icon news-red">
                <div class="center-xy">
                    <i class="glyphicon glyphicon-minus" aria-hidden="true"></i>
                    {{ news.target.object.nb_points }}
                </div>
            </div>

            <div v-else-if="news.iid == 'USER_CREATED_CHALLENGE_EVENT'"
                 class="col-xs-2 news-icon news-blue">
                <div class="center-xy">
                    <i class="glyphicon glyphicon-plus" aria-hidden="true"></i>
                </div>
            </div> 



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