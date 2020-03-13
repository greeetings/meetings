function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }

    return -1;
}


var meetingApi = Vue.resource('/meeting{/id}');

Vue.component('meeting-form', {
    props: ['meetings', 'meetingAttr'],
    data: function() {
        return {
            text: '',
            id: ''
        }
    },
    watch: {
        meetingAttr: function(newVal, oldVal) {
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },
    template:
        '<div>' +
        '<input type="text" placeholder="Add meeting" v-model="text" />' +
        '<input type="button" value="Add" @click="save" />' +
        '</div>',
    methods: {
        save: function() {
            var meeting = { text: this.text };

            if (this.id) {
                meetingApi.update({id: this.id}, meeting).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.meetings, data.id);
                        this.meetings.splice(index, 1, data);
                        this.text = ''
                        this.id = ''
                    })
                )
            } else {
                meetingApi.save({}, meeting).then(result =>
                    result.json().then(data => {
                        this.meetings.push(data);
                        this.text = ''
                    })
                )
            }
        }
    }
});

Vue.component('meeting-row', {
    props: ['meeting', 'editMethod', 'meetings'],
    template: '<table border = "1" >' +
        '<tr><td width="40"><i>' +
        '({{ meeting.id }})</i></td>' +
        '<td width="200">{{ meeting.text }} </td>' +
        '<td width="150">{{meeting.date}} </td>' +
        '<td width="400">{{meeting.participants}}</td></tr>' +
        '</table>',
    methods: {
        edit: function() {
            this.editMethod(this.meeting);
        },
        del: function() {
            meetingApi.remove({id: this.meeting.id}).then(result => {
                if (result.ok) {
                    this.meetings.splice(this.meetings.indexOf(this.meeting), 1)
                }
            })
        }
    }
});

Vue.component('meetings-list', {
    props: ['meetings'],
    data: function() {
        return {
            meeting: null
        }
    },
    template:
        '<div  style="position: relative;  ">' +
        '<meeting-form :meetings="meetings" :meetingAttr="meeting" />' +

        '<table style="margin-top: 10px " border = "1" >' +
        '<tr><td width="40"><i>' +
        'Num</i></td>' +
        '<td width="200">Name </td>' +
        '<td width="150">Date </td>' +
        '<td width="400">Participants</td></tr>' +
        '</table>'+

        '<meeting-row v-for="meeting in meetings" :key="meeting.id" :meeting="meeting" ' +
        ':editMethod="editMethod" :meetings="meetings" />' +
        '</div>',
    created: function() {
        meetingApi.get().then(result =>
            result.json().then(data =>
                data.forEach(meeting => this.meetings.push(meeting))
            )
        )
    },
    methods: {
        editMethod: function(meeting) {
            this.meeting = meeting;
        }
    }
});

var app = new Vue({
    el: '#app',
    template: '<meetings-list :meetings="meetings" />',
    data: {
        meetings: []
    }
});