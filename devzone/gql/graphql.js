/*
This contains code related to GraphQL.

*/

function graphql_request(url, q, cb)
{
	assert (url.constructor === String);
	assert (q.constructor === String);
	assert (cb instanceof Function);
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function ()
	{
		if (xhr.readyState !== 4){return;}
		if (xhr.status !== 200){return;}
		let r = JSON.parse(xhr.responseText);
		if ('data' in r)
		{
			cb(r.data);
		}
	};
	xhr.onerror = function()
	{
		console.log("XHR unknown error. Probobly Cross-Origin Request Blocked");
	}
	var data = JSON.stringify({"query": q});
	xhr.send(data);
}


function graphql_create_params(row)
{
	let q = '';
	for(let c in row)
	{
		if (Number.isInteger(row[c]))
		{
			q += `${c}:${row[c]} `;
		}
		else
		{
			switch(c)
			{
				case 'parser':
					q += `${c}:${row[c]} `;
					break;
				default:
					q += `${c}:${JSON.stringify(row[c])} `;
					break;
			}
		}
	}
	return q;
}

//https://stackoverflow.com/questions/48614730/how-can-i-convert-the-object-array-to-graphql-format-in-javascript
function GraphQL_stringify(obj)
{
	const s1 = JSON.stringify(obj);
	const s2 = s1.replace(/"([^(")"]+)":/g,"$1:");
	return s2;
}