





let Backend = {};


/**
 * Set or unset a relation between two rows.
 * @param {string} q       - A GraphQL query or mutation
 */
Backend.qfetch = async (q) =>
{
	console.assert(typeof(q) === 'string');
	let body = {query:q};
	return fetch('/graphql', {
		method:"post", 
		headers: {'Accept': 'application/json','Content-Type': 'application/json'}, 
		body:JSON.stringify(body)
	}).then(r => r.json());
}

/**
 * Set or unset a relation between two rows.
 * @param {string} t1       - The enum name of the table. e.g. USERS, COURSES, ORGANIZATIONS, ...
 * @param {number} id1      - The id of the row
 * @param {string} relation - The relation
 * @param {string} t2       - The enum name of the table. e.g. USERS, COURSES, ORGANIZATIONS, ...
 * @param {number} id2      - The id of the row
 */
Backend.pair = async (t1,id1,relation,t2,id2, value) =>
{
	console.assert(typeof(t1) === 'string');
	console.assert(typeof(id1) === 'number');
	console.assert(typeof(relation) === 'string');
	console.assert(typeof(t2) === 'string');
	console.assert(typeof(id2) === 'number', id2, typeof(id2));
	if (value == true)
	{
		return Backend.qfetch(`mutation{pair(t1:${t1},id1:${id1},relation:${relation},t2:${t2},id2:${id2})}`).then(x => {
			return x.data.pair;
			//console.log(x);
		});
	}
	else if(value == false)
	{
		return Backend.qfetch(`mutation{unpair(t1:${t1},id1:${id1},relation:${relation},t2:${t2},id2:${id2})}`).then(x => {
			return x.data.unpair;
			//console.log(x);
		});
	}
}



/**
 * Updates a row in the database
 * @param {string} table - The enum name of the table. e.g. USERS, COURSES, ORGANIZATIONS, ...
 * @param {number} id - The id of the row
 * 
 * public int record_update([Service] Arena_Context context, Table table, int id, Dictionary<string,string> val_str, Dictionary<string,int> val_int)
 */
Backend.update = async (table, ids, data) =>
{
	console.assert(typeof(table) === 'string');
	console.assert(Array.isArray(ids));
	let val_str = [];
	let val_int = [];
	for(let c in data)
	{
		if(typeof(data[c]) == 'string')
		{
			val_str.push({key:c, value:data[c]});
		}
		if(typeof(data[c]) == 'number')
		{
			val_int.push({key:c, value:data[c]});
		}
	}
	let json_str = graphql_stringify(val_int);
	let json_int = graphql_stringify(val_str);
	return Backend.qfetch(`mutation{record_update(table:${table}, ids:[${ids.join(',')}], val_int:${json_str}, val_str:${json_int})}`).then(x => {
		if(x.errors)
		{
			console.log(x.errors);
			return null;
		}
		return x.data.record_update;
		//console.log(x);
	});
}