/*
This contains code that is releated to Arena project.
*/

var global_keycloak_url = window.location.origin;
if (global_keycloak_url.includes("localhost"))
{
	global_keycloak_url = "https://afll-lab.testbed.se";
}

var record_statuses = ['DRAFT', 'UNAPPROVED','APPROVED', 'NEEDVERIFICATION', 'RUBBISH', 'GENERATED', 'ARCHIVED'];
var record_statuses_s = {'DRAFT':'⚫', 'UNAPPROVED':'❌','APPROVED':'✔️', 'NEEDVERIFICATION':'🟡', 'RUBBISH':'🗑️', 'GENERATED':'⚙️', 'ARCHIVED':'🗃️'};
var arena_graphql_endpoint = window.location.origin + '/graphql';
var ARENA_RELATIONS = ['UNKNOWN', 'FAVORITE', 'AUTHOR', 'MEMBER'];
var ARENA_PARSE_PROCEDURES = ['UNKNOWN', 'GOTEBORGS_TEKNISKA_COLLEGE', 'LEARNING_4_PROFESSIONALS', 'SUSA_NAVET'];

var arena_graphql_update_lookup = 
{
	'USERS' : 'users_update',
	'COURSES' : 'courses_update',
	'INQUIRIES' : 'inquiries_update',
	'FILEITEMS' : 'fileitems_update',
	'ORGANIZATIONS' : 'organizations_update',
	'KEYWORDS' : 'keywords_update',
	'LANGUAGES' : 'languages_update',
	'CONTENTS' : 'contents_update',
	'ATTRIBUTES' : 'attributes_update',
	'EXTPOINTS' : 'extpoints_update',
};

var arena_table_singular = 
{
	'USERS' : 'user',
	'COURSES' : 'course',
	'INQUIRIES' : 'inquiry',
	'FILEITEMS' : 'fileitem',
	'ORGANIZATIONS' : 'organization',
	'KEYWORDS' : 'keyword',
	'LANGUAGES' : 'language',
	'CONTENTS' : 'content',
	'ATTRIBUTES' : 'attribute',
	'EXTPOINTS' : 'extpoint',
};


function create_element_table_header_pairing(config)
{
	let tr = document.createElement("tr");
	let th = document.createElement("th");
	th.colSpan = 100;
	th.style.width = '500px';
	if (config.columns.includes('pair'))
	{
		th.textContent = `🧑‍🤝‍🧑 ${config.pair.t1}(id) - ${config.pair.relation} - ${config.pair.t2}(${config.pair.id2})`;
	}
	else
	{
		th.textContent = `${config.dbtable}(id)`;
	}
	tr.appendChild(th);
	return th;
}



function html_append_hyperlink_pairing(e, tablename2, row, tablename1, relationship)
{
	console.assert(ARENA_RELATIONS.includes(relationship));
	let a = document.createElement("a");
	let prefix = table_emoji(tablename1);
	a.href = "#"+tablename1+"/pair/"+tablename2+"/" + row.id + "/" + relationship;
	a.textContent = relationship + ' List';
	e.innerHTML = (prefix?prefix+' ':'')+tablename1+'<br>';
	e.appendChild(a);
	return e;
}


function build_edgelist(e, config, name, relationship, title, edges)
{
	// Sanity check
	for (let r in edges)
	{
		console.assert(edges[r], r);
		let row = edges[r].node;
		console.assert(row, 'node is missing in ', edges[r], '. Check if [HotChocolate.Data.UseProjection] is enabled in backend.');
	}

	if(relationship == '')
	{
		for (let r in edges)
		{
			let div = document.createElement('div');
			let row = edges[r].node;
			html_build_column_content(div, config, name, title, row);
			e.appendChild(div);
		}
	}
	else if(relationship == '*')
	{
		for (let r in edges)
		{
			let div = document.createElement('div');
			let row = edges[r].node;
			let span = document.createElement('span');
			div.innerText = edges[r].relationship?.padEnd(10, '-');
			html_build_column_content(span, config, name, title, row);
			div.appendChild(span);
			e.appendChild(div);
		}
	}
	else
	{
		for (let r in edges)
		{
			if (edges[r].relationship == relationship)
			{
				let div = document.createElement('div');
				let row = edges[r].node;
				html_build_column_content(div, config, name, title, row);
				e.appendChild(div);
			}
		}
	}
}







function createClickHandler(tr)
{
	return function(e)
	{
		tr.toggleAttribute("selected");
		//field.toggle = !field.toggle;
		//console.log(field); 
	}
}


function table1_populate_fields(table, schema)
{
	assert ('fields' in schema);
	assert (Array.isArray(schema.fields));
	assert ('nodeName' in table);
	assert (table.nodeName === "TABLE", table.nodeName);
	for (var field_index in schema.fields)
	{
		var field = schema.fields[field_index];
		var r = table.insertRow(-1);
		r.onclick = createClickHandler(r);
		r.insertCell(-1).appendChild(new_abbr(field.name, field.description));
		r.insertCell(-1).textContent = field.type.kind;
		r.insertCell(-1).appendChild(new_abbr(field.type.name, field.type.description));
		if (field.type.ofType === null)
		{
			field.type.ofType = {name:"", description:"", kind:""};
		}
		r.insertCell(-1).textContent = field.type.ofType.kind;
		r.insertCell(-1).appendChild (new_abbr(field.type.ofType.name, field.type.ofType.description));
	}
}


function table1_populate (table, a)
{
	assert (table !== null);
	assert ('nodeName' in table);
	assert (table.nodeName === "TABLE", table.nodeName);
	a.forEach(schema =>
	{
		if (schema.name[0] === '_' && schema.name[1] === '_'){return;}
		if (schema.fields === null) {return;}
		table1_header(table, schema.name);
		table1_populate_fields(table, schema);
	});
}



function table1_load (table, url)
{
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function ()
	{
		if (xhr.readyState !== 4){return;}
		if (xhr.status !== 200){return;}
		if (xhr.responseText === null){return;}
		var r = JSON.parse(xhr.responseText);
		if (r === null){return;}
		if (!('data' in r)){return;}
		if (!('__schema' in r.data)){return;}
		if (!('types' in r.data.__schema)){return;}
		console.log(r.data.__schema.types);
		table1_populate (table, r.data.__schema.types);
	};
	xhr.onerror = function()
	{
		console.log("XHR unknown error. Probobly Cross-Origin Request Blocked");
	}
	var q = `
{
	__schema
	{
		types
		{
			name
			fields
			{
				name
				description
				type
				{
					name
					kind
					description
					ofType
					{
						name
						kind
						description
					}
				}
			}
		}
	}
}
	`
	var data = JSON.stringify({"query": q});
	xhr.send(data);
}







function table2_init(table, url)
{
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function ()
	{
		if (xhr.readyState !== 4){return;}
		if (xhr.status !== 200){return;}
		if (xhr.responseText === null){return;}
		var r = JSON.parse(xhr.responseText);
		if (r === null){return;}
		if (!('data' in r)){return;}
		console.log(r);
		table2_generate (table, r.data);
	};
	xhr.onerror = function()
	{
		console.log("XHR unknown error. Probably Cross-Origin Request Blocked");
	}
	var q = `
query
{
	courses
	{
		id
		title
		price
	}
	keywords
	{
		id
		name
	}
}
	`
	var data = JSON.stringify({"query": q});
	xhr.send(data);
}


function table2_generate(tables, schemas)
{
	for (var schema in schemas)
	{
		var table = document.createElement('table');
		var h4 = document.createElement('h4');
		h4.textContent = schema;
		tables.appendChild(h4);
		tables.appendChild(table);
		var tr = table.insertRow(-1);
		for (var field in schemas[schema][0])
		{
			var th = document.createElement('th');
			th.textContent = field;
			tr.appendChild(th);
		}
		for (var row in schemas[schema])
		{
			tr = table.insertRow(-1);
			for (var cell in schemas[schema][row])
			{
				var td = document.createElement('td');
				td.textContent = schemas[schema][row][cell];
				tr.appendChild(td);
			}
		}
	}
}








function make_pair(t1,id1,relation,t2,id2,onload)
{
	console.assert(ARENA_RELATIONS.includes(relation));
	console.log(`Pairing ${t1}/${id1} to ${t2}/${id2} as ${relation}`);
	let xhr = new XMLHttpRequest();
	xhr.open("POST", window.location.origin + "/graphql", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function ()
	{
		let r = JSON.parse(xhr.response);
		if (r.data === null){return;}
		if (onload != null)
		{
			//console.log("request", q, "response", r.data);
			onload(r.data.pair);
		}
	};
	xhr.onerror = function()
	{
		console.log("XHR unknown error. Probobly Cross-Origin Request Blocked");
	}
	let q = "mutation{pair(t1:" + t1 + ", id1:" + id1 + ", relation:" + relation + ", t2:" + t2 + ", id2:"+id2+")}";
	let data = JSON.stringify({"query": q});
	xhr.send(data);
}



function make_unpair(t1,id1,relation,t2,id2,onload)
{
	console.assert(ARENA_RELATIONS.includes(relation));
	console.log(`Unpairing ${t1}/${id1} to ${t2}/${id2} as ${relation}`);
	let xhr = new XMLHttpRequest();
	xhr.open("POST", window.location.origin + "/graphql", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function ()
	{
		let r = JSON.parse(xhr.response);
		if (r.data === null){return;}
		if (onload != null)
		{
			//console.log("request", q, "response", r.data);
			onload(r.data.unpair);
		}
	};
	xhr.onerror = function()
	{
		console.log("XHR unknown error. Probobly Cross-Origin Request Blocked");
	}
	let q = "mutation{unpair(t1:" + t1 + ", id1:" + id1 + ", relation:" + relation + ", t2:" + t2 + ", id2:"+id2+")}";
	let data = JSON.stringify({"query": q});
	xhr.send(data);
}






function create_element_a_keycloak_user_url(id)
{
	let e = document.createElement('a');
	e.textContent = id;
	e.href = global_keycloak_url + "/auth/admin/master/console/#/realms/arenarealm/users/" + id;
	return e;
}



