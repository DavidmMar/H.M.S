module.exports = {
    removeIds,
    separateTimestamp,
    formatTimestamp
}

/**
 * 
 * @param {Array[Object]} dataList 
 * @returns Same array of objects but without the property id on each of the objects
 */
function removeIds(dataList) {
    return dataList.map(data => {
        delete data.id
        return data
    })
}

/**
 * 
 * @param {String} timestamp 
 * @returns Object 
 * @note Assumes timestamp of type 1970-01-10T00:00:00Z
 * 
 */
function separateTimestamp(timestamp) {
    timestamp = timestamp.split("T")
    let date = timestamp[0].split("-")
    let time = timestamp[1].split(":")

    // construct new Obj  
    return {
        "year": date[0],
        "month": date[1],
        "day": date[2],
        "hour": time[0],
        "min": time[1],
        "sec": time[2].slice(0, -1)     //remove Z at the end
    }
}

/**
 * 
 * @param {String} timestamp 
 * @returns String
 * @note Returns the timestamp without any extra chars
 */
function formatTimestamp(timestamp) {
    timestamp = timestamp.split("T")
    let date = timestamp[0]
    let time = timestamp[1].slice(0, -1)   //remove Z at the end

    return `${date} ${time}`
}
