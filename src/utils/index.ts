import {USER }from './generate'
import {STRING }from './verify'
import { EventList } from './EventList'


export default {
    GENERATE: {
        USER: USER
    },
    VERIFY: {
        STRING: STRING
    },
    EVENTS: EventList,
    removeSensitiveData: (data: any) => {
        if(data.password) data.password = "hidden";
        if(data.token) data.token = "hidden";
        return data;
    }
}