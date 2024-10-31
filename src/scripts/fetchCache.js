import { parseConfiguration } from "./jsonParser.js" 

export function generateFetchComponent () {
    let config;
    return {
        build : (pathConfig) => {
            parseConfiguration("../../config.json").then(c => config = c).catch(console.error);
        },        
        setData: (data) => {
            return new Promise((resolve, reject) => {
                fetch(config.cacheURLSet, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "key": config.cacheToken
                    },
                    body: JSON.stringify({
                        key: config.cacheKey,
                        value: JSON.stringify(data)
                    })
                })
                .then(r => r.json())
                .then(data => resolve(data.result))
                .catch(err => reject(err.result));
            });
        },
        getData: () => {
            return new Promise((resolve, reject) => {
                fetch(config.cacheURLGet, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                        "key": config.cacheToken
                    },
                    body: JSON.stringify({
                        key: config.cacheKey
                    })
                })
                .then(r => r.json())
                .then(data => resolve(data.result))
                .catch(err => reject(err.result));
            })
        }
    };
}