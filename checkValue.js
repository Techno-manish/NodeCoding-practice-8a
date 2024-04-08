function hasStatus(requestQuery) {
  return requestQuery.status !== undefined
}

function hasPriority(requestQuery) {
  return requestQuery.priority !== undefined
}

function hasStatusAndPriority(requestQuery) {
  return (
    requestQuery.status !== undefined && requestQuery.priority !== undefined
  )
}

function hasTodo(requestQuery) {
  return requestQuery.todo !== undefined
}

exports.hasStatus = hasStatus
exports.hasPriority = hasPriority
exports.hasStatusAndPriority = hasStatusAndPriority
exports.hasTodo = hasTodo
