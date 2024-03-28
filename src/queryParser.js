function parseQuery(query) {
    const selectRegex = /SELECT (.+?) FROM (.+?)(?: INNER JOIN (.+?) ON (.+?))?(?: WHERE (.*))?$/i;
    const match = query.match(selectRegex);

    if (match) {
        const [, fields, table, joinTable, joinCondition, whereString] = match;
        const whereClauses = whereString ? parseWhereClause(whereString) : [];
        const joinConditionParsed = joinCondition ? parseJoinCondition(joinCondition) : null;
        return {
            fields: fields.split(',').map(field => field.trim()),
            table: table.trim(),
            joinTable: joinTable ? joinTable.trim() : null,
            joinCondition: joinConditionParsed,
            whereClauses
        };
    } else {
        throw new Error('Invalid query format');
    }
}

function parseWhereClause(whereString) {
    const conditionRegex = /(.*?)(=|!=|>|<|>=|<=)(.*)/;
    return whereString.split(/ AND | OR /i).map(conditionString => {
        const match = conditionString.match(conditionRegex);
        if (match) {
            const [, field, operator, value] = match;
            return { field: field.trim(), operator, value: value.trim() };
        }else{
        throw new Error('Invalid WHERE clause format');
        }
    });
}

function parseJoinCondition(joinCondition) {
    const joinRegex = /\s*([\w.]+)\s*=\s*([\w.]+)/i;
    const match = joinCondition.match(joinRegex);
    if (match) {
        const [, left, right] = match;
        return { left: left.trim(), right: right.trim() };
    } else {
        throw new Error('Invalid JOIN condition format');
    }
}

module.exports = parseQuery;