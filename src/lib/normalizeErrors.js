module.exports = errors => errors.reduce((prev, next) => {
    if (next.path in prev) {
        prev[next.path].push(next.message)
    } else {
        prev[next.path] = [next.message]
    }
    return prev
}, {})