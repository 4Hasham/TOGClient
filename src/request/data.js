import { fetchAPI } from "./fetchAPI";

export async function requestJSONData(file) {
    return await new Promise((resolve, reject) => {
        fetchAPI("../api/Data?file=" + file)
        .then((res) => {
            resolve(res.json());
        });
    });
}

export async function requestData(data) {
    return await new Promise((resolve, reject) => {
        fetchAPI("../api/dbData?name=" + data)
        .then((res) => {
            resolve(res.json());
        });
    });
}

export async function getAddress(id) {
    if(!isNaN(id)) {
        return await new Promise((resolve, reject) => {
            fetchAPI("../api/getAddress?id=" + id)
            .then((res) => {
                resolve(res.json());
            });
        });
    }
}

export async function getIntercity(pickup, destination) {
    if(pickup !== null && destination !== null) {
        return await new Promise((resolve, reject) => {
            fetchAPI("../book/getIntercity?pickup=" + pickup + "&destination=" + destination)
            .then((res) => {
                resolve(res.json());
            });
        });
    }
}