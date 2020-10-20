// TODO: Refactor completely

const axios = require('axios');
const axiosCacheAdapter = require('axios-cache-adapter');
const secret = require('../secret.json');

const cache = axiosCacheAdapter.setupCache({ maxAge: 24 * 60 * 60 * 1000 }); // 1 day cache duration
const api = axios.create({ adapter: cache.adapter });

function idsRecursively(o) {
    let ids = [];

    for (let key in o) {
        if (key == "id") {
            ids.push(o[key]);
        }

        if (typeof o[key] === 'object' && o[key] !== null) {
            if (Array.isArray(o[key])) {
                ids.push(...o[key].map(idsRecursively).map(e => e[0]));
            } else {
                ids.push(...idsRecursively(o[key]));
            }
        }
    }

    return ids;
}

function hasMatchingId(student, ids) {
    let match = false;
    for (let id of student.groupSets) {
        if (Array.isArray(ids)) {
            if (ids.includes(id)) match = true;
        } else if (ids == id) match = true;
    }
    return match;
}

function getById(array, id) {
    for (let item of array) {
        if (item.id === id) return item;
    }

    return null;
}

function addSubjects(students, activities, subjects) {
    return students.map(student => {
        student.groupSets = idsRecursively(student.groupSets);

        student.activityIds = [];
        student.subjectIds = [];
        for (let activity of activities) {
            if (hasMatchingId(student, activity.groupIds)) {
                student.activityIds.push(activity.id);
                student.subjectIds.push(activity.subjectId);
            }
        }
        student.subjects = student.subjectIds.map(id => getById(subjects, id));

        // The Ainsel clause
        if (student.name === "Katarina Fallon") student.name = "Ainsel Fallon";

        return student;
    });
}

module.exports = async function primetable(urls = secret.api_urls) {
    let responses = await Promise.all(urls.map(url => api({ url: url, method: 'GET' })));
    responses = responses.map(res => res.data);

    let data = responses[0];
    for (let item of responses.slice(1)) {
        data.classes = [ ...data.classes, ...item.classes ];
        data.subjects = [ ...data.subjects, ...item.subjects ];
        data.activities = [ ...data.activities, ...item.activities ];
    }

    data.classes = addSubjects(data.classes, data.activities, data.subjects);

    // processed students now have an attribute "subjects" which is pretty self-explanatory
    return data;
}
